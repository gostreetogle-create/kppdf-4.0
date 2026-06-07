import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpTableComponent, TableColumn, TableExtraAction } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';
import { ReconciliationActService } from '../../core/reconciliation-act.service';
import type { ReconciliationAct } from '../../../../shared/types/index.js';

const STATUS_LABELS: Record<string, string> = { draft: 'Черновик', sent: 'Отправлен', signed: '✅ Подписан', disputed: '⚠️ Оспорен' };

@Component({
  selector: 'app-reconciliation-act-list',
  standalone: true,
  imports: [CommonModule, KpCardComponent, KpBreadcrumbComponent, KpTableComponent, KpToastComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">📑 Акты сверки</h2>
      <kp-table storageKey="reconciliation-acts" [data]="rows()" [columns]="columns" [rows]="20" [paginator]="true" emptyMessage="Акты не найдены" [showActions]="true" [extraActions]="statusActions" (rowDelete)="onDelete($event)" (rowExtraAction)="onSign($event)" />
    </kp-card>
  `,
  styles: [`:host { display: block; max-width: 1200px; margin: 0 auto; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReconciliationActListComponent {
  private svc = inject(ReconciliationActService);
  private notification = inject(NotificationService);
  rows = signal<ReconciliationAct[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '💰 Бухгалтерия' }, { label: 'Акты сверки' }];
  columns: TableColumn[] = [
    { field: 'number', header: 'Номер', width: '130px', sortable: true },
    { field: 'organizationName', header: 'Контрагент', sortable: true },
    { field: 'periodStart', header: 'Период с', width: '110px' },
    { field: 'periodEnd', header: 'Период по', width: '110px' },
    { field: 'ourDebt', header: 'Наш долг', width: '110px', type: 'number' },
    { field: 'theirDebt', header: 'Долг нам', width: '110px', type: 'number' },
    { field: 'balance', header: 'Сальдо', width: '110px', type: 'number' },
    { field: 'statusLabel', header: 'Статус', width: '120px', type: 'badge' },
  ];
  statusActions: TableExtraAction[] = [
    { icon: 'check', severity: 'success', tooltip: 'Подписать', visible: (r: unknown) => (r as ReconciliationAct).status === 'draft' || (r as ReconciliationAct).status === 'sent' },
  ];

  constructor() { this.load(); }
  async load() {
    const r = await firstValueFrom(this.svc.getAll());
    this.rows.set(r.data.map(a => ({ ...a, statusLabel: STATUS_LABELS[a.status] || a.status } as ReconciliationAct & { statusLabel: string })));
  }
  async onSign(payload: { icon: string; row: unknown }) {
    const a = payload.row as ReconciliationAct;
    await firstValueFrom(this.svc.update(a.id, { status: 'signed', signDate: new Date().toISOString().substring(0, 10) }));
    this.notification.success(`Подписан: ${a.number}`);
    this.load();
  }
  async onDelete(row: unknown) { const a = row as ReconciliationAct; if (confirm(`Удалить «${a.number}»?`)) { await firstValueFrom(this.svc.delete(a.id)); this.load(); } }
}
