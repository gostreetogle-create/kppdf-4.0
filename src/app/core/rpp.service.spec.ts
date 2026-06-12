import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RppService } from './rpp.service';
import { API_URL } from './api-url.token';
import type { RppEntry } from '../../../shared/types/index.js';

const MOCK_RPP: RppEntry = {
  id: 'rpp-1', productId: 'prod-1', productName: 'Стойка баскетбольная', productSku: 'SP0001',
  registryNumber: 'РПП-2026/001', status: 'registered',
  submissionDate: '2026-02-01', registrationDate: '2026-03-15', expiryDate: '2029-03-15',
  createdAt: '2026-02-01T10:00:00.000Z', updatedAt: '2026-03-15T10:00:00.000Z',
};

describe('RppService', () => {
  let service: RppService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(RppService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('getAll возвращает список через GET', async () => {
    const p = firstValueFrom(service.getAll());
    httpMock.expectOne('/api/v1/rpp').flush({ success: true, data: [MOCK_RPP] });
    const res = await p;
    expect(res.data!.length).toBe(1);
    expect(res.data![0].productName).toBe('Стойка баскетбольная');
  });

  it('create создаёт через POST', async () => {
    const p = firstValueFrom(service.create({
      productId: 'p1', productName: 'Новый', productSku: 'SKU', status: 'draft',
    }));
    httpMock.expectOne('/api/v1/rpp').flush({ success: true, data: { ...MOCK_RPP, productName: 'Новый' } });
    const res = await p;
    expect(res.data!.productName).toBe('Новый');
  });
});
