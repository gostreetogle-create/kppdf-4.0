import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StorageItemService } from './storage-item.service';
import { API_URL } from './api-url.token';
import type { StorageItem } from '../../../shared/types/index.js';

const MOCK_SI: StorageItem = {
  id: 'si-1', name: 'Сварочный аппарат', description: 'TIG-200',
  weightKg: 15, dimensions: '450×200', notes: 'Цех №1',
  isActive: true, createdAt: '2026-06-01T00:00:00.000Z', updatedAt: '2026-06-01T00:00:00.000Z',
};

function flushGet(httpMock: HttpTestingController, data: StorageItem[]) {
  httpMock.expectOne('/api/v1/storage-items').flush({ success: true, data });
}

describe('StorageItemService', () => {
  let service: StorageItemService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(StorageItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('getStorageItems возвращает пустой массив', async () => {
    const p = firstValueFrom(service.getStorageItems());
    flushGet(httpMock, []);
    expect((await p).data).toEqual([]);
  });

  it('getStorageItems возвращает все после создания', async () => {
    const p = firstValueFrom(service.getStorageItems());
    flushGet(httpMock, [MOCK_SI]);
    expect((await p).data!.length).toBe(1);
  });

  it('createStorageItem создаёт через POST', async () => {
    const p = firstValueFrom(service.createStorageItem({ name: 'Тест', isActive: true }));
    const req = httpMock.expectOne('/api/v1/storage-items');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: { ...MOCK_SI, name: 'Тест' } });
    expect((await p).data!.name).toBe('Тест');
  });

  it('getStorageItem возвращает по id', async () => {
    const p = firstValueFrom(service.getStorageItem('si-1'));
    httpMock.expectOne('/api/v1/storage-items/si-1').flush({ success: true, data: MOCK_SI });
    expect((await p).data!.id).toBe('si-1');
  });

  it('updateStorageItem обновляет через PUT', async () => {
    const p = firstValueFrom(service.updateStorageItem('si-1', { name: 'Новое' }));
    const req = httpMock.expectOne('/api/v1/storage-items/si-1');
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true, data: { ...MOCK_SI, name: 'Новое' } });
    expect((await p).data!.name).toBe('Новое');
  });

  it('deleteStorageItem удаляет через DELETE', async () => {
    const p = firstValueFrom(service.deleteStorageItem('si-1'));
    httpMock.expectOne('/api/v1/storage-items/si-1').flush({ success: true, data: null });
    expect((await p).success).toBe(true);
  });

  it('getStorageItem возвращает undefined для несуществующего', async () => {
    const p = firstValueFrom(service.getStorageItem('nonexistent'));
    httpMock.expectOne('/api/v1/storage-items/nonexistent').flush({ success: false, data: undefined });
    expect((await p).data).toBeUndefined();
  });
});
