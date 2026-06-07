import { describe, it, expect, beforeEach } from 'vitest';
import { ProductionOrderService } from './production-order.service';
import { firstValueFrom } from 'rxjs';

describe('ProductionOrderService', () => {
  let svc: ProductionOrderService;
  beforeEach(() => { svc = new ProductionOrderService(); svc['items'] = []; });
  it('содержит seed-данные', () => { expect(new ProductionOrderService()['items'].length).toBe(2); });
  it('создаёт с номером ПЗ', async () => {
    const r = await firstValueFrom(svc.createOrder({ contractId: 'c1', productId: 'p1', productName: 'X', productSku: 'XX', quantity: 1, status: 'accepted' }));
    expect(r.success).toBe(true);
    expect(r.data.number).toMatch(/^ПЗ-/);
  });
  it('меняет статус', async () => {
    const r = await firstValueFrom(svc.createOrder({ contractId: 'c1', productId: 'p1', productName: 'X', productSku: 'XX', quantity: 1, status: 'accepted' }));
    await firstValueFrom(svc.changeStatus(r.data.id, 'in_design'));
    const u = await firstValueFrom(svc.getById(r.data.id));
    expect(u.data!.status).toBe('in_design');
  });
});
