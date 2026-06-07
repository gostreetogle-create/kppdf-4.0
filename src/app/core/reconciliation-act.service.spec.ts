import { describe, it, expect, beforeEach } from 'vitest';
import { ReconciliationActService } from './reconciliation-act.service';
import { firstValueFrom } from 'rxjs';

describe('ReconciliationActService', () => {
  let svc: ReconciliationActService;
  beforeEach(() => { svc = new ReconciliationActService(); svc['items'] = []; });

  it('содержит seed-данные при создании', () => {
    const s = new ReconciliationActService();
    expect(s['items'].length).toBe(3);
  });

  it('CRUD: создание и чтение', async () => {
    const r = await firstValueFrom(svc.create({ organizationId: 'org-1', organizationName: 'Тест', number: 'АС-99', periodStart: '2026-01-01', periodEnd: '2026-06-30', status: 'draft' }));
    expect(r.data.number).toBe('АС-99');
  });
});
