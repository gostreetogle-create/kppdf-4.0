import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { generateId, nowISO } from './crud-factory.js';
import { WorkerService } from './worker.service.js';
import { ProductService } from './product.service.js';
import { ProductComponentService } from './product-component.service.js';
import type { ApiResponse, OrderTask, TaskStatus, ProductComponent, MissingDataIssue, ProductionOrder } from '../../../shared/types/index.js';

const SEED_TASKS: OrderTask[] = [
  // ПЗ-0001 — Стойка баскетбольная БСФП-120
  { id: 'ot-1', productionOrderId: 'po-1', componentId: 'comp-1', componentName: 'Стойка (колонна)', workTypeId: 'wt-1', workTypeName: 'Лазерная резка', workerId: 'wkr-1', status: 'done', plannedHours: 0.5, actualHours: 0.6, plannedStartDate: '2026-06-02', plannedEndDate: '2026-06-02', actualEndDate: '2026-06-02', dependsOnTaskIds: [], sortOrder: 1, createdAt: '2026-06-01T10:00:00.000Z', updatedAt: '2026-06-02T16:00:00.000Z' },
  { id: 'ot-2', productionOrderId: 'po-1', componentId: 'comp-1', componentName: 'Стойка (колонна)', workTypeId: 'wt-3', workTypeName: 'Полуавтоматическая сварка', workerId: 'wkr-2', status: 'in_progress', plannedHours: 2.0, plannedStartDate: '2026-06-03', plannedEndDate: '2026-06-05', dependsOnTaskIds: ['ot-1'], sortOrder: 2, createdAt: '2026-06-01T10:00:00.000Z', updatedAt: '2026-06-03T10:00:00.000Z' },
  { id: 'ot-3', productionOrderId: 'po-1', componentId: 'comp-1', componentName: 'Стойка (колонна)', workTypeId: 'wt-5', workTypeName: 'Порошковая покраска', status: 'pending', plannedHours: 1.5, plannedStartDate: '2026-06-06', plannedEndDate: '2026-06-07', dependsOnTaskIds: ['ot-2'], sortOrder: 3, createdAt: '2026-06-01T10:00:00.000Z', updatedAt: '2026-06-01T10:00:00.000Z' },
  { id: 'ot-4', productionOrderId: 'po-1', componentId: 'comp-2', componentName: 'Щит баскетбольный', workTypeId: 'wt-1', workTypeName: 'Лазерная резка', workerId: 'wkr-1', status: 'done', plannedHours: 1.0, actualHours: 0.9, plannedStartDate: '2026-06-02', plannedEndDate: '2026-06-03', actualEndDate: '2026-06-03', dependsOnTaskIds: [], sortOrder: 4, createdAt: '2026-06-01T10:00:00.000Z', updatedAt: '2026-06-03T12:00:00.000Z' },
  { id: 'ot-5', productionOrderId: 'po-1', componentId: 'comp-2', componentName: 'Щит баскетбольный', workTypeId: 'wt-9', workTypeName: 'Слесарные работы', workerId: 'wkr-5', status: 'assigned', plannedHours: 1.5, plannedStartDate: '2026-06-04', plannedEndDate: '2026-06-05', dependsOnTaskIds: ['ot-4'], sortOrder: 5, createdAt: '2026-06-01T10:00:00.000Z', updatedAt: '2026-06-03T15:00:00.000Z' },
  { id: 'ot-6', productionOrderId: 'po-1', componentId: 'comp-3', componentName: 'Кольцо баскетбольное', workTypeId: 'wt-8', workTypeName: 'Обычная сварка', status: 'pending', plannedHours: 0.5, plannedStartDate: '2026-06-08', plannedEndDate: '2026-06-08', dependsOnTaskIds: [], sortOrder: 6, createdAt: '2026-06-01T10:00:00.000Z', updatedAt: '2026-06-01T10:00:00.000Z' },
  // ПЗ-0002 — Скамейка парковая СК-180
  { id: 'ot-7', productionOrderId: 'po-2', componentId: 'comp-6', componentName: 'Каркас металлический', workTypeId: 'wt-1', workTypeName: 'Лазерная резка', status: 'pending', plannedHours: 0.5, plannedStartDate: '2026-06-16', plannedEndDate: '2026-06-16', dependsOnTaskIds: [], sortOrder: 1, createdAt: '2026-06-05T11:00:00.000Z', updatedAt: '2026-06-05T11:00:00.000Z' },
  { id: 'ot-8', productionOrderId: 'po-2', componentId: 'comp-6', componentName: 'Каркас металлический', workTypeId: 'wt-3', workTypeName: 'Полуавтоматическая сварка', status: 'pending', plannedHours: 1.0, plannedStartDate: '2026-06-17', plannedEndDate: '2026-06-17', dependsOnTaskIds: ['ot-7'], sortOrder: 2, createdAt: '2026-06-05T11:00:00.000Z', updatedAt: '2026-06-05T11:00:00.000Z' },
];

/** ID виртуальных «работ» для авто-задач */
const MISSING_DRAWING_WT_ID = 'wt-missing-drawing';
const MISSING_MATERIALS_WT_ID = 'wt-missing-materials';
const MISSING_WORKTYPES_WT_ID = 'wt-missing-worktypes';

@Injectable({ providedIn: 'root' })
export class OrderTaskService {
  delayMs = 100;
  items: OrderTask[] = SEED_TASKS.map(t => ({ ...t, dependsOnTaskIds: [...t.dependsOnTaskIds] }));

  private _workerSvc?: WorkerService;
  private _productSvc?: ProductService;
  private _compSvc?: ProductComponentService;

  private get workerSvc(): WorkerService {
    if (!this._workerSvc) this._workerSvc = new WorkerService();
    return this._workerSvc;
  }
  private get productSvc(): ProductService {
    if (!this._productSvc) this._productSvc = new ProductService();
    return this._productSvc;
  }
  private get compSvc(): ProductComponentService {
    if (!this._compSvc) this._compSvc = new ProductComponentService();
    return this._compSvc;
  }

  getTasks(orderId?: string): Observable<ApiResponse<OrderTask[]>> {
    const tasks = orderId
      ? this.items.filter(t => t.productionOrderId === orderId).sort((a, b) => a.sortOrder - b.sortOrder)
      : [...this.items].sort((a, b) => a.sortOrder - b.sortOrder);
    return of({ success: true, data: tasks.map(t => ({ ...t, dependsOnTaskIds: [...t.dependsOnTaskIds] })) }).pipe(delay(this.delayMs));
  }

  changeStatus(id: string, status: TaskStatus): Observable<ApiResponse<OrderTask>> {
    const t = this.items.find(x => x.id === id);
    if (!t) return of({ success: false, data: undefined as unknown as OrderTask, message: 'Задача не найдена' }).pipe(delay(this.delayMs));

    // Проверяем зависимости: нельзя начать, пока все dependsOn не done
    if (status === 'in_progress' && t.dependsOnTaskIds.length > 0) {
      const blockers = t.dependsOnTaskIds
        .map(depId => this.items.find(x => x.id === depId))
        .filter(dep => dep && dep.status !== 'done');
      if (blockers.length > 0) {
        const names = blockers.map(b => b!.componentName + ' — ' + b!.workTypeName).join(', ');
        return of({ success: false, data: undefined as unknown as OrderTask, message: `Блокирующие задачи не выполнены: ${names}` }).pipe(delay(this.delayMs));
      }
    }

    const now = nowISO();
    const updated = { ...t, status, updatedAt: now,
      ...(status === 'in_progress' && !t.actualStartDate ? { actualStartDate: now.substring(0, 10) } : {}),
      ...(status === 'done' ? { actualEndDate: now.substring(0, 10), actualHours: t.actualHours ?? t.plannedHours } : {}),
    };
    this.items = this.items.map(x => x.id === id ? updated : x);
    return of({ success: true, data: { ...updated, dependsOnTaskIds: [...updated.dependsOnTaskIds] } }).pipe(delay(this.delayMs));
  }

  // ═══ Авто-назначение исполнителей ═══

  /** Найти свободных работников для данной работы */
  getAvailableWorkers(workTypeId: string): Observable<ApiResponse<{ id: string; fullName: string; grade: number; busyUntil?: string }[]>> {
    const workers = this.workerSvc.getRawItems().filter(w => w.isActive && w.workTypeIds.includes(workTypeId));
    const busyWorkers = new Map<string, string>(); // workerId → max end date

    for (const t of this.items) {
      if (t.workerId && (t.status === 'assigned' || t.status === 'in_progress')) {
        const currentMax = busyWorkers.get(t.workerId);
        const taskEnd = t.actualEndDate || t.plannedEndDate || '';
        if (!currentMax || taskEnd > currentMax) {
          busyWorkers.set(t.workerId, taskEnd);
        }
      }
    }

    const available = workers.map(w => ({
      id: w.id,
      fullName: `${w.lastName} ${w.firstName}${w.patronymic ? ' ' + w.patronymic : ''}`,
      grade: w.grade,
      busyUntil: busyWorkers.get(w.id),
    })).sort((a, b) => (a.busyUntil ? 1 : 0) - (b.busyUntil ? 1 : 0)); // свободные первыми

    return of({ success: true, data: available }).pipe(delay(this.delayMs));
  }

  /** Авто-назначить ближайшего свободного */
  autoAssignWorker(taskId: string): Observable<ApiResponse<OrderTask>> {
    const task = this.items.find(t => t.id === taskId);
    if (!task) return of({ success: false, data: undefined as unknown as OrderTask, message: 'Задача не найдена' }).pipe(delay(this.delayMs));
    if (task.workerId) return of({ success: false, data: undefined as unknown as OrderTask, message: 'Исполнитель уже назначен' }).pipe(delay(this.delayMs));

    const workers = this.workerSvc.getRawItems().filter(w => w.isActive && w.workTypeIds.includes(task.workTypeId));
    if (!workers.length) return of({ success: false, data: undefined as unknown as OrderTask, message: 'Нет работников для этого вида работ' }).pipe(delay(this.delayMs));

    // Найти наименее загруженного (по последней дате занятости)
    const busyUntil = new Map<string, string>();
    for (const t of this.items) {
      if (t.workerId && (t.status === 'assigned' || t.status === 'in_progress')) {
        const cur = busyUntil.get(t.workerId);
        const end = t.actualEndDate || t.plannedEndDate || '';
        if (!cur || end > cur) busyUntil.set(t.workerId, end);
      }
    }

    const best = workers
      .map(w => ({ worker: w, busy: busyUntil.get(w.id) || '0000-00-00' }))
      .sort((a, b) => a.busy.localeCompare(b.busy))[0]!;

    const updated = { ...task, workerId: best.worker.id, status: 'assigned' as TaskStatus, updatedAt: nowISO() };
    this.items = this.items.map(x => x.id === taskId ? updated : x);
    return of({ success: true, data: { ...updated, dependsOnTaskIds: [...updated.dependsOnTaskIds] } }).pipe(delay(this.delayMs));
  }

  /** Вручную назначить исполнителя */
  assignWorker(taskId: string, workerId: string): Observable<ApiResponse<OrderTask>> {
    const task = this.items.find(t => t.id === taskId);
    if (!task) return of({ success: false, data: undefined as unknown as OrderTask, message: 'Задача не найдена' }).pipe(delay(this.delayMs));

    const updated = { ...task, workerId, status: 'assigned' as TaskStatus, updatedAt: nowISO() };
    this.items = this.items.map(x => x.id === taskId ? updated : x);
    return of({ success: true, data: { ...updated, dependsOnTaskIds: [...updated.dependsOnTaskIds] } }).pipe(delay(this.delayMs));
  }

  // ═══ Проверка комплектации и авто-задачи ═══

  /** Проверить готовность заказа к производству — найти недостающие данные */
  checkMissingData(orderId: string, order: ProductionOrder): Observable<ApiResponse<MissingDataIssue[]>> {
    const issues: MissingDataIssue[] = [];

    const product = this.productSvc.getRawItems().find(p => p.id === order.productId);
    if (!product) {
      issues.push({ type: 'incomplete_spec', componentId: '', componentName: order.productName, detail: 'Товар не найден в справочнике' });
      return of({ success: true, data: issues }).pipe(delay(this.delayMs));
    }

    // Проверяем компоненты товара
    const components = this.compSvc.getRawItems().filter(c => c.productId === order.productId);

    if (!components.length) {
      issues.push({ type: 'incomplete_spec', componentId: '', componentName: order.productName, detail: 'Нет компонентов в BOM (спецификации). Нужен инженер-конструктор.' });
      return of({ success: true, data: issues }).pipe(delay(this.delayMs));
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

    return of({ success: true, data: issues }).pipe(delay(this.delayMs));
  }

  /** Сгенерировать авто-задачи на основе проблем комплектации */
  generateMissingDataTasks(orderId: string, issues: MissingDataIssue[]): Observable<ApiResponse<OrderTask[]>> {
    let sortOrder = this.items.filter(t => t.productionOrderId === orderId).length + 1;
    const now = nowISO();
    const newTasks: OrderTask[] = [];

    for (const issue of issues) {
      // Уже есть задача на эту проблему?
      const exists = this.items.some(t => t.productionOrderId === orderId && t.notes === `auto:${issue.type}:${issue.componentId}`);
      if (exists) continue;

      const wtName = issue.type === 'no_drawing' ? '🧠 Разработка чертежа' :
                     issue.type === 'no_materials' ? '📦 Спецификация материалов' :
                     issue.type === 'no_work_types' ? '🔧 Спецификация работ' : '❓ Уточнение данных';
      const wtId = issue.type === 'no_drawing' ? MISSING_DRAWING_WT_ID :
                   issue.type === 'no_materials' ? MISSING_MATERIALS_WT_ID :
                   issue.type === 'no_work_types' ? MISSING_WORKTYPES_WT_ID : 'wt-missing-other';

      const task: OrderTask = {
        id: generateId(),
        productionOrderId: orderId,
        componentId: issue.componentId,
        componentName: issue.componentName || '—',
        workTypeId: wtId,
        workTypeName: wtName,
        status: 'pending',
        plannedHours: 4,
        dependsOnTaskIds: [],
        sortOrder: sortOrder++,
        notes: `auto:${issue.type}:${issue.componentId}`,
        createdAt: now,
        updatedAt: now,
      };
      this.items.push(task);
      newTasks.push(task);
    }

    return of({ success: true, data: newTasks.map(t => ({ ...t, dependsOnTaskIds: [...t.dependsOnTaskIds] })) }).pipe(delay(this.delayMs));
  }

  // ═══ Генерация из BOM ═══

  generateFromComponents(orderId: string, components: ProductComponent[]): Observable<ApiResponse<OrderTask[]>> {
    let sortOrder = this.items.filter(t => t.productionOrderId === orderId).length + 1;
    const now = nowISO();
    // Группируем задачи по компонентам для зависимостей
    const prevTasksByComponent = new Map<string, string>(); // componentId → last taskId

    for (const comp of components) {
      for (const wt of comp.workTypes) {
        const dependsOnTaskIds: string[] = [];
        const prev = prevTasksByComponent.get(comp.id);
        if (prev) dependsOnTaskIds.push(prev);

        const task: OrderTask = {
          id: generateId(),
          productionOrderId: orderId,
          componentId: comp.id,
          componentName: comp.name,
          workTypeId: wt.id,
          workTypeName: wt.name,
          status: 'pending',
          plannedHours: wt.normHours * comp.quantityPerProduct,
          dependsOnTaskIds,
          sortOrder: sortOrder++,
          createdAt: now,
          updatedAt: now,
        };
        this.items.push(task);
        prevTasksByComponent.set(comp.id, task.id);
      }
    }
    return this.getTasks(orderId);
  }
}
