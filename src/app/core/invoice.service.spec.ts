import { describe, it, expect, beforeEach } from 'vitest';
import { InvoiceService } from './invoice.service';
import { firstValueFrom } from 'rxjs';

describe('InvoiceService', () => {
  let service: InvoiceService;

  beforeEach(() => {
    service = new InvoiceService();
    service['items'] = [];
  });

  describe('createInvoice', () => {
    it('создаёт счёт с авто-номером СФ-0001', async () => {
      const res = await firstValueFrom(service.createInvoice({
        number: '',
        date: '2026-06-07',
        supplierOrgId: 'org-1',
        amount: 50000,
        paid: 0,
        status: 'pending',
      }));

      expect(res.success).toBe(true);
      expect(res.data!.number).toMatch(/^СФ-\d{4}$/);
      expect(res.data!.amount).toBe(50000);
      expect(res.data!.paid).toBe(0);
    });
  });

  describe('changeStatus', () => {
    it('pending → paid', async () => {
      const cr = await firstValueFrom(service.createInvoice({ number: '', date: '2026-06-07', supplierOrgId: 'org-1', amount: 10000, paid: 0, status: 'pending' }));
      const res = await firstValueFrom(service.changeStatus(cr.data!.id, 'paid'));
      expect(res.data!.status).toBe('paid');
    });

    it('возвращает ошибку для несуществующего', async () => {
      const res = await firstValueFrom(service.changeStatus('nonexistent', 'paid'));
      expect(res.success).toBe(false);
    });
  });

  describe('getInvoices', () => {
    it('возвращает пустой массив', async () => {
      const res = await firstValueFrom(service.getInvoices());
      expect(res.data).toEqual([]);
    });
  });

  describe('updateInvoice', () => {
    it('обновляет сумму и paid', async () => {
      const cr = await firstValueFrom(service.createInvoice({ number: '', date: '2026-06-07', supplierOrgId: 'org-1', amount: 10000, paid: 0, status: 'pending' }));
      const res = await firstValueFrom(service.updateInvoice(cr.data!.id, { amount: 15000, paid: 15000 }));
      expect(res.data!.amount).toBe(15000);
      expect(res.data!.paid).toBe(15000);
    });
  });

  describe('deleteInvoice', () => {
    it('удаляет счёт', async () => {
      const cr = await firstValueFrom(service.createInvoice({ number: '', date: '2026-06-07', supplierOrgId: 'org-1', amount: 1, paid: 0, status: 'pending' }));
      await firstValueFrom(service.deleteInvoice(cr.data!.id));
      const all = await firstValueFrom(service.getInvoices());
      expect(all.data.length).toBe(0);
    });
  });
});
