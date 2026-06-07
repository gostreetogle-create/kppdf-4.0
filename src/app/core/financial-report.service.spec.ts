import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialReportService } from './financial-report.service';
import { firstValueFrom } from 'rxjs';

describe('FinancialReportService', () => {
  let svc: FinancialReportService;
  beforeEach(() => { svc = new FinancialReportService(); svc['items'] = []; });

  it('содержит seed-данные при создании', () => {
    const s = new FinancialReportService();
    expect(s['items'].length).toBe(2);
  });

  it('CRUD: создание и чтение', async () => {
    const r = await firstValueFrom(svc.create({ title: 'Тест', reportType: 'profit_loss', periodStart: '2026-01-01', periodEnd: '2026-06-30', status: 'draft' }));
    expect(r.data.title).toBe('Тест');
  });
});
