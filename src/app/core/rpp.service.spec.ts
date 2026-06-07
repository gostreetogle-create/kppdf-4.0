import { describe, it, expect, beforeEach } from 'vitest';
import { RppService } from './rpp.service';
import { firstValueFrom } from 'rxjs';

describe('RppService', () => {
  let svc: RppService;
  beforeEach(() => { svc = new RppService(); svc['items'] = []; });

  it('содержит seed-данные при создании', () => {
    const s = new RppService();
    expect(s['items'].length).toBe(2);
  });

  it('CRUD: создание и чтение', async () => {
    const r = await firstValueFrom(svc.create({ productId: 'p1', productName: 'Товар', productSku: 'SKU', status: 'draft' }));
    expect(r.data.productName).toBe('Товар');
    expect(svc['items'].length).toBe(1);
  });
});
