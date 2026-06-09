import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FinancialReportService } from './financial-report.service';
import { API_URL } from './api-url.token';
import type { FinancialReport } from '../../../shared/types/index.js';

const MOCK_FR: FinancialReport = {
  id: 'fr-1', title: 'Отчёт Q2', reportType: 'profit_loss',
  periodStart: '2026-04-01', periodEnd: '2026-06-30',
  data: { revenue: 100 }, totalAmount: 100, status: 'draft',
  createdAt: '2026-06-07T10:00:00.000Z', updatedAt: '2026-06-07T10:00:00.000Z',
};

describe('FinancialReportService', () => {
  let service: FinancialReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(FinancialReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('getAll возвращает список через GET', async () => {
    const p = firstValueFrom(service.getAll());
    httpMock.expectOne('/api/v1/financial-reports').flush({ success: true, data: [MOCK_FR] });
    const res = await p;
    expect(res.data!.length).toBe(1);
  });

  it('create создаёт через POST', async () => {
    const p = firstValueFrom(service.create({ title: 'Q2', reportType: 'profit_loss', periodStart: '2026-04-01', periodEnd: '2026-06-30', status: 'draft' }));
    httpMock.expectOne('/api/v1/financial-reports').flush({ success: true, data: MOCK_FR });
    const res = await p;
    expect(res.success).toBe(true);
  });
});
