import { describe, it, expect, beforeEach } from 'vitest';
import { OrderClosingService } from './order-closing.service';
import { firstValueFrom } from 'rxjs';

describe('OrderClosingService', () => {
  let svc: OrderClosingService;
  beforeEach(() => { svc = new OrderClosingService(); svc['items'] = []; });

  it('содержит seed-данные при создании', () => {
    const s = new OrderClosingService();
    expect(s['items'].length).toBe(3);
    expect(s['items'][0].orderNumber).toBe('ПЗ-0001');
  });

  it('CRUD: создание и чтение', async () => {
    const r = await firstValueFrom(svc.create({ productionOrderId: 'po-1', orderNumber: 'ПЗ-0001', closingType: 'act', number: 'АКТ-99', date: '2026-06-01', status: 'draft' }));
    expect(r.data.number).toBe('АКТ-99');
  });
});
