import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SupplierOrderService } from './supplier-order.service';
import { API_URL } from './api-url.token';
import type { SupplierOrder } from '../../../shared/types/index.js';

const MOCK_SO: SupplierOrder = {
  id: 'so-1', number: 'ЗП-0001', supplierOrgId: 'sup-1',
  status: 'draft', items: [{ id: 'soi-1', entityType: 'product', entityId: 'p1', entityName: 'Труба', entityUnit: 'шт', quantity: 10, price: 500 }],
  totalAmount: 5000, expectedDate: '2026-06-20',
  createdAt: '2026-05-15T10:00:00.000Z', updatedAt: '2026-05-15T10:00:00.000Z',
};

describe('SupplierOrderService', () => {
  let service: SupplierOrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(SupplierOrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('createOrder создаёт с авто-номером ЗП-NNNN', async () => {
    const p = firstValueFrom(service.createOrder({ supplierOrgId: 'sup-1', status: 'draft', items: [] }));
    const req = httpMock.expectOne('/api/v1/supplier-orders');
    expect(req.request.body.number).toMatch(/^ЗП-\d{4}$/);
    req.flush({ success: true, data: MOCK_SO });
    expect((await p).success).toBe(true);
  });

  it('getOrders возвращает список', async () => {
    const p = firstValueFrom(service.getOrders());
    httpMock.expectOne('/api/v1/supplier-orders').flush({ success: true, data: [MOCK_SO] });
    expect((await p).data!.length).toBe(1);
  });

  it('changeStatus: draft → sent → confirmed', async () => {
    const p1 = firstValueFrom(service.changeStatus('so-1', 'sent'));
    httpMock.expectOne('/api/v1/supplier-orders/so-1').flush({ success: true, data: { ...MOCK_SO, status: 'sent' } });
    expect((await p1).data!.status).toBe('sent');

    const p2 = firstValueFrom(service.changeStatus('so-1', 'confirmed'));
    httpMock.expectOne('/api/v1/supplier-orders/so-1').flush({ success: true, data: { ...MOCK_SO, status: 'confirmed' } });
    expect((await p2).data!.status).toBe('confirmed');
  });

  it('changeStatus ошибка для невалидного статуса', async () => {
    const p = firstValueFrom(service.changeStatus('so-1', 'invalid' as unknown as 'draft'));
    expect((await p).success).toBe(false);
  });

  it('deleteOrder удаляет', async () => {
    const p = firstValueFrom(service.deleteOrder('so-1'));
    httpMock.expectOne('/api/v1/supplier-orders/so-1').flush({ success: true, data: null });
    expect((await p).success).toBe(true);
  });
});
