import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TenderService } from './tender.service';
import { API_URL } from './api-url.token';
import type { Tender } from '../../../shared/types/index.js';

const MOCK_TENDER: Tender = {
  id: 'tnd-1', number: 'Т-0001', title: 'Поставка МАФ', type: '44fz',
  status: 'published', customerOrgId: 'org-1', customerName: 'Заказчик',
  startPrice: 1000000, publishDate: '2026-05-10', submissionDeadline: '2026-06-15',
  documents: [],
  createdAt: '2026-05-10T08:00:00.000Z', updatedAt: '2026-05-10T08:00:00.000Z',
};

describe('TenderService', () => {
  let service: TenderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(TenderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('getAll возвращает список через GET', async () => {
    const p = firstValueFrom(service.getAll());
    httpMock.expectOne('/api/v1/tenders').flush({ success: true, data: [MOCK_TENDER] });
    const res = await p;
    expect(res.data!.length).toBe(1);
    expect(res.data![0].title).toContain('МАФ');
  });

  it('create создаёт через POST', async () => {
    const p = firstValueFrom(service.create({
      title: 'Тест', type: 'commercial', status: 'draft',
      customerOrgId: 'org-1', customerName: 'Тест', documents: [], number: 'Т-9999',
    }));
    httpMock.expectOne('/api/v1/tenders').flush({ success: true, data: { ...MOCK_TENDER, title: 'Тест' } });
    const res = await p;
    expect(res.data!.title).toBe('Тест');
  });
});
