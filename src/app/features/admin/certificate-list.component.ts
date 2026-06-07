import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { CertificateService } from '../../core/certificate.service';
import type { Certificate, CertStatus } from '../../../../shared/types/index.js';

const STATUS_LABELS: Record<CertStatus, string> = { valid: '✅ Действует', expiring: '⚠️ Истекает', expired: '❌ Истёк', revoked: 'Отозван' };

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [CommonModule, KpCardComponent, KpBreadcrumbComponent, KpTableComponent, KpToastComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">📜 Сертификаты ЕАЭС</h2>
      <kp-table storageKey="certificates" [data]="rows()" [columns]="columns" [rows]="20" emptyMessage="Сертификаты не найдены" [showActions]="true" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styles: [`:host { display: block; max-width: 1200px; margin: 0 auto; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateListComponent {
  private svc = inject(CertificateService);
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

  constructor() { this.load(); }
  async load() {
    const r = await firstValueFrom(this.svc.getAll());
    this.rows.set(r.data.map(c => ({ ...c, certTypeLabel: c.certType === 'declaration' ? 'Декларация' : 'Сертификат', statusLabel: STATUS_LABELS[c.status] } as Certificate & { certTypeLabel: string; statusLabel: string })));
  }
  async onDelete(row: unknown) { const c = row as Certificate; if (confirm(`Удалить «${c.number}»?`)) { await firstValueFrom(this.svc.delete(c.id)); this.load(); } }
}
