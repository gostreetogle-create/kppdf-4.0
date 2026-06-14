import { Component, inject, signal, viewChild, ChangeDetectionStrategy, OnInit } from '@angular/core';
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
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpBadgeComponent } from '../../shared/ui/kp-badge.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';
import { CreateOrderDialogComponent } from './create-order-dialog.component';
import { NotificationService } from '../../core/notification.service';
import { ProductionOrderService } from '../../core/production-order.service';
import { OrderTaskService } from '../../core/order-task.service';
import { ProductService } from '../../core/product.service';
import { OrganizationService } from '../../core/organization.service';
import type { ProductionOrder, ProductionOrderStatus, Product, Organization, MissingDataIssue } from '../../../../shared/types/index.js';
import { ConfirmationService } from 'primeng/api';
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
  imports: [CommonModule, FormsModule, KpButtonComponent, KpBreadcrumbComponent, KpCardComponent, KpTableComponent, KpDialogComponent, KpSelectComponent, KpInputComponent, KpToastComponent, KpBadgeComponent, CreateOrderDialogComponent  ],
  template: `
    <kp-toast />
    @defer (on idle) {
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <div class="po-header">
        <h2 class="page__title">📋 Производственные заказы</h2>
        <kp-button label="+ Новый заказ" lucideIcon="plus" severity="info" size="small" (buttonClick)="openCreateDialog()" />
      </div>
      <kp-table storageKey="production-orders" [data]="rows()" [columns]="columns" [rows]="20" [paginator]="true" [sortField]="'number'" [sortOrder]="-1" emptyMessage="Заказы не найдены" [showActions]="true" [extraActions]="statusActions" (rowClick)="onRowClick($event)" (rowEdit)="onEdit($event)" (rowDelete)="onDelete($event)" (rowExtraAction)="onStatusChange($event)" />
    </kp-card>

    <app-create-order-dialog
      [products]="cachedProducts()"
      [organizations]="cachedOrganizations()"
      (orderCreated)="onOrderCreated($event)"
    />

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
    } @placeholder {
      <div class="po-placeholder"><p>Загрузка заказов...</p></div>
    }
  `,
  styleUrl: './production-order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionOrderListComponent implements OnInit {
  private svc = inject(ProductionOrderService);
  private taskSvc = inject(OrderTaskService);
  private productSvc = inject(ProductService);
  private orgSvc = inject(OrganizationService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  rows = signal<ProductionOrder[]>([]);
  cachedProducts = signal<Product[]>([]);
  cachedOrganizations = signal<Organization[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '🏭 Производство' }, { label: 'Производственные заказы' }];

  readonly STATUS_LABELS = STATUS_LABELS;
  readonly STATUS_BADGE = STATUS_BADGE;
  readonly NEXT_STATUS = NEXT_STATUS;
  docTemplates = DOC_TEMPLATES;

  // ─── Диалог создания ───
  createDialog = viewChild.required(CreateOrderDialogComponent);

  openCreateDialog() { this.createDialog().open(); }

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

  ngOnInit() { this.loadRows(); this.loadCachedData(); }

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

  onOrderCreated(_order: ProductionOrder) {
    this.loadRows();
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
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление заказа',
      message: `Удалить «${o.number}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.svc.delete(o.id));
        if (res.success) {
          this.notification.success(`Заказ ${o.number} удалён`);
          this.loadRows();
        }
      },
    });
  }
}
