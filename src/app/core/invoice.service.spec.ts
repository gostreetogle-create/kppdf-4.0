import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { InvoiceService } from './invoice.service';
import { API_URL } from './api-url.token';
import type { IncomingInvoice } from '../../../shared/types/index.js';

const MOCK_INV: IncomingInvoice = {
  id: 'inv-1', number: 'СФ-0001', date: '2026-05-16',
  supplierOrgId: 'sup-1', supplierOrderId: 'so-1',
  amount: 91000, paid: 50000, status: 'pending',
  notes: '', createdAt: '2026-05-16T10:00:00.000Z', updatedAt: '2026-05-16T10:00:00.000Z',
};

describe('InvoiceService', () => {
  let service: InvoiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(InvoiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('getInvoices возвращает список', async () => {
    const p = firstValueFrom(service.getInvoices());
    httpMock.expectOne('/api/v1/incoming-invoices').flush({ success: true, data: [MOCK_INV] });
    expect((await p).data!.length).toBe(1);
  });

  it('createInvoice создаёт счёт с авто-номером', async () => {
    const p = firstValueFrom(service.createInvoice({ date: '2026-06-01', supplierOrgId: 'sup-1', amount: 50000, paid: 0, status: 'pending' }));
    const req = httpMock.expectOne('/api/v1/incoming-invoices');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.number).toMatch(/^СФ-\d{4}$/);
    req.flush({ success: true, data: MOCK_INV });
    expect((await p).success).toBe(true);
  });

  it('changeStatus: pending → paid', async () => {
    const p = firstValueFrom(service.changeStatus('inv-1', 'paid'));
    const req = httpMock.expectOne('/api/v1/incoming-invoices/inv-1');
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true, data: { ...MOCK_INV, status: 'paid' } });
    expect((await p).data!.status).toBe('paid');
  });

  it('changeStatus: pending → cancelled', async () => {
    const p = firstValueFrom(service.changeStatus('inv-1', 'cancelled'));
    httpMock.expectOne('/api/v1/incoming-invoices/inv-1').flush({ success: true, data: { ...MOCK_INV, status: 'cancelled' } });
    expect((await p).data!.status).toBe('cancelled');
  });

  it('changeStatus возвращает ошибку для невалидного статуса', async () => {
    const p = firstValueFrom(service.changeStatus('inv-1', 'invalid' as unknown as 'paid'));
    expect((await p).success).toBe(false);
  });

  it('deleteInvoice удаляет', async () => {
    const p = firstValueFrom(service.deleteInvoice('inv-1'));
    httpMock.expectOne('/api/v1/incoming-invoices/inv-1').flush({ success: true, data: null });
    expect((await p).success).toBe(true);
  });
});
