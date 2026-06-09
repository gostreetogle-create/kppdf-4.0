import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { OrderClosingService } from './order-closing.service';
import { API_URL } from './api-url.token';
import type { OrderClosing } from '../../../shared/types/index.js';

const MOCK_OC: OrderClosing = {
  id: 'oc-1', productionOrderId: 'po-1', orderNumber: 'ПЗ-0001',
  closingType: 'act', number: 'АКТ-001', date: '2026-06-10', amount: 425000,
  organizationId: 'org-1', organizationName: 'Школа №42', status: 'signed',
  notes: 'Акт', createdAt: '2026-06-10T12:00:00.000Z', updatedAt: '2026-06-10T12:00:00.000Z',
};

describe('OrderClosingService', () => {
  let service: OrderClosingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(OrderClosingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('getAll возвращает список через GET', async () => {
    const p = firstValueFrom(service.getAll());
    httpMock.expectOne('/api/v1/order-closings').flush({ success: true, data: [MOCK_OC] });
    const res = await p;
    expect(res.data!.length).toBe(1);
  });

  it('create создаёт через POST', async () => {
    const p = firstValueFrom(service.create({ productionOrderId: 'po-1', orderNumber: 'ПЗ-0001', closingType: 'act', number: 'АКТ-001', date: '2026-06-10', status: 'draft' }));
    const req = httpMock.expectOne('/api/v1/order-closings');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: MOCK_OC });
    const res = await p;
    expect(res.success).toBe(true);
  });
});
