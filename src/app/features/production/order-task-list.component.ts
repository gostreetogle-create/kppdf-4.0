import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn, TableExtraAction } from '../../shared/ui/kp-table.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';
import { OrderTaskService } from '../../core/order-task.service';
import { ProductionOrderService } from '../../core/production-order.service';
import type { OrderTask, ProductionOrder, TaskStatus, MissingDataIssue } from '../../../../shared/types/index.js';

const STATUS_LABELS: Record<TaskStatus, string> = { pending: 'Ожидает', assigned: 'Назначена', in_progress: 'В работе', done: '✅ Выполнена', cancelled: 'Отменена' };
const NEXT_STATUS: Partial<Record<TaskStatus, TaskStatus>> = { pending: 'assigned', assigned: 'in_progress', in_progress: 'done' };

@Component({
  selector: 'app-order-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, KpButtonComponent, KpBreadcrumbComponent, KpCardComponent, KpTableComponent, KpSelectComponent, KpDialogComponent, KpToastComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs()" />
      <div class="ot-header">
        <h2 class="page__title">📝 Задачи</h2>
        <div class="ot-controls">
          <kp-select [options]="orderOptions()" [(ngModel)]="filterOrderId" placeholder="Все заказы" styleClass="ot-filter" (ngModelChange)="load()" />
          <kp-button label="🔍 Проверить комплектацию" severity="secondary" size="small" (clicked)="checkMissing()" />
        </div>
      </div>
      <kp-table storageKey="order-tasks" [data]="filteredRows()" [columns]="columns" [rows]="20" [paginator]="true" [sortField]="'sortOrder'" [sortOrder]="1" emptyMessage="Нет задач" [showActions]="true" [extraActions]="statusActions" (rowExtraAction)="onExtra($event)" />
    </kp-card>

    <!-- Диалог: проблемы комплектации -->
    <kp-dialog [visible]="missingDialogVisible()" header="🔍 Проблемы комплектации" (closed)="missingDialogVisible.set(false)">
      @let issuesList = missingIssues();
      @if (issuesList.length === 0) {
        <p style="color: var(--color-success); padding: var(--space-4);">✅ Все данные в наличии. Заказ готов к производству!</p>
      } @else {
        <div class="missing-list">
          @for (issue of issuesList; track issue.componentId + issue.type) {
            <div class="missing-item">
              <span class="missing-item__icon">{{ issue.type === 'no_drawing' ? '📐' : issue.type === 'no_materials' ? '📦' : issue.type === 'no_work_types' ? '🔧' : '❓' }}</span>
              <div class="missing-item__body">
                <strong>{{ issue.componentName || '—' }}</strong>
                <p>{{ issue.detail }}</p>
              </div>
            </div>
          }
        </div>
        <div class="missing-actions">
          <kp-button label="📋 Создать авто-задачи" severity="info" size="small" (clicked)="createMissingTasks()" />
        </div>
      }
    </kp-dialog>

    <!-- Диалог: назначение исполнителя -->
    <kp-dialog [visible]="assignDialogVisible()" header="👷 Назначить исполнителя" (closed)="assignDialogVisible.set(false)">
      @let workersList = availableWorkers();
      @if (workersList.length === 0) {
        <p style="color: var(--color-text-secondary); padding: var(--space-4);">Нет доступных работников для этого вида работ.</p>
      } @else {
        <div class="worker-list">
          @for (w of workersList; track w.id) {
            <div class="worker-item" (click)="assignTo(w.id)" style="cursor:pointer; padding:var(--space-2); border-radius:var(--radius-sm); transition:background 0.15s;"
              onmouseover="this.style.background='var(--color-surface)'" onmouseout="this.style.background='transparent'">
              <span class="worker-item__name">{{ w.fullName }}</span>
              <span class="worker-item__grade">Разряд {{ w.grade }}</span>
              @if (w.busyUntil) { <span class="worker-item__busy">Занят до {{ w.busyUntil }}</span> }
              @else { <span class="worker-item__free" style="color:var(--color-success)">✅ Свободен</span> }
            </div>
          }
        </div>
        <div class="worker-actions">
          <kp-button label="🤖 Авто-назначить" severity="info" size="small" (clicked)="autoAssign()" />
        </div>
      }
    </kp-dialog>
  `,
  styleUrl: './order-task-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTaskListComponent implements OnInit {
  private taskSvc = inject(OrderTaskService);
  private orderSvc = inject(ProductionOrderService);
  private notification = inject(NotificationService);
  tasks = signal<OrderTask[]>([]);
  orders = signal<ProductionOrder[]>([]);
  filterOrderId = signal('');

  // Диалог назначения
  assignDialogVisible = signal(false);
  assignTaskId = signal('');
  availableWorkers = signal<{ id: string; fullName: string; grade: number; busyUntil?: string }[]>([]);

  // Диалог комплектации
  missingDialogVisible = signal(false);
  missingOrderId = signal('');
  missingIssues = signal<MissingDataIssue[]>([]);

  orderOptions = computed(() => [{ label: 'Все заказы', value: '' }, ...this.orders().map(o => ({ label: `${o.number} — ${o.productName}`, value: o.id }))]);
  breadcrumbs = computed((): MenuItem[] => [{ label: '🏭 Производство' }, { label: 'Задачи' }]);
  columns: TableColumn[] = [
    { field: 'componentName', header: 'Компонент', sortable: true },
    { field: 'workTypeName', header: 'Работа', sortable: true, width: '180px' },
    { field: 'statusLabel', header: 'Статус', width: '130px', type: 'badge' },
    { field: 'dependsStr', header: 'Зависит от', width: '150px' },
    { field: 'plannedHours', header: 'Часы план', width: '90px', type: 'number' },
    { field: 'plannedStartDate', header: 'Старт', width: '110px' },
    { field: 'plannedEndDate', header: 'Финиш', width: '110px' },
  ];

  statusActions: TableExtraAction[] = [
    { icon: 'user-plus', severity: 'info', tooltip: 'Назначить', visible: (r: unknown) => !(r as OrderTask).workerId && (r as OrderTask).status === 'pending' },
    { icon: 'play', severity: 'success', tooltip: 'Следующий статус', visible: (r: unknown) => !!(NEXT_STATUS[(r as OrderTask).status]) },
  ];

  filteredRows = computed(() => {
    const t = this.tasks();
    const oid = this.filterOrderId();
    return (oid ? t.filter(x => x.productionOrderId === oid) : t).map(x => {
      const depNames = x.dependsOnTaskIds
        .map(depId => this.tasks().find(st => st.id === depId))
        .filter(Boolean)
        .map(dep => dep!.componentName?.substring(0, 12) + ' / ' + dep!.workTypeName?.substring(0, 10))
        .join('; ');
      return { ...x, statusLabel: STATUS_LABELS[x.status] || x.status, dependsStr: depNames || '—' };
    });
  });

  ngOnInit() { this.load(); }
  async load() {
    const [tasks, orders] = await Promise.all([firstValueFrom(this.taskSvc.getTasks()), firstValueFrom(this.orderSvc.getAll())]);
    this.tasks.set(tasks.data); this.orders.set(orders.data);
  }

  async onExtra(payload: { icon: string; row: unknown }) {
    const t = payload.row as OrderTask;
    if (payload.icon === 'user-plus') {
      // Открыть диалог назначения
      this.assignTaskId.set(t.id);
      const res = await firstValueFrom(this.taskSvc.getAvailableWorkers(t.workTypeId));
      this.availableWorkers.set(res.data);
      this.assignDialogVisible.set(true);
    } else if (payload.icon === 'play') {
      const next = NEXT_STATUS[t.status];
      if (!next) return;
      const res = await firstValueFrom(this.taskSvc.changeStatus(t.id, next));
      if (res.success) { this.notification.success(`Статус: ${STATUS_LABELS[next]}`); this.load(); }
      else { this.notification.error(res.message || 'Ошибка смены статуса'); }
    }
  }

  async autoAssign() {
    const res = await firstValueFrom(this.taskSvc.autoAssignWorker(this.assignTaskId()));
    if (res.success) { this.notification.success('Исполнитель назначен'); this.assignDialogVisible.set(false); this.load(); }
    else { this.notification.warn(res.message || 'Не удалось назначить'); }
  }

  async assignTo(workerId: string) {
    const res = await firstValueFrom(this.taskSvc.assignWorker(this.assignTaskId(), workerId));
    if (res.success) { this.notification.success('Исполнитель назначен'); this.assignDialogVisible.set(false); this.load(); }
  }

  async checkMissing() {
    const oid = this.filterOrderId();
    if (!oid) { this.notification.warn('Выберите заказ из фильтра'); return; }
    const order = this.orders().find(o => o.id === oid);
    if (!order) return;
    this.missingOrderId.set(oid);
    const res = await firstValueFrom(this.taskSvc.checkMissingData(oid, order));
    this.missingIssues.set(res.data);
    this.missingDialogVisible.set(true);
  }

  async createMissingTasks() {
    const res = await firstValueFrom(this.taskSvc.generateMissingDataTasks(this.missingOrderId(), this.missingIssues()));
    if (res.success) {
      this.notification.success(`Создано задач: ${res.data.length}`);
      this.missingDialogVisible.set(false);
      this.missingIssues.set([]);
      this.load();
    }
  }
}
