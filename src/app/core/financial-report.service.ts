import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { FinancialReport } from '../../../shared/types/index.js';

const SEED_REPORTS: FinancialReport[] = [
  { id: 'fr-1', title: 'Прибыли и убытки — Q2 2026', reportType: 'profit_loss', periodStart: '2026-04-01', periodEnd: '2026-06-30', data: { revenue: 1520000, costs: 980000, profit: 540000, margin: 35.5 }, totalAmount: 540000, status: 'final', generatedAt: '2026-06-07T10:00:00.000Z', notes: 'Предварительный отчёт за Q2. Маржинальность 35.5%', createdAt: '2026-06-07T10:00:00.000Z', updatedAt: '2026-06-07T10:00:00.000Z' },
  { id: 'fr-2', title: 'Дебиторская задолженность — июнь 2026', reportType: 'receivables', periodStart: '2026-06-01', periodEnd: '2026-06-30', data: { totalReceivables: 540000, overdue: 0, clients: 3 }, totalAmount: 540000, status: 'draft', createdAt: '2026-06-07T11:00:00.000Z', updatedAt: '2026-06-07T11:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class FinancialReportService extends BaseCrudService<FinancialReport> {
  constructor() { super(); this.items = SEED_REPORTS.map(r => ({ ...r })); }
}
