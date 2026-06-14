import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';
import { NotificationService } from '../../core/notification.service';
import { RppService } from '../../core/rpp.service';
import { ConfirmationService } from 'primeng/api';
import type { RppEntry, RppStatus } from '../../../../shared/types/index.js';

const STATUS_LABELS: Record<RppStatus, string> = { draft: 'Черновик', submitted: 'Подана', registered: '✅ Зарегистр.', expired: 'Истекла' };

@Component({
  selector: 'app-rpp-list',
  standalone: true,
  imports: [CommonModule, KpCardComponent, KpBreadcrumbComponent, KpTableComponent, KpToastComponent  ],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">📋 Реестр РПП (Минпромторг)</h2>
      <kp-table storageKey="rpp" [data]="rows()" [columns]="columns" [rows]="20" emptyMessage="Записи не найдены" [showActions]="true" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styleUrl: './rpp-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RppListComponent implements OnInit {
  private svc = inject(RppService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  rows = signal<RppEntry[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '⚙️ Администрирование' }, { label: 'Реестр РПП' }];
  columns: TableColumn[] = [
    { field: 'productName', header: 'Товар', sortable: true },
    { field: 'productSku', header: 'Артикул', width: '100px' },
    { field: 'registryNumber', header: 'Реестр. номер', width: '150px' },
    { field: 'statusLabel', header: 'Статус', width: '130px', type: 'badge' },
    { field: 'registrationDate', header: 'Дата регистр.', width: '120px' },
    { field: 'expiryDate', header: 'Действует до', width: '120px' },
  ];

  ngOnInit() { this.load(); }
  async load() {
    const r = await firstValueFrom(this.svc.getAll());
    this.rows.set(r.data.map(e => ({ ...e, statusLabel: STATUS_LABELS[e.status] } as RppEntry & { statusLabel: string })));
  }
  async onDelete(row: unknown) { const e = row as RppEntry; KpConfirmDialogComponent.confirm(this.confirmationService, { header: 'Удаление', message: `Удалить «${e.productName}»?`, acceptLabel: 'Удалить', rejectLabel: 'Отмена', accept: async () => { await firstValueFrom(this.svc.delete(e.id)); this.notification.success('Запись удалена'); this.load(); } }); }
}
