import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ReconciliationActService } from './reconciliation-act.service';
import { API_URL } from './api-url.token';
import type { ReconciliationAct } from '../../../shared/types/index.js';

const MOCK_RA: ReconciliationAct = {
  id: 'ra-1', organizationId: 'sup-1', organizationName: 'ООО Тест',
  number: 'АС-001', periodStart: '2026-01-01', periodEnd: '2026-06-30',
  ourDebt: 100, balance: -100, status: 'draft',
  createdAt: '2026-06-20T10:00:00.000Z', updatedAt: '2026-06-20T10:00:00.000Z',
};

describe('ReconciliationActService', () => {
  let service: ReconciliationActService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(ReconciliationActService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('getAll возвращает список через GET', async () => {
    const p = firstValueFrom(service.getAll());
    httpMock.expectOne('/api/v1/reconciliation-acts').flush({ success: true, data: [MOCK_RA] });
    const res = await p;
    expect(res.data!.length).toBe(1);
  });

  it('create создаёт через POST', async () => {
    const p = firstValueFrom(service.create({ organizationId: 'sup-1', organizationName: 'ООО Тест', number: 'АС-001', periodStart: '2026-01-01', periodEnd: '2026-06-30', status: 'draft' }));
    httpMock.expectOne('/api/v1/reconciliation-acts').flush({ success: true, data: MOCK_RA });
    const res = await p;
    expect(res.success).toBe(true);
  });
});
