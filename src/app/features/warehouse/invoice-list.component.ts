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
import { InvoiceService } from '../../core/invoice.service';
import { ConfirmationService } from 'primeng/api';
import type { IncomingInvoice, InvoiceStatus } from '../../../../shared/types/index.js';

interface InvoiceRow extends IncomingInvoice {
  statusLabel: string;
  amountDisplay: string;
  dateDisplay: string;
}

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpToastComponent,
  ],
  providers: [ConfirmationService],
  template: `
    <kp-toast />

    <div class="inv-list">
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="inv-list__header">
        <h2 class="inv-list__title">🧾 Входящие счета</h2>
        <kp-button
          label="+ Новый счёт"
          lucideIcon="plus"
          routerLink="/warehouse/incoming-invoices/new"
          [disabled]="loading()"
        />
      </div>

      <kp-card>
        <kp-table
          storageKey="incoming-invoices"
          [data]="rows()"
          [columns]="tableColumns"
          [rows]="20"
          [paginator]="true"
          [sortField]="'date'"
          [sortOrder]="-1"
          [searchFields]="['number', 'notes']"
          emptyMessage="Нет счетов"
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
    .inv-list__header { display: flex; align-items: center; justify-content: space-between; margin: var(--space-4) 0; }
    .inv-list__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-text); margin: 0; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListComponent implements OnInit {
  private router = inject(Router);
  private invoiceService = inject(InvoiceService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  rows = signal<InvoiceRow[]>([]);
  loading = signal(false);

  statusActions: TableExtraAction[] = [
    { icon: 'check', severity: 'success', tooltip: 'Оплатить', visible: (row: unknown) => (row as IncomingInvoice).status === 'pending' },
    { icon: 'x', severity: 'danger', tooltip: 'Отменить', visible: (row: unknown) => (row as IncomingInvoice).status === 'pending' },
  ];

  breadcrumbs: MenuItem[] = [
    { label: 'Склад', routerLink: '/warehouse' },
    { label: 'Входящие счета' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'number', header: 'Номер', width: '110px', sortable: true },
    { field: 'dateDisplay', header: 'Дата', width: '120px', sortable: true },
    { field: 'amountDisplay', header: 'Сумма', width: '120px', sortable: true, type: 'number' },
    { field: 'statusLabel', header: 'Статус', width: '110px', type: 'badge' },
  ];

  ngOnInit() { this.load(); }

  async load() {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.invoiceService.getInvoices());
      this.rows.set(res.data.map(inv => ({
        ...inv,
        statusLabel: this.statusText(inv.status),
        amountDisplay: inv.amount.toLocaleString('ru-RU') + ' ₽',
        dateDisplay: new Date(inv.date).toLocaleDateString('ru-RU'),
      })));
    } finally { this.loading.set(false); }
  }

  private statusText(s: string): string {
    const map: Record<string, string> = { pending: 'Ожидает', paid: 'Оплачен', cancelled: 'Отменён' };
    return map[s] || s;
  }

  onEditRow(row: unknown) {
    this.router.navigate(['/warehouse/incoming-invoices', (row as IncomingInvoice).id, 'edit']);
  }

  async onStatusChange(event: { icon: string; row: unknown }) {
    const inv = event.row as IncomingInvoice;
    const map: Record<string, { status: InvoiceStatus; label: string }> = {
      check: { status: 'paid', label: 'Оплачен' },
      x: { status: 'cancelled', label: 'Отменён' },
    };
    const target = map[event.icon];
    if (!target) return;

    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Смена статуса счёта',
      message: `Изменить статус «${inv.number}» на «${target.label}»?`,
      acceptLabel: 'Подтвердить', rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.invoiceService.changeStatus(inv.id, target.status));
        if (res.success) { this.notification.success(`Счёт «${inv.number}» — ${target.label}`); this.load(); }
        else { this.notification.error(res.message || 'Ошибка'); }
      },
    });
  }

  onDelete(row: unknown) {
    const inv = row as InvoiceRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление счёта',
      message: `Удалить «${inv.number}»?`,
      acceptLabel: 'Удалить', rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.invoiceService.deleteInvoice(inv.id));
        if (res.success) { this.notification.success('Счёт удалён'); this.load(); }
        else { this.notification.error(res.message || 'Ошибка'); }
      },
    });
  }
}
