import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn, TableExtraAction } from '../../shared/ui/kp-table.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpBadgeComponent } from '../../shared/ui/kp-badge.component';
import { NotificationService } from '../../core/notification.service';
import { ProductionOrderService } from '../../core/production-order.service';
import { OrderTaskService } from '../../core/order-task.service';
import type { ProductionOrder, MissingDataIssue } from '../../../../shared/types/index.js';

import type { ProductionOrderStatus } from '../../../../shared/types/index.js';
const STATUS_LABELS: Record<ProductionOrderStatus, string> = { accepted: 'Принят', in_design: 'Проектирование', in_production: 'В производстве', ready: 'Готов', shipped: 'Отгружен', closed: 'Закрыт' };
const NEXT_STATUS: Partial<Record<ProductionOrderStatus, ProductionOrderStatus>> = { accepted: 'in_design', in_design: 'in_production', in_production: 'ready', ready: 'shipped', shipped: 'closed' };

const DOC_TEMPLATES = [
  { label: 'Универсальная накладная (ТОРГ-12)', value: 'torg-12' },
  { label: 'Товарно-транспортная накладная', value: 'ttn' },
  { label: 'Акт приёма-передачи', value: 'act' },
];

@Component({
  selector: 'app-production-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, KpButtonComponent, KpBreadcrumbComponent, KpCardComponent, KpTableComponent, KpDialogComponent, KpSelectComponent, KpToastComponent, KpBadgeComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <div class="po-header"><h2 class="page__title">📋 Производственные заказы</h2></div>
      <kp-table storageKey="production-orders" [data]="rows()" [columns]="columns" [rows]="20" [paginator]="true" [sortField]="'number'" [sortOrder]="-1" emptyMessage="Заказы не найдены" [showActions]="true" [extraActions]="statusActions" (rowEdit)="onEdit($event)" (rowDelete)="onDelete($event)" (rowExtraAction)="onStatusChange($event)" />
    </kp-card>

    <!-- Диалог: отгрузка -->
    <kp-dialog [visible]="shipmentDialogVisible()" header="🚚 Отгрузка заказа" (closed)="shipmentDialogVisible.set(false)">
      <p style="margin-bottom: var(--space-3);">Заказ <strong>{{ shipmentOrder()?.number }}</strong> — {{ shipmentOrder()?.productName }}</p>
      <div class="shipment-form">
        <label class="shipment-label">Шаблон документа</label>
        <kp-select [options]="docTemplates" [(ngModel)]="shipmentTemplate" placeholder="Выберите шаблон" />
        <label class="shipment-label" style="margin-top: var(--space-3);">Примечание</label>
        <textarea [(ngModel)]="shipmentNote" rows="2" style="width:100%; padding:var(--space-2); border:1px solid var(--color-border); border-radius:var(--radius-sm);" placeholder="Номер накладной, дата..."></textarea>
      </div>
      <div class="shipment-actions">
        <kp-button label="Отмена" severity="secondary" size="small" (clicked)="shipmentDialogVisible.set(false)" />
        <kp-button label="🚚 Отгрузить" severity="success" size="small" (clicked)="shipOrder()" />
      </div>
    </kp-dialog>

    <!-- Диалог: проблемы комплектации -->
    <kp-dialog [visible]="missingDialogVisible()" header="🔍 Проблемы комплектации" (closed)="missingDialogVisible.set(false)">
      @if (missingIssues().length === 0) {
        <p style="color: var(--color-success); padding: var(--space-4);">✅ Все данные в наличии.</p>
      } @else {
        <div class="missing-list">
          @for (issue of missingIssues(); track issue.componentId + issue.type) {
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
  `,
  styles: [`:host { display: block; max-width: 1200px; margin: 0 auto; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; } .po-header { display: flex; align-items: center; justify-content: space-between; } .shipment-form { display: flex; flex-direction: column; gap: var(--space-1); } .shipment-label { font-size: var(--font-size-sm); color: var(--color-text-secondary); } .shipment-actions { display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-4); } .missing-list { display: flex; flex-direction: column; gap: var(--space-3); max-height: 400px; overflow-y: auto; } .missing-item { display: flex; gap: var(--space-3); padding: var(--space-3); background: var(--color-surface); border-radius: var(--radius-md); border: 1px solid var(--color-border); } .missing-item__icon { font-size: 1.5rem; flex-shrink: 0; } .missing-item__body p { margin: var(--space-1) 0 0; color: var(--color-text-secondary); font-size: var(--font-size-sm); } .missing-actions { margin-top: var(--space-4); display: flex; justify-content: flex-end; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionOrderListComponent {
  private svc = inject(ProductionOrderService);
  private taskSvc = inject(OrderTaskService);
  private notification = inject(NotificationService);
  rows = signal<ProductionOrder[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '🏭 Производство' }, { label: 'Производственные заказы' }];

  docTemplates = DOC_TEMPLATES;

  // Диалог отгрузки
  shipmentDialogVisible = signal(false);
  shipmentOrder = signal<ProductionOrder | null>(null);
  shipmentTemplate = signal('');
  shipmentNote = signal('');

  // Диалог комплектации
  missingDialogVisible = signal(false);
  missingOrderId = signal('');
  missingIssues = signal<MissingDataIssue[]>([]);

  columns: TableColumn[] = [
    { field: 'number', header: 'Номер', width: '110px', sortable: true },
    { field: 'productName', header: 'Товар', sortable: true },
    { field: 'productSku', header: 'Артикул', width: '100px' },
    { field: 'quantity', header: 'Кол-во', width: '80px', type: 'number' },
    { field: 'statusLabel', header: 'Статус', width: '150px', type: 'badge' },
    { field: 'plannedStartDate', header: 'План старт', width: '120px' },
    { field: 'plannedEndDate', header: 'План финиш', width: '120px' },
  ];

  statusActions: TableExtraAction[] = [
    { icon: 'search', severity: 'info', tooltip: 'Проверить комплектацию', visible: (r: unknown) => (r as ProductionOrder).status === 'accepted' || (r as ProductionOrder).status === 'in_design' },
    { icon: 'truck', severity: 'warn', tooltip: 'Отгрузить', visible: (r: unknown) => (r as ProductionOrder).status === 'ready' },
    { icon: 'play', severity: 'success', tooltip: 'Следующий статус', visible: (r: unknown) => !!(NEXT_STATUS[(r as ProductionOrder).status]) },
  ];

  constructor() { this.loadRows(); }
  async loadRows() {
    const r = await firstValueFrom(this.svc.getAll());
    this.rows.set(r.data.map(o => ({ ...o, statusLabel: STATUS_LABELS[o.status] || o.status })));
  }

  async onStatusChange(payload: { icon: string; row: unknown }) {
    const o = payload.row as ProductionOrder;
    if (payload.icon === 'truck') {
      // Открыть диалог отгрузки
      this.shipmentOrder.set(o);
      this.shipmentTemplate.set('');
      this.shipmentNote.set('');
      this.shipmentDialogVisible.set(true);
      return;
    }
    if (payload.icon === 'search') {
      // Проверить комплектацию
      const res = await firstValueFrom(this.taskSvc.checkMissingData(o.id, o));
      this.missingIssues.set(res.data);
      this.missingOrderId.set(o.id);
      this.missingDialogVisible.set(true);
      return;
    }
    const next = NEXT_STATUS[o.status];
    if (!next) return;
    const res = await firstValueFrom(this.svc.changeStatus(o.id, next));
    if (res.success) { this.notification.success(`Статус: ${STATUS_LABELS[next]}`); this.loadRows(); }
  }

  async shipOrder() {
    const order = this.shipmentOrder();
    if (!order) return;
    const tmpl = this.shipmentTemplate() || 'torg-12';
    const note = this.shipmentNote() || '';
    const res = await firstValueFrom(this.svc.changeStatus(order.id, 'shipped'));
    if (res.success) {
      this.notification.success(`Отгружено! Шаблон: ${this.docTemplates.find(d => d.value === tmpl)?.label}. ${note}`);
      this.shipmentDialogVisible.set(false);
      this.loadRows();
    }
  }

  async createMissingTasks() {
    const res = await firstValueFrom(this.taskSvc.generateMissingDataTasks(this.missingOrderId(), this.missingIssues()));
    if (res.success) {
      this.notification.success(`Создано задач: ${res.data.length}`);
      this.missingDialogVisible.set(false);
      this.missingIssues.set([]);
      // Меняем статус на in_design если был accepted
      const order = this.rows().find(o => o.id === this.missingOrderId());
      if (order && order.status === 'accepted') {
        await firstValueFrom(this.svc.changeStatus(order.id, 'in_design'));
        this.loadRows();
      }
    }
  }

  onEdit(row: unknown) { const o = row as ProductionOrder; this.notification.info('Редактирование: ' + o.number); }
  onDelete(row: unknown) { const o = row as ProductionOrder; if (confirm(`Удалить «${o.number}»?`)) { firstValueFrom(this.svc.delete(o.id)).then(() => this.loadRows()); } }
}
