import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WorkTypeService } from './work-type.service';
import { API_URL } from './api-url.token';
import type { WorkType } from '../../../shared/types/index.js';

const MOCK_WT: WorkType = {
  id: 'wt-1', name: 'Лазерная резка', department: 'Изготовление',
  defaultDurationHours: 1, workCenterId: 'wc-1', isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('WorkTypeService', () => {
  let service: WorkTypeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(WorkTypeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('getAll возвращает список через GET', async () => {
    const p = firstValueFrom(service.getAll());
    httpMock.expectOne('/api/v1/work-types').flush({ success: true, data: [MOCK_WT] });
    const res = await p;
    expect(res.data!.length).toBe(1);
    expect(res.data![0].name).toBe('Лазерная резка');
  });

  it('create создаёт через POST', async () => {
    const p = firstValueFrom(service.create({ name: 'Test', department: 'D', defaultDurationHours: 1, isActive: true }));
    const req = httpMock.expectOne('/api/v1/work-types');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: { ...MOCK_WT, name: 'Test' } });
    const res = await p;
    expect(res.data!.name).toBe('Test');
  });

  it('delete удаляет через DELETE', async () => {
    const p = firstValueFrom(service.delete('wt-1'));
    httpMock.expectOne('/api/v1/work-types/wt-1').flush({ success: true, data: null });
    const res = await p;
    expect(res.success).toBe(true);
  });
});
