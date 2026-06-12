import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';
import { TenderService } from '../../core/tender.service';
import type { Tender, TenderStatus } from '../../../../shared/types/index.js';

const STATUS_LABELS: Record<TenderStatus, string> = { draft: 'Черновик', published: 'Опубликован', submission: 'Приём заявок', evaluation: 'Оценка', won: '✅ Выигран', lost: '❌ Проигран', cancelled: 'Отменён' };

@Component({
  selector: 'app-tender-list',
  standalone: true,
  imports: [CommonModule, KpCardComponent, KpBreadcrumbComponent, KpTableComponent, KpToastComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">📋 Тендеры</h2>
      <kp-table storageKey="tenders" [data]="rows()" [columns]="columns" [rows]="20" [paginator]="true" emptyMessage="Тендеры не найдены" [showActions]="true" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styles: [`:host { display: block; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenderListComponent implements OnInit {
  private svc = inject(TenderService);
  private notification = inject(NotificationService);
  rows = signal<Tender[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '⚙️ Администрирование' }, { label: 'Тендеры' }];
  columns: TableColumn[] = [
    { field: 'number', header: 'Номер', width: '100px' },
    { field: 'title', header: 'Наименование', sortable: true },
    { field: 'typeLabel', header: 'Тип', width: '100px' },
    { field: 'customerName', header: 'Заказчик', width: '200px' },
    { field: 'statusLabel', header: 'Статус', width: '130px', type: 'badge' },
    { field: 'startPrice', header: 'НМЦК', width: '140px', type: 'number' },
    { field: 'submissionDeadline', header: 'Дедлайн', width: '110px' },
  ];

  ngOnInit() { this.load(); }
  async load() {
    const r = await firstValueFrom(this.svc.getAll());
    this.rows.set(r.data.map(t => ({ ...t, typeLabel: t.type === '44fz' ? '44-ФЗ' : t.type === '223fz' ? '223-ФЗ' : 'Комм.', statusLabel: STATUS_LABELS[t.status] })));
  }
  async onDelete(row: unknown) { const t = row as Tender; if (confirm(`Удалить «${t.title}»?`)) { await firstValueFrom(this.svc.delete(t.id)); this.load(); } }
}
