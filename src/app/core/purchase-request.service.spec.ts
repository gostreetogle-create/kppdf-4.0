import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PurchaseRequestService } from './purchase-request.service';
import { API_URL } from './api-url.token';
import type { PurchaseRequest } from '../../../shared/types/index.js';

const MOCK_PR: PurchaseRequest = {
  id: 'pr-1', number: 'ПЗ-0001', sourceType: 'manual',
  entityType: 'product', entityId: 'prod-1',
  entityName: 'Труба 40×40', entityUnit: 'м.п',
  quantity: 100, warehouseId: 'wh-1', status: 'draft',
  createdAt: '2026-05-10T09:00:00.000Z', updatedAt: '2026-05-10T09:00:00.000Z',
};

describe('PurchaseRequestService', () => {
  let service: PurchaseRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(PurchaseRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('createRequest создаёт с авто-номером ПЗ-NNNN', async () => {
    const p = firstValueFrom(service.createRequest({ sourceType: 'manual', entityType: 'product', entityId: 'p1', entityName: 'A', entityUnit: 'шт', quantity: 1, status: 'draft' }));
    const req = httpMock.expectOne('/api/v1/purchase-requests');
    expect(req.request.body.number).toMatch(/^ПЗ-\d{4}$/);
    req.flush({ success: true, data: MOCK_PR });
    expect((await p).success).toBe(true);
  });

  it('авто-нумерация уникальна', async () => {
    const p1 = firstValueFrom(service.createRequest({ sourceType: 'manual', entityType: 'product', entityId: 'p1', entityName: 'A', entityUnit: 'шт', quantity: 1, status: 'draft' }));
    const r1 = httpMock.expectOne('/api/v1/purchase-requests');
    const num1 = r1.request.body.number;
    r1.flush({ success: true, data: { ...MOCK_PR, number: num1 } });

    const p2 = firstValueFrom(service.createRequest({ sourceType: 'manual', entityType: 'product', entityId: 'p2', entityName: 'B', entityUnit: 'шт', quantity: 2, status: 'draft' }));
    const r2 = httpMock.expectOne('/api/v1/purchase-requests');
    const num2 = r2.request.body.number;
    r2.flush({ success: true, data: { ...MOCK_PR, number: num2 } });

    const [res1, res2] = await Promise.all([p1, p2]);
    expect(res1.data!.number).not.toBe(res2.data!.number);
  });

  it('getRequests возвращает список', async () => {
    const p = firstValueFrom(service.getRequests());
    httpMock.expectOne('/api/v1/purchase-requests').flush({ success: true, data: [MOCK_PR] });
    expect((await p).data!.length).toBe(1);
  });

  it('changeStatus: draft → pending → approved', async () => {
    const p1 = firstValueFrom(service.changeStatus('pr-1', 'pending'));
    httpMock.expectOne('/api/v1/purchase-requests/pr-1').flush({ success: true, data: { ...MOCK_PR, status: 'pending' } });
    expect((await p1).data!.status).toBe('pending');

    const p2 = firstValueFrom(service.changeStatus('pr-1', 'approved'));
    httpMock.expectOne('/api/v1/purchase-requests/pr-1').flush({ success: true, data: { ...MOCK_PR, status: 'approved' } });
    expect((await p2).data!.status).toBe('approved');
  });

  it('changeStatus ошибка для невалидного статуса', async () => {
    const p = firstValueFrom(service.changeStatus('pr-1', 'invalid' as unknown as 'draft'));
    expect((await p).success).toBe(false);
  });

  it('deleteRequest удаляет', async () => {
    const p = firstValueFrom(service.deleteRequest('pr-1'));
    httpMock.expectOne('/api/v1/purchase-requests/pr-1').flush({ success: true, data: null });
    expect((await p).success).toBe(true);
  });
});
