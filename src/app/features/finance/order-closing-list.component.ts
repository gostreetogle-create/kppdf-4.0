import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpTableComponent, TableColumn, TableExtraAction } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';
import { OrderClosingService } from '../../core/order-closing.service';
import type { OrderClosing } from '../../../../shared/types/index.js';

const STATUS_LABELS: Record<string, string> = { draft: 'Черновик', signed: 'Подписан', closed: 'Закрыт' };
const TYPE_LABELS: Record<string, string> = { act: 'Акт', invoice: 'Счёт-фактура', waybill: 'Накладная' };

@Component({
  selector: 'app-order-closing-list',
  standalone: true,
  imports: [CommonModule, KpCardComponent, KpBreadcrumbComponent, KpTableComponent, KpToastComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">📋 Закрытие заказов</h2>
      <kp-table storageKey="order-closings" [data]="rows()" [columns]="columns" [rows]="20" [paginator]="true" emptyMessage="Документы не найдены" [showActions]="true" [extraActions]="statusActions" (rowDelete)="onDelete($event)" (rowExtraAction)="onSign($event)" />
    </kp-card>
  `,
  styles: [`:host { display: block; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderClosingListComponent implements OnInit {
  private svc = inject(OrderClosingService);
  private notification = inject(NotificationService);
  rows = signal<OrderClosing[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '💰 Бухгалтерия' }, { label: 'Закрытие заказов' }];
  columns: TableColumn[] = [
    { field: 'number', header: 'Номер', width: '110px', sortable: true },
    { field: 'typeLabel', header: 'Тип', width: '110px' },
    { field: 'orderNumber', header: 'Заказ', width: '100px' },
    { field: 'organizationName', header: 'Контрагент', sortable: true },
    { field: 'amount', header: 'Сумма', width: '120px', type: 'number' },
    { field: 'date', header: 'Дата', width: '110px' },
    { field: 'statusLabel', header: 'Статус', width: '110px', type: 'badge' },
  ];
  statusActions: TableExtraAction[] = [
    { icon: 'check', severity: 'success', tooltip: 'Подписать', visible: (r: unknown) => (r as OrderClosing).status === 'draft' },
  ];

  ngOnInit() { this.load(); }
  async load() {
    const r = await firstValueFrom(this.svc.getAll());
    this.rows.set(r.data.map(c => ({ ...c, typeLabel: TYPE_LABELS[c.closingType] || c.closingType, statusLabel: STATUS_LABELS[c.status] || c.status } as OrderClosing & { typeLabel: string; statusLabel: string })));
  }
  async onSign(payload: { icon: string; row: unknown }) {
    const c = payload.row as OrderClosing;
    await firstValueFrom(this.svc.update(c.id, { status: 'signed' }));
    this.notification.success(`Подписан: ${c.number}`);
    this.load();
  }
  async onDelete(row: unknown) { const c = row as OrderClosing; if (confirm(`Удалить «${c.number}»?`)) { await firstValueFrom(this.svc.delete(c.id)); this.load(); } }
}
