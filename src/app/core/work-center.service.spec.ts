import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WorkCenterService } from './work-center.service';
import { API_URL } from './api-url.token';

describe('WorkCenterService', () => {
  let svc: WorkCenterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api/v1' },
      ],
    });
    svc = TestBed.inject(WorkCenterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll: делает GET /work-centers', async () => {
    const promise = firstValueFrom(svc.getAll());
    const req = httpMock.expectOne('/api/v1/work-centers');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [{ id: 'wc-1', name: 'Цех 1', type: 'production', isActive: true }] });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data.length).toBe(1);
    expect(res.data[0].name).toBe('Цех 1');
  });

  it('create: делает POST /work-centers', async () => {
    const promise = firstValueFrom(svc.create({ name: 'Новый цех', type: 'production', isActive: true }));
    const req = httpMock.expectOne('/api/v1/work-centers');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toMatchObject({ name: 'Новый цех', type: 'production' });
    req.flush({ success: true, data: { id: 'wc-new', name: 'Новый цех', type: 'production', isActive: true, createdAt: '', updatedAt: '' } });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data.name).toBe('Новый цех');
  });
});
