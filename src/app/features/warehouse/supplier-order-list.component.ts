import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn, TableExtraAction } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';

import { NotificationService } from '../../core/notification.service';
import { SupplierOrderService } from '../../core/supplier-order.service';
import { ConfirmationService } from 'primeng/api';
import type { SupplierOrder, SupplierOrderStatus } from '../../../../shared/types/index.js';

interface OrderRow extends SupplierOrder {
  statusLabel: string;
  itemsCount: number;
  updatedAtDisplay: string;
}

@Component({
  selector: 'app-supplier-order-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpToastComponent,
  ],
  providers: [ConfirmationService],
  template: `
    <kp-toast />

    <div class="so-list">
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="so-list__header">
        <h2 class="so-list__title">🚚 Заказы поставщикам</h2>
        <kp-button
          label="+ Новый заказ"
          lucideIcon="plus"
          routerLink="/warehouse/supplier-orders/new"
          [disabled]="loading()"
        />
      </div>

      <kp-card>
        <kp-table
          storageKey="supplier-orders"
          [data]="rows()"
          [columns]="tableColumns"
          [rows]="20"
          [paginator]="true"
          [sortField]="'number'"
          [sortOrder]="-1"
          [searchFields]="['number', 'notes']"
          emptyMessage="Нет заказов"
          [showActions]="true"
          [loading]="loading()"
          [extraActions]="statusActions"
          (rowEdit)="onEditRow($event)"
          (rowDelete)="onDelete($event)"
          (rowExtraAction)="onStatusChange($event)"
        />
      </kp-card>
    </div>
  `,
  styles: [`
    :host { display: block; max-width: 1100px; margin: 0 auto; padding: var(--space-6); }
    .so-list__header { display: flex; align-items: center; justify-content: space-between; margin: var(--space-4) 0; }
    .so-list__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-text); margin: 0; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierOrderListComponent implements OnInit {
  private router = inject(Router);
  private soService = inject(SupplierOrderService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  rows = signal<OrderRow[]>([]);
  loading = signal(false);

  statusActions: TableExtraAction[] = [
    { icon: 'send', severity: 'info', tooltip: 'Отправить', visible: (row: unknown) => (row as SupplierOrder).status === 'draft' },
    { icon: 'check', severity: 'success', tooltip: 'Подтверждён', visible: (row: unknown) => (row as SupplierOrder).status === 'sent' },
    { icon: 'truck', severity: 'info', tooltip: 'Частичная поставка', visible: (row: unknown) => (row as SupplierOrder).status === 'confirmed' },
    { icon: 'package-check', severity: 'success', tooltip: 'Получено', visible: (row: unknown) => (row as SupplierOrder).status === 'partial' || (row as SupplierOrder).status === 'confirmed' },
  ];

  breadcrumbs: MenuItem[] = [
    { label: 'Склад', routerLink: '/warehouse' },
    { label: 'Заказы поставщикам' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'number', header: 'Номер', width: '110px', sortable: true },
    { field: 'statusLabel', header: 'Статус', width: '130px', type: 'badge' },
    { field: 'itemsCount', header: 'Позиций', width: '80px', type: 'number' },
    { field: 'totalAmount', header: 'Сумма', width: '110px', type: 'number' },
    { field: 'updatedAtDisplay', header: 'Изменён', width: '170px', sortable: true },
  ];

  ngOnInit() { this.load(); }

  async load() {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.soService.getOrders());
      this.rows.set(res.data.map(o => ({
        ...o,
        statusLabel: this.statusText(o.status),
        itemsCount: o.items.length,
        updatedAtDisplay: new Date(o.updatedAt).toLocaleString('ru-RU'),
      })));
    } finally { this.loading.set(false); }
  }

  private statusText(s: string): string {
    const map: Record<string, string> = {
      draft: 'Черновик', sent: 'Отправлен', confirmed: 'Подтверждён',
      partial: 'Частично', received: 'Получен', cancelled: 'Отменён',
    };
    return map[s] || s;
  }

  onEditRow(row: unknown) {
    this.router.navigate(['/warehouse/supplier-orders', (row as SupplierOrder).id, 'edit']);
  }

  async onStatusChange(event: { icon: string; row: unknown }) {
    const o = event.row as SupplierOrder;
    const map: Record<string, { status: SupplierOrderStatus; label: string }> = {
      send: { status: 'sent', label: 'Отправлен' },
      check: { status: 'confirmed', label: 'Подтверждён' },
      truck: { status: 'partial', label: 'Частичная поставка' },
      'package-check': { status: 'received', label: 'Получен' },
    };
    const target = map[event.icon];
    if (!target) return;

    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Смена статуса заказа',
      message: `Изменить статус «${o.number}» на «${target.label}»?`,
      acceptLabel: 'Подтвердить', rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.soService.changeStatus(o.id, target.status));
        if (res.success) { this.notification.success(`Заказ «${o.number}» — ${target.label}`); this.load(); }
        else { this.notification.error(res.message || 'Ошибка'); }
      },
    });
  }

  onDelete(row: unknown) {
    const o = row as OrderRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление заказа',
      message: `Удалить «${o.number}»?`,
      acceptLabel: 'Удалить', rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.soService.deleteOrder(o.id));
        if (res.success) { this.notification.success('Заказ удалён'); this.load(); }
        else { this.notification.error(res.message || 'Ошибка'); }
      },
    });
  }
}
