import { describe, it, expect, beforeEach } from 'vitest';
import { TenderService } from './tender.service';
import { firstValueFrom } from 'rxjs';

describe('TenderService', () => {
  let svc: TenderService;
  beforeEach(() => { svc = new TenderService(); svc['items'] = []; });

  it('содержит seed-данные при создании', () => {
    const s = new TenderService();
    expect(s['items'].length).toBe(3);
    expect(s['items'][0].title).toContain('МАФ');
  });

  it('CRUD: создание и чтение', async () => {
    const r = await firstValueFrom(svc.create({ title: 'Тест', type: 'commercial', status: 'draft', customerOrgId: 'org-1', customerName: 'Тест', documents: [], number: 'Т-9999' }));
    expect(r.data.title).toBe('Тест');
    expect(svc['items'].length).toBe(1);
  });
});
