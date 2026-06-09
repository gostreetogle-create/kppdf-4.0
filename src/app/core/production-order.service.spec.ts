import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ProductionOrderService } from './production-order.service';
import { API_URL } from './api-url.token';

describe('ProductionOrderService', () => {
  let svc: ProductionOrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api/v1' },
      ],
    });
    svc = TestBed.inject(ProductionOrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll: делает GET /production-orders', async () => {
    const promise = firstValueFrom(svc.getAll());
    const req = httpMock.expectOne('/api/v1/production-orders');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [{ id: 'po-1', number: 'ПЗ-0001', contractId: 'ctr-1', productId: 'prod-1', productName: 'Изделие', productSku: 'SKU', quantity: 10, status: 'accepted' }] });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data.length).toBe(1);
    expect(res.data[0].number).toBe('ПЗ-0001');
  });

  it('createOrder: делает POST и возвращает номер ПЗ', async () => {
    const data = { contractId: 'c1', productId: 'p1', productName: 'X', productSku: 'XX', quantity: 1, status: 'accepted' as const };
    const promise = firstValueFrom(svc.createOrder(data));
    const req = httpMock.expectOne('/api/v1/production-orders');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: { id: 'po-new', number: 'ПЗ-0003', ...data, createdAt: '', updatedAt: '' } });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data.number).toMatch(/^ПЗ-/);
  });

  it('changeStatus: делает PUT /production-orders/:id', async () => {
    const promise = firstValueFrom(svc.changeStatus('po-1', 'in_design'));
    const req = httpMock.expectOne('/api/v1/production-orders/po-1');
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true, data: { id: 'po-1', number: 'ПЗ-0001', status: 'in_design', contractId: 'ctr-1', productId: 'prod-1', productName: 'X', productSku: 'XX', quantity: 1, createdAt: '', updatedAt: '' } });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data.status).toBe('in_design');
  });
});
