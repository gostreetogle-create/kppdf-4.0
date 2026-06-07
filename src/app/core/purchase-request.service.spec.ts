import { describe, it, expect, beforeEach } from 'vitest';
import { PurchaseRequestService } from './purchase-request.service';
import { firstValueFrom } from 'rxjs';

describe('PurchaseRequestService', () => {
  let service: PurchaseRequestService;

  beforeEach(() => {
    service = new PurchaseRequestService();
    service['items'] = [];
  });

  describe('createRequest', () => {
    it('создаёт заявку с авто-номером ПЗ-0001', async () => {
      const res = await firstValueFrom(service.createRequest({
        sourceType: 'manual',
        entityType: 'product',
        entityId: 'prod-1',
        entityName: 'Труба 40×40',
        entityUnit: 'м.п',
        quantity: 100,
        status: 'draft',
      }));

      expect(res.success).toBe(true);
      expect(res.data!.number).toMatch(/^ПЗ-\d{4}$/);
      expect(res.data!.entityName).toBe('Труба 40×40');
      expect(res.data!.quantity).toBe(100);
    });

    it('авто-нумерация уникальна', async () => {
      const r1 = await firstValueFrom(service.createRequest({ sourceType: 'manual', entityType: 'product', entityId: 'p1', entityName: 'A', entityUnit: 'шт', quantity: 1, status: 'draft' }));
      const r2 = await firstValueFrom(service.createRequest({ sourceType: 'manual', entityType: 'product', entityId: 'p2', entityName: 'B', entityUnit: 'шт', quantity: 2, status: 'draft' }));
      expect(r1.data!.number).not.toBe(r2.data!.number);
    });
  });

  describe('getRequests', () => {
    it('возвращает пустой массив', async () => {
      const res = await firstValueFrom(service.getRequests());
      expect(res.data).toEqual([]);
    });
  });

  describe('changeStatus', () => {
    it('меняет статус draft → pending → approved', async () => {
      const cr = await firstValueFrom(service.createRequest({ sourceType: 'manual', entityType: 'product', entityId: 'p1', entityName: 'X', entityUnit: 'шт', quantity: 1, status: 'draft' }));
      const id = cr.data!.id;

      await firstValueFrom(service.changeStatus(id, 'pending'));
      let r = await firstValueFrom(service.getRequest(id));
      expect(r.data!.status).toBe('pending');

      await firstValueFrom(service.changeStatus(id, 'approved'));
      r = await firstValueFrom(service.getRequest(id));
      expect(r.data!.status).toBe('approved');
    });

    it('возвращает ошибку для несуществующего id', async () => {
      const res = await firstValueFrom(service.changeStatus('nonexistent', 'approved'));
      expect(res.success).toBe(false);
    });
  });

  describe('deleteRequest', () => {
    it('удаляет заявку', async () => {
      const cr = await firstValueFrom(service.createRequest({ sourceType: 'manual', entityType: 'product', entityId: 'p1', entityName: 'X', entityUnit: 'шт', quantity: 1, status: 'draft' }));
      await firstValueFrom(service.deleteRequest(cr.data!.id));
      const all = await firstValueFrom(service.getRequests());
      expect(all.data.length).toBe(0);
    });
  });
});
