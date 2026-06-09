import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WorkerService } from './worker.service';
import { API_URL } from './api-url.token';

describe('WorkerService', () => {
  let svc: WorkerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api/v1' },
      ],
    });
    svc = TestBed.inject(WorkerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll: делает GET /workers', async () => {
    const promise = firstValueFrom(svc.getAll());
    const req = httpMock.expectOne('/api/v1/workers');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [{ id: 'wkr-1', lastName: 'Иванов', firstName: 'Иван', grade: 3, ratePerHour: 500, workTypeIds: ['wt-1'], isActive: true }] });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data.length).toBe(1);
    expect(res.data[0].lastName).toBe('Иванов');
  });

  it('create: делает POST /workers', async () => {
    const promise = firstValueFrom(svc.create({ lastName: 'Петров', firstName: 'Пётр', grade: 2, ratePerHour: 400, workTypeIds: ['wt-1'], isActive: true }));
    const req = httpMock.expectOne('/api/v1/workers');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: { id: 'wkr-new', lastName: 'Петров', firstName: 'Пётр', grade: 2, ratePerHour: 400, workTypeIds: ['wt-1'], isActive: true, createdAt: '', updatedAt: '' } });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data.lastName).toBe('Петров');
  });
});
