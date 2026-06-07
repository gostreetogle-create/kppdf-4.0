import { describe, it, expect, beforeEach } from 'vitest';
import { SupplierOrderService } from './supplier-order.service';
import { firstValueFrom } from 'rxjs';

describe('SupplierOrderService', () => {
  let service: SupplierOrderService;

  beforeEach(() => {
    service = new SupplierOrderService();
    service['items'] = [];
  });

  describe('createOrder', () => {
    it('создаёт заказ с авто-номером ЗП-0001', async () => {
      const res = await firstValueFrom(service.createOrder({
        supplierOrgId: 'org-1',
        status: 'draft',
        items: [{ id: 'it-1', entityType: 'product', entityId: 'p1', entityName: 'Труба', entityUnit: 'м.п', quantity: 50, price: 250 }],
        totalAmount: 12500,
      }));

      expect(res.success).toBe(true);
      expect(res.data!.number).toMatch(/^ЗП-\d{4}$/);
      expect(res.data!.items.length).toBe(1);
      expect(res.data!.totalAmount).toBe(12500);
    });
  });

  describe('changeStatus', () => {
    it('draft → sent → confirmed', async () => {
      const cr = await firstValueFrom(service.createOrder({ supplierOrgId: 'org-1', status: 'draft', items: [], totalAmount: 0 }));
      await firstValueFrom(service.changeStatus(cr.data!.id, 'sent'));
      let r = await firstValueFrom(service.getOrder(cr.data!.id));
      expect(r.data!.status).toBe('sent');

      await firstValueFrom(service.changeStatus(cr.data!.id, 'confirmed'));
      r = await firstValueFrom(service.getOrder(cr.data!.id));
      expect(r.data!.status).toBe('confirmed');
    });
  });

  describe('getOrders', () => {
    it('возвращает пустой массив', async () => {
      const res = await firstValueFrom(service.getOrders());
      expect(res.data).toEqual([]);
    });
  });

  describe('updateOrder', () => {
    it('обновляет поля', async () => {
      const cr = await firstValueFrom(service.createOrder({ supplierOrgId: 'org-1', status: 'draft', items: [], totalAmount: 0 }));
      const res = await firstValueFrom(service.updateOrder(cr.data!.id, { notes: 'Срочно!' }));
      expect(res.data!.notes).toBe('Срочно!');
    });
  });

  describe('deleteOrder', () => {
    it('удаляет заказ', async () => {
      const cr = await firstValueFrom(service.createOrder({ supplierOrgId: 'org-1', status: 'draft', items: [], totalAmount: 0 }));
      await firstValueFrom(service.deleteOrder(cr.data!.id));
      const all = await firstValueFrom(service.getOrders());
      expect(all.data.length).toBe(0);
    });
  });
});
