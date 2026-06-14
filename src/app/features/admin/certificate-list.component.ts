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
import { CertificateService } from '../../core/certificate.service';
import { ConfirmationService } from 'primeng/api';
import type { Certificate, CertStatus } from '../../../../shared/types/index.js';

const STATUS_LABELS: Record<CertStatus, string> = { valid: '✅ Действует', expiring: '⚠️ Истекает', expired: '❌ Истёк', revoked: 'Отозван' };

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [CommonModule, KpCardComponent, KpBreadcrumbComponent, KpTableComponent, KpToastComponent  ],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">📜 Сертификаты ЕАЭС</h2>
      <kp-table storageKey="certificates" [data]="rows()" [columns]="columns" [rows]="20" emptyMessage="Сертификаты не найдены" [showActions]="true" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styleUrl: './certificate-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateListComponent implements OnInit {
  private svc = inject(CertificateService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  rows = signal<Certificate[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '⚙️ Администрирование' }, { label: 'Сертификаты ЕАЭС' }];
  columns: TableColumn[] = [
    { field: 'number', header: 'Номер', sortable: true, width: '220px' },
    { field: 'productNames', header: 'Товары' },
    { field: 'certTypeLabel', header: 'Тип', width: '110px' },
    { field: 'statusLabel', header: 'Статус', width: '120px', type: 'badge' },
    { field: 'issueDate', header: 'Выдан', width: '110px' },
    { field: 'expiryDate', header: 'До', width: '110px' },
  ];

  ngOnInit() { this.load(); }
  async load() {
    const r = await firstValueFrom(this.svc.getAll());
    this.rows.set(r.data.map(c => ({ ...c, certTypeLabel: c.certType === 'declaration' ? 'Декларация' : 'Сертификат', statusLabel: STATUS_LABELS[c.status] } as Certificate & { certTypeLabel: string; statusLabel: string })));
  }
  async onDelete(row: unknown) { const c = row as Certificate; KpConfirmDialogComponent.confirm(this.confirmationService, { header: 'Удаление', message: `Удалить «${c.number}»?`, acceptLabel: 'Удалить', rejectLabel: 'Отмена', accept: async () => { await firstValueFrom(this.svc.delete(c.id)); this.notification.success('Сертификат удалён'); this.load(); } }); }
}
