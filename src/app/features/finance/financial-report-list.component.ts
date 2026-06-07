import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { FinancialReportService } from '../../core/financial-report.service';
import type { FinancialReport } from '../../../../shared/types/index.js';

const TYPE_LABELS: Record<string, string> = { profit_loss: 'Прибыли/убытки', cashflow: 'Движение средств', receivables: 'Дебиторская', payables: 'Кредиторская' };
const STATUS_LABELS: Record<string, string> = { draft: 'Черновик', final: '✅ Итоговый' };

@Component({
  selector: 'app-financial-report-list',
  standalone: true,
  imports: [CommonModule, KpCardComponent, KpBreadcrumbComponent, KpTableComponent, KpToastComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">📊 Финансовые отчёты</h2>
      <kp-table storageKey="financial-reports" [data]="rows()" [columns]="columns" [rows]="20" [paginator]="true" emptyMessage="Отчёты не найдены" [showActions]="true" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styles: [`:host { display: block; max-width: 1200px; margin: 0 auto; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialReportListComponent {
  private svc = inject(FinancialReportService);
  rows = signal<FinancialReport[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '💰 Бухгалтерия' }, { label: 'Финансовые отчёты' }];
  columns: TableColumn[] = [
    { field: 'title', header: 'Название', sortable: true },
    { field: 'typeLabel', header: 'Тип', width: '150px' },
    { field: 'periodStart', header: 'Период с', width: '110px' },
    { field: 'periodEnd', header: 'Период по', width: '110px' },
    { field: 'totalAmount', header: 'Сумма', width: '130px', type: 'number' },
    { field: 'statusLabel', header: 'Статус', width: '110px', type: 'badge' },
    { field: 'generatedAt', header: 'Сформирован', width: '130px' },
  ];

  constructor() { this.load(); }
  async load() {
    const r = await firstValueFrom(this.svc.getAll());
    this.rows.set(r.data.map(f => ({ ...f, typeLabel: TYPE_LABELS[f.reportType] || f.reportType, statusLabel: STATUS_LABELS[f.status] || f.status } as FinancialReport & { typeLabel: string; statusLabel: string })));
  }
  async onDelete(row: unknown) { const f = row as FinancialReport; if (confirm(`Удалить «${f.title}»?`)) { await firstValueFrom(this.svc.delete(f.id)); this.load(); } }
}
