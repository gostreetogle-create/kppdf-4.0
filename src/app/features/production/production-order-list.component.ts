import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn, TableExtraAction } from '../../shared/ui/kp-table.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpDatepickerComponent } from '../../shared/ui/kp-datepicker.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpBadgeComponent } from '../../shared/ui/kp-badge.component';
import { NotificationService } from '../../core/notification.service';
import { ProductionOrderService } from '../../core/production-order.service';
import { OrderTaskService } from '../../core/order-task.service';
import { ProductService } from '../../core/product.service';
import { OrganizationService } from '../../core/organization.service';
import type { ProductionOrder, ProductionOrderStatus, Product, Organization, MissingDataIssue } from '../../../../shared/types/index.js';
const STATUS_LABELS: Record<ProductionOrderStatus, string> = { accepted: 'Принят', in_design: 'Проектирование', in_production: 'В производстве', ready: 'Готов', shipped: 'Отгружен', closed: 'Закрыт' };
const STATUS_BADGE = { accepted: 'info', in_design: 'warn', in_production: 'info', ready: 'success', shipped: 'info', closed: 'secondary' } as const;
const NEXT_STATUS: Partial<Record<ProductionOrderStatus, ProductionOrderStatus>> = { accepted: 'in_design', in_design: 'in_production', in_production: 'ready', ready: 'shipped', shipped: 'closed' };

const DOC_TEMPLATES = [
  { label: 'Универсальная накладная (ТОРГ-12)', value: 'torg-12' },
  { label: 'Товарно-транспортная накладная', value: 'ttn' },
  { label: 'Акт приёма-передачи', value: 'act' },
];

@Component({
  selector: 'app-production-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, KpButtonComponent, KpBreadcrumbComponent, KpCardComponent, KpTableComponent, KpDialogComponent, KpSelectComponent, KpInputComponent, KpDatepickerComponent, KpToastComponent, KpBadgeComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <div class="po-header">
        <h2 class="page__title">📋 Производственные заказы</h2>
        <kp-button label="+ Новый заказ" lucideIcon="plus" severity="info" size="small" (buttonClick)="openCreateDialog()" />
      </div>
      <kp-table storageKey="production-orders" [data]="rows()" [columns]="columns" [rows]="20" [paginator]="true" [sortField]="'number'" [sortOrder]="-1" emptyMessage="Заказы не найдены" [showActions]="true" [extraActions]="statusActions" (rowClick)="onRowClick($event)" (rowEdit)="onEdit($event)" (rowDelete)="onDelete($event)" (rowExtraAction)="onStatusChange($event)" />
    </kp-card>

    <!-- Диалог: создание заказа -->
    <kp-dialog header="📋 Новый производственный заказ" [(visible)]="createDialogVisible" width="520px" (dialogHide)="closeCreateDialog()">
      <div class="po-form">
        <kp-select label="Товар" [options]="productOptions()" [(ngModel)]="formProductId" placeholder="Выберите товар..." [filter]="true" [showClear]="true" />
        <kp-select label="Заказчик" [options]="orgOptions()" [(ngModel)]="formOrgId" placeholder="Выберите организацию..." [filter]="true" [showClear]="true" />
        <div class="po-form__row">
          <kp-input label="Количество" type="number" [(ngModel)]="formQuantity" />
          <kp-datepicker label="Старт" [(selectedDate)]="formStartDate" />
          <kp-datepicker label="Финиш" [(selectedDate)]="formEndDate" />
        </div>
        <kp-input label="Примечание" [(ngModel)]="formNotes" placeholder="Опционально..." />
      </div>
      <div class="po-actions">
        <kp-button label="Отмена" severity="secondary" size="small" (buttonClick)="closeCreateDialog()" />
        <kp-button label="Создать" lucideIcon="plus" severity="info" size="small" [loading]="formSubmitting()" [disabled]="!formProductId() || !formOrgId() || formQuantity() < 1" (buttonClick)="createOrder()" />
      </div>
    </kp-dialog>

    <!-- Диалог: детали заказа -->
    <kp-dialog header="📄 {{ detailOrder()?.number }} — {{ detailOrder()?.productName }}" [(visible)]="detailDialogVisible" width="640px" (dialogHide)="detailOrder.set(null)">
      @if (detailOrder(); as o) {
        <div class="po-detail">
          <div class="po-detail__info">
            <div class="po-detail__row"><span class="po-detail__label">Статус</span><kp-badge [value]="STATUS_LABELS[o.status]" [severity]="STATUS_BADGE[o.status]" /></div>
            <div class="po-detail__row"><span class="po-detail__label">Товар</span><span>{{ o.productName }} ({{ o.productSku }})</span></div>
            <div class="po-detail__row"><span class="po-detail__label">Количество</span><span>{{ o.quantity }} шт</span></div>
            <div class="po-detail__row"><span class="po-detail__label">Даты</span><span>{{ o.plannedStartDate || '—' }} → {{ o.plannedEndDate || '—' }}</span></div>
            @if (o.notes) {
              <div class="po-detail__row po-detail__row--notes"><span class="po-detail__label">Примечание</span><span>{{ o.notes }}</span></div>
            }
          </div>
          <div class="po-detail__actions">
            @if (o.status !== 'closed') {
              <kp-button
                [label]="'→ ' + (STATUS_LABELS[NEXT_STATUS[o.status]!] || 'След. статус')"
                severity="success" size="small" [disabled]="!NEXT_STATUS[o.status]"
                lucideIcon="play"
                (buttonClick)="onStatusChange({ icon: 'play', row: o })"
              />
            }
            @if (o.status === 'ready') {
              <kp-button label="🚚 Отгрузить" severity="warn" size="small" (buttonClick)="onStatusChange({ icon: 'truck', row: o })" />
            }
            <kp-button label="📋 Задачи" severity="info" size="small" lucideIcon="list-todo" (buttonClick)="detailDialogVisible.set(false)" />
          </div>
        </div>
      }
    </kp-dialog>

    <!-- Диалог: отгрузка -->
    <kp-dialog header="🚚 Отгрузка заказа" [(visible)]="shipmentDialogVisible" width="480px" (dialogHide)="shipmentOrder.set(null)">
      @let shipment = shipmentOrder();
      <p style="margin-bottom: var(--space-3);">Заказ <strong>{{ shipment?.number }}</strong> — {{ shipment?.productName }}</p>
      <div class="po-form">
        <kp-select label="Шаблон документа" [options]="docTemplates" [(ngModel)]="shipmentTemplate" placeholder="Выберите шаблон" />
        <kp-input label="Примечание" [(ngModel)]="shipmentNote" placeholder="Номер накладной, дата..." />
      </div>
      <div class="po-actions">
        <kp-button label="Отмена" severity="secondary" size="small" (buttonClick)="shipmentDialogVisible.set(false)" />
        <kp-button label="🚚 Отгрузить" severity="success" size="small" (buttonClick)="shipOrder()" />
      </div>
    </kp-dialog>

    <!-- Диалог: проблемы комплектации -->
    <kp-dialog header="🔍 Проблемы комплектации" [(visible)]="missingDialogVisible" width="520px" (dialogHide)="missingIssues.set([])">
      @let missingList = missingIssues();
      @if (missingList.length === 0) {
        <p style="color: var(--color-success); padding: var(--space-4);">✅ Все данные в наличии.</p>
      } @else {
        <div class="po-missing">
          @for (issue of missingList; track issue.componentId + issue.type) {
            <div class="po-missing__item">
              <span class="po-missing__icon">{{ issue.type === 'no_drawing' ? '📐' : issue.type === 'no_materials' ? '📦' : issue.type === 'no_work_types' ? '🔧' : '❓' }}</span>
              <div class="po-missing__body">
                <strong>{{ issue.componentName || '—' }}</strong>
                <p>{{ issue.detail }}</p>
              </div>
            </div>
          }
        </div>
        <div class="po-actions">
          <kp-button label="📋 Создать авто-задачи" severity="info" size="small" (buttonClick)="createMissingTasks()" />
        </div>
      }
    </kp-dialog>
  `,
  styles: [`:host { display: block; max-width: 100%; margin: 0; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; } .po-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); } .po-form { display: flex; flex-direction: column; gap: var(--space-4); } .po-form__row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-3); } .po-actions { display: flex; justify-content: flex-end; gap: var(--space-3); padding-top: var(--space-4); border-top: 1px solid var(--color-border-light); margin-top: var(--space-4); } .po-missing { display: flex; flex-direction: column; gap: var(--space-3); max-height: 400px; overflow-y: auto; } .po-missing__item { display: flex; gap: var(--space-3); padding: var(--space-3); background: var(--color-surface); border-radius: var(--radius-md); border: 1px solid var(--color-border); } .po-missing__icon { font-size: 1.5rem; flex-shrink: 0; } .po-missing__body p { margin: var(--space-1) 0 0; color: var(--color-text-secondary); font-size: var(--font-size-sm); } .po-detail { display: flex; flex-direction: column; gap: var(--space-4); } .po-detail__info { display: flex; flex-direction: column; gap: var(--space-3); } .po-detail__row { display: flex; align-items: center; gap: var(--space-3); font-size: var(--font-size-sm); } .po-detail__row--notes { flex-direction: column; align-items: flex-start; padding: var(--space-3); background: var(--color-surface-alt); border-radius: var(--radius-md); } .po-detail__label { color: var(--color-text-muted); min-width: 100px; flex-shrink: 0; font-weight: var(--font-weight-medium); } .po-detail__actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionOrderListComponent {
  private svc = inject(ProductionOrderService);
  private taskSvc = inject(OrderTaskService);
  private productSvc = inject(ProductService);
  private orgSvc = inject(OrganizationService);
  private notification = inject(NotificationService);

  rows = signal<ProductionOrder[]>([]);
  cachedProducts = signal<Product[]>([]);
  cachedOrganizations = signal<Organization[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '🏭 Производство' }, { label: 'Производственные заказы' }];

  readonly STATUS_LABELS = STATUS_LABELS;
  readonly STATUS_BADGE = STATUS_BADGE;
  readonly NEXT_STATUS = NEXT_STATUS;
  docTemplates = DOC_TEMPLATES;

  // ─── Диалог создания ───
  createDialogVisible = signal(false);
  formProductId = signal<string | null>(null);
  formOrgId = signal<string | null>(null);
  formQuantity = signal<number>(1);
  formStartDate = signal<Date | null>(new Date());
  formEndDate = signal<Date | null>(new Date(Date.now() + 7 * 86400000));
  formNotes = signal('');
  formSubmitting = signal(false);

  productOptions = computed(() => this.cachedProducts()
    .filter(p => p.productType === 'manufactured' && p.isActive)
    .map(p => ({ label: `${p.sku} — ${p.name}`, value: p.id })));
  orgOptions = computed(() => this.cachedOrganizations()
    .filter(o => o.isActive)
    .map(o => ({ label: o.shortName || o.name, value: o.id })));

  // ─── Диалог отгрузки ───
  shipmentDialogVisible = signal(false);
  shipmentOrder = signal<ProductionOrder | null>(null);
  shipmentTemplate = signal('');
  shipmentNote = signal('');

  // ─── Диалог комплектации ───
  missingDialogVisible = signal(false);
  missingOrderId = signal('');
  missingIssues = signal<MissingDataIssue[]>([]);

  // ─── Диалог деталей заказа ───
  detailDialogVisible = signal(false);
  detailOrder = signal<ProductionOrder | null>(null);

  columns: TableColumn[] = [
    { field: 'number', header: 'Номер', width: '110px', sortable: true },
    { field: 'productName', header: 'Товар', sortable: true },
    { field: 'productSku', header: 'Артикул', width: '100px' },
    { field: 'quantity', header: 'Кол-во', width: '80px', type: 'number' },
    { field: 'statusLabel', header: 'Статус', width: '130px', type: 'badge' },
    { field: 'plannedStartDate', header: 'Старт', width: '100px' },
    { field: 'plannedEndDate', header: 'Финиш', width: '100px' },
  ];

  statusActions: TableExtraAction[] = [
    { icon: 'search', severity: 'info', tooltip: 'Проверить комплектацию', visible: (r: unknown) => (r as ProductionOrder).status === 'accepted' || (r as ProductionOrder).status === 'in_design' },
    { icon: 'truck', severity: 'warn', tooltip: 'Отгрузить', visible: (r: unknown) => (r as ProductionOrder).status === 'ready' },
    { icon: 'play', severity: 'success', tooltip: 'Следующий статус', visible: (r: unknown) => !!(NEXT_STATUS[(r as ProductionOrder).status]) },
  ];

  constructor() { this.loadRows(); this.loadCachedData(); }

  private async loadCachedData() {
    const [prodRes, orgRes] = await Promise.all([
      firstValueFrom(this.productSvc.getAll()),
      firstValueFrom(this.orgSvc.getAll()),
    ]);
    if (prodRes.success) this.cachedProducts.set(prodRes.data);
    if (orgRes.success) this.cachedOrganizations.set(orgRes.data);
  }

  async loadRows() {
    const r = await firstValueFrom(this.svc.getAll());
    this.rows.set(r.data.map(o => ({ ...o, statusLabel: STATUS_LABELS[o.status] || o.status })));
  }

  // ═══ Создание заказа ═══

  openCreateDialog() { this.createDialogVisible.set(true); }
  closeCreateDialog() {
    this.createDialogVisible.set(false);
    this.formProductId.set(null); this.formOrgId.set(null);
    this.formQuantity.set(1); this.formNotes.set('');
    this.formStartDate.set(new Date());
    this.formEndDate.set(new Date(Date.now() + 7 * 86400000));
  }

  async createOrder() {
    const productId = this.formProductId();
    const orgId = this.formOrgId();
    const qty = this.formQuantity();
    if (!productId || !orgId || qty < 1) return;
    this.formSubmitting.set(true);
    try {
      const product = this.cachedProducts().find(p => p.id === productId);
      if (!product) return;
      const sd = this.formStartDate() || new Date();
      const ed = this.formEndDate() || new Date(Date.now() + 7 * 86400000);
      const data = {
        contractId: '', productId: product.id, productName: product.name,
        productSku: product.sku, quantity: qty, status: 'accepted' as const,
        plannedStartDate: sd.toISOString().substring(0, 10),
        plannedEndDate: ed.toISOString().substring(0, 10),
        notes: this.formNotes(),
      };
      const res = await firstValueFrom(this.svc.createOrder(data));
      if (res.success) {
        this.closeCreateDialog();
        this.notification.success(`Заказ ${res.data.number} создан`);
        this.loadRows();
      }
    } finally { this.formSubmitting.set(false); }
  }

  // ═══ Статусы и экшены ═══

  async onStatusChange(payload: { icon: string; row: unknown }) {
    const o = payload.row as ProductionOrder;
    if (payload.icon === 'truck') {
      this.shipmentOrder.set(o);
      this.shipmentTemplate.set('');
      this.shipmentNote.set('');
      this.shipmentDialogVisible.set(true);
      return;
    }
    if (payload.icon === 'search') {
      const res = await firstValueFrom(this.taskSvc.checkMissingData(o.id, o));
      this.missingIssues.set(res.data);
      this.missingOrderId.set(o.id);
      this.missingDialogVisible.set(true);
      return;
    }
    const next = NEXT_STATUS[o.status];
    if (!next) return;
    const res = await firstValueFrom(this.svc.changeStatus(o.id, next));
    if (res.success) { this.notification.success(`Статус: ${STATUS_LABELS[next]}`); this.loadRows(); this.refreshDetail(); }
  }

  async shipOrder() {
    const order = this.shipmentOrder();
    if (!order) return;
    const res = await firstValueFrom(this.svc.changeStatus(order.id, 'shipped'));
    if (res.success) {
      this.notification.success(`Заказ ${order.number} отгружен`);
      this.shipmentDialogVisible.set(false);
      this.loadRows(); this.refreshDetail();
    }
  }

  async createMissingTasks() {
    const res = await firstValueFrom(this.taskSvc.generateMissingDataTasks(this.missingOrderId(), this.missingIssues()));
    if (res.success) {
      this.notification.success(`Создано задач: ${res.data.length}`);
      this.missingDialogVisible.set(false);
      this.missingIssues.set([]);
      const order = this.rows().find(o => o.id === this.missingOrderId());
      if (order && order.status === 'accepted') {
        await firstValueFrom(this.svc.changeStatus(order.id, 'in_design'));
        this.loadRows(); this.refreshDetail();
      }
    }
  }

  // ═══ Детальный просмотр ═══

  onRowClick(row: unknown) {
    this.detailOrder.set(row as ProductionOrder);
    this.detailDialogVisible.set(true);
  }

  private refreshDetail() {
    const id = this.detailOrder()?.id;
    if (!id) return;
    const updated = this.rows().find(o => o.id === id);
    if (updated) this.detailOrder.set(updated);
  }

  onEdit(row: unknown) { this.onRowClick(row); }
  onDelete(row: unknown) {
    const o = row as ProductionOrder;
    if (confirm(`Удалить «${o.number}»?`)) {
      firstValueFrom(this.svc.delete(o.id)).then(() => {
        this.notification.success(`Заказ ${o.number} удалён`);
        this.loadRows();
      });
    }
  }
}
