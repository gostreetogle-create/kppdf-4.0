import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { InventorFileService } from './inventor-file.service';
import { API_URL } from './api-url.token';
import type { InventorFile } from '../../../shared/types/index.js';

const MOCK_FILE: InventorFile = {
  id: 'cad-1', productId: 'prod-1', productName: 'Стойка БСФП-120', productSku: 'SP0001',
  fileName: 'BSFP120_Стойка.dwg', fileType: 'dwg', sizeKb: 3450, version: '2.5',
  author: 'Иванов И.И.',
  createdAt: '2026-01-15T10:00:00.000Z', updatedAt: '2026-03-01T10:00:00.000Z',
};

describe('InventorFileService', () => {
  let service: InventorFileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(InventorFileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('getAll возвращает список через GET', async () => {
    const p = firstValueFrom(service.getAll());
    httpMock.expectOne('/api/v1/inventor-files').flush({ success: true, data: [MOCK_FILE] });
    const res = await p;
    expect(res.data!.length).toBe(1);
    expect(res.data![0].fileName).toBe('BSFP120_Стойка.dwg');
  });

  it('create создаёт через POST', async () => {
    const p = firstValueFrom(service.create({
      productId: 'p1', productName: 'Товар', productSku: 'SKU',
      fileName: 'file.dwg', fileType: 'dwg',
    }));
    httpMock.expectOne('/api/v1/inventor-files').flush({ success: true, data: { ...MOCK_FILE, fileName: 'file.dwg' } });
    const res = await p;
    expect(res.data!.fileName).toBe('file.dwg');
  });
});
