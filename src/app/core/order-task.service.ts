import { Injectable, inject } from '@angular/core';
import { Observable, from, map, firstValueFrom } from 'rxjs';
import { WorkerService } from './worker.service.js';
import { ProductService } from './product.service.js';
import { ProductComponentService } from './product-component.service.js';
import { ApiService } from './api.service.js';
import type {
  ApiResponse, OrderTask, TaskStatus, ProductComponent,
  MissingDataIssue, ProductionOrder, Worker, Product,
} from '../../../shared/types/index.js';

/** ID виртуальных «работ» для авто-задач */
const MISSING_DRAWING_WT_ID = 'wt-missing-drawing';
const MISSING_MATERIALS_WT_ID = 'wt-missing-materials';
const MISSING_WORKTYPES_WT_ID = 'wt-missing-worktypes';

@Injectable({ providedIn: 'root' })
export class OrderTaskService {
  private api = inject(ApiService);
  private workerSvc = inject(WorkerService);
  private productSvc = inject(ProductService);
  private compSvc = inject(ProductComponentService);
  private basePath = '/order-tasks';

  /** Кеши справочных данных */
  private cachedWorkers: Worker[] | null = null;
  private cachedProducts: Product[] | null = null;

  private async ensureWorkers(): Promise<Worker[]> {
    if (!this.cachedWorkers) {
      const res = await firstValueFrom(this.workerSvc.getAll());
      this.cachedWorkers = res.success ? res.data : [];
    }
    return this.cachedWorkers;
  }

  private async ensureProducts(): Promise<Product[]> {
    if (!this.cachedProducts) {
      const res = await firstValueFrom(this.productSvc.getAll());
      this.cachedProducts = res.success ? res.data : [];
    }
    return this.cachedProducts;
  }

  // ═══════════════════════════════════════════
  // CRUD через HTTP
  // ═══════════════════════════════════════════

  getTasks(orderId?: string): Observable<ApiResponse<OrderTask[]>> {
    const params: Record<string, string> = {};
    if (orderId) params['productionOrderId'] = orderId;
    return this.api.get<OrderTask[]>(this.basePath, params);
  }

  // ═══════════════════════════════════════════
  // Мутации статуса / исполнителя / дат
  // ═══════════════════════════════════════════

  /** Сменить статус задачи (с клиентской проверкой зависимостей) */
  changeStatus(id: string, status: TaskStatus): Observable<ApiResponse<OrderTask>> {
    return from((async () => {
    const validStatuses: TaskStatus[] = ['pending', 'assigned', 'in_progress', 'done', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return { success: false, data: undefined as unknown as OrderTask, message: `Недопустимый статус: ${status}` };
    }

    if (status === 'in_progress') {
      const taskRes = await firstValueFrom(this.api.getById<OrderTask>(this.basePath, id));
      const task = taskRes.data;
      if (task && task.dependsOnTaskIds.length > 0) {
        const allRes = await firstValueFrom(this.getTasks(task.productionOrderId));
        const allTasks = allRes.data ?? [];
        const blockers = task.dependsOnTaskIds
          .map(depId => allTasks.find(t => t.id === depId))
          .filter(dep => dep && dep.status !== 'done');
        if (blockers.length > 0) {
          const names = blockers.map(b => b!.componentName + ' — ' + b!.workTypeName).join(', ');
          return { success: false, data: undefined as unknown as OrderTask, message: `Блокирующие задачи не выполнены: ${names}` };
        }
      }
    }

    return firstValueFrom(this.api.patch<OrderTask>(`${this.basePath}/${id}/status`, { status }));
    })());
  }

  /** Назначить исполнителя вручную */
  assignWorker(taskId: string, workerId: string): Observable<ApiResponse<OrderTask>> {
    return this.api.patch<OrderTask>(`${this.basePath}/${taskId}/assign`, { workerId });
  }

  /** Обновить плановые даты (drag-and-drop в Ганте) */
  updateDates(id: string, plannedStartDate?: string, plannedEndDate?: string): Observable<ApiResponse<OrderTask>> {
    return this.api.patch<OrderTask>(`${this.basePath}/${id}/dates`, { plannedStartDate, plannedEndDate });
  }

  // ═══════════════════════════════════════════
  // Авто-назначение исполнителей
  // ═══════════════════════════════════════════

  /** Найти свободных работников для данного вида работ */
  getAvailableWorkers(workTypeId: string): Observable<ApiResponse<{ id: string; fullName: string; grade: number; busyUntil?: string }[]>> {
    return from((async () => {
      const workers = await this.ensureWorkers();
      const available = workers.filter(w => w.isActive && w.workTypeIds.includes(workTypeId));

      // Загружаем все активные задачи для вычисления занятости
      const allRes = await firstValueFrom(this.getTasks());
      const allTasks = allRes.data ?? [];
      const busyWorkers = new Map<string, string>();
      for (const t of allTasks) {
        if (t.workerId && (t.status === 'assigned' || t.status === 'in_progress')) {
          const cur = busyWorkers.get(t.workerId);
          const end = t.actualEndDate || t.plannedEndDate || '';
          if (!cur || end > cur) busyWorkers.set(t.workerId, end);
        }
      }

      const data = available.map(w => ({
        id: w.id,
        fullName: `${w.lastName} ${w.firstName}${w.patronymic ? ' ' + w.patronymic : ''}`,
        grade: w.grade,
        busyUntil: busyWorkers.get(w.id),
      })).sort((a, b) => (a.busyUntil ? 1 : 0) - (b.busyUntil ? 1 : 0));

      return { success: true, data };
    })());
  }

  /** Авто-назначить ближайшего свободного */
  autoAssignWorker(taskId: string): Observable<ApiResponse<OrderTask>> {
    return from((async () => {
    const taskRes = await firstValueFrom(this.api.getById<OrderTask>(this.basePath, taskId));
    const task = taskRes.data;
    if (!task) return { success: false, data: undefined as unknown as OrderTask, message: 'Задача не найдена' };
    if (task.workerId) return { success: false, data: undefined as unknown as OrderTask, message: 'Исполнитель уже назначен' };

    const workers = await this.ensureWorkers();
    const available = workers.filter(w => w.isActive && w.workTypeIds.includes(task.workTypeId));
    if (!available.length) {
      return { success: false, data: undefined as unknown as OrderTask, message: 'Нет работников для этого вида работ' };
    }

    // Загружаем все активные задачи для вычисления занятости
    const allRes = await firstValueFrom(this.getTasks());
    const allTasks = allRes.data ?? [];
    const busyUntil = new Map<string, string>();
    for (const t of allTasks) {
      if (t.workerId && (t.status === 'assigned' || t.status === 'in_progress')) {
        const cur = busyUntil.get(t.workerId);
        const end = t.actualEndDate || t.plannedEndDate || '';
        if (!cur || end > cur) busyUntil.set(t.workerId, end);
      }
    }

    const best = available
      .map(w => ({ worker: w, busy: busyUntil.get(w.id) || '0000-00-00' }))
      .sort((a, b) => a.busy.localeCompare(b.busy))[0]!;

    return await firstValueFrom(this.assignWorker(taskId, best.worker.id));
    })());
  }

  // ═══════════════════════════════════════════
  // Проверка комплектации и авто-задачи
  // ═══════════════════════════════════════════

  /** Проверить готовность заказа к производству — найти недостающие данные */
  checkMissingData(orderId: string, order: ProductionOrder): Observable<ApiResponse<MissingDataIssue[]>> {
    return from(this.ensureProducts()).pipe(
      map(products => {
        const issues: MissingDataIssue[] = [];
        const product = products.find(p => p.id === order.productId);

        if (!product) {
          issues.push({ type: 'incomplete_spec', componentId: '', componentName: order.productName, detail: 'Товар не найден в справочнике' });
          return { success: true, data: issues };
        }

        const components = this.compSvc.getRawItems().filter(c => c.productId === order.productId);

        if (!components.length) {
          issues.push({ type: 'incomplete_spec', componentId: '', componentName: order.productName, detail: 'Нет компонентов в BOM (спецификации). Нужен инженер-конструктор.' });
          return { success: true, data: issues };
        }

        for (const comp of components) {
          if (!comp.drawingUrl && product.hasDrawing) {
            issues.push({ type: 'no_drawing', componentId: comp.id, componentName: comp.name, detail: `Нет чертежа для компонента «${comp.name}». Требуется проектировщик.` });
          }
          if (!comp.materials || comp.materials.length === 0) {
            issues.push({ type: 'no_materials', componentId: comp.id, componentName: comp.name, detail: `Не указаны материалы для компонента «${comp.name}». Требуется снабженец / инженер.` });
          }
          if (!comp.workTypes || comp.workTypes.length === 0) {
            issues.push({ type: 'no_work_types', componentId: comp.id, componentName: comp.name, detail: `Не указаны виды работ для компонента «${comp.name}». Требуется инженер-конструктор.` });
          }
        }

        return { success: true, data: issues };
      }),
    );
  }

  /** Сгенерировать авто-задачи на основе проблем комплектации */
  generateMissingDataTasks(orderId: string, issues: MissingDataIssue[]): Observable<ApiResponse<OrderTask[]>> {
    return from((async () => {
    const allRes = await firstValueFrom(this.getTasks(orderId));
    const existingTasks = allRes.data ?? [];
    let sortOrder = existingTasks.length + 1;
    const newTasks: OrderTask[] = [];

    for (const issue of issues) {
      const note = `auto:${issue.type}:${issue.componentId}`;
      const exists = existingTasks.some(t => t.notes === note);
      if (exists) continue;

      const wtName = issue.type === 'no_drawing' ? '🧠 Разработка чертежа' :
                     issue.type === 'no_materials' ? '📦 Спецификация материалов' :
                     issue.type === 'no_work_types' ? '🔧 Спецификация работ' : '❓ Уточнение данных';
      const wtId = issue.type === 'no_drawing' ? MISSING_DRAWING_WT_ID :
                   issue.type === 'no_materials' ? MISSING_MATERIALS_WT_ID :
                   issue.type === 'no_work_types' ? MISSING_WORKTYPES_WT_ID : 'wt-missing-other';

      const res = await firstValueFrom(this.api.post<OrderTask>(this.basePath, {
        productionOrderId: orderId,
        componentId: issue.componentId,
        componentName: issue.componentName || '—',
        workTypeId: wtId,
        workTypeName: wtName,
        status: 'pending',
        plannedHours: 4,
        dependsOnTaskIds: [],
        sortOrder: sortOrder++,
        notes: note,
      }));
      if (res.success && res.data) newTasks.push(res.data);
    }

    return { success: true, data: newTasks };
    })());
  }

  // ═══════════════════════════════════════════
  // Генерация задач из BOM
  // ═══════════════════════════════════════════

  /** Сгенерировать задачи из компонентов (BOM) */
  generateFromComponents(orderId: string, components: ProductComponent[]): Observable<ApiResponse<OrderTask[]>> {
    return from((async () => {
    const allRes = await firstValueFrom(this.getTasks(orderId));
    const existingTasks = allRes.data ?? [];
    let sortOrder = existingTasks.length + 1;
    const prevTasksByComponent = new Map<string, string>();
    const created: OrderTask[] = [];

    for (const comp of components) {
      for (const wt of comp.workTypes) {
        const dependsOnTaskIds: string[] = [];
        const prev = prevTasksByComponent.get(comp.id);
        if (prev) dependsOnTaskIds.push(prev);

        const res = await firstValueFrom(this.api.post<OrderTask>(this.basePath, {
          productionOrderId: orderId,
          componentId: comp.id,
          componentName: comp.name,
          workTypeId: wt.id,
          workTypeName: wt.name,
          status: 'pending',
          plannedHours: wt.normHours * comp.quantityPerProduct,
          dependsOnTaskIds,
          sortOrder: sortOrder++,
        }));
        if (res.success && res.data) {
          created.push(res.data);
          prevTasksByComponent.set(comp.id, res.data.id);
        }
      }
    }

    return { success: true, data: created };
    })());
  }
}
