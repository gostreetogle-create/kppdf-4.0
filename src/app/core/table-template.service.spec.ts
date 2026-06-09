import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TableTemplateService } from './table-template.service';
import { API_URL } from './api-url.token';
import type { TableTemplate } from '../../../shared/types/index.js';

const MOCK_TPL: TableTemplate = {
  id: 'tt-1', name: 'Тестовый шаблон',
  columns: [{ tableName: 'products', fieldName: 'name', label: 'Название', order: 0 }],
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('TableTemplateService', () => {
  let service: TableTemplateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(TableTemplateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('должен создать шаблон', async () => {
    const promise = firstValueFrom(service.createTemplate({ name: 'Тестовый шаблон', columns: [{ tableName: 'products', fieldName: 'name', label: 'Название', order: 0 }] }));
    const req = httpMock.expectOne('/api/v1/table-templates');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: MOCK_TPL });
    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Тестовый шаблон');
    expect(result.data.columns.length).toBe(1);
    expect(result.data.id).toBeDefined();
  });

  it('должен вернуть список шаблонов', async () => {
    const t1 = { ...MOCK_TPL, id: 'tt-1', name: 'Шаблон 1' };
    const t2 = { ...MOCK_TPL, id: 'tt-2', name: 'Шаблон 2' };
    const promise = firstValueFrom(service.getTemplates());
    httpMock.expectOne('/api/v1/table-templates').flush({ success: true, data: [t1, t2] });
    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.data.length).toBe(2);
  });

  it('должен получить шаблон по id', async () => {
    const promise = firstValueFrom(service.getTemplate('tt-1'));
    httpMock.expectOne('/api/v1/table-templates/tt-1').flush({ success: true, data: { ...MOCK_TPL, name: 'Найти меня' } });
    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.data!.name).toBe('Найти меня');
  });

  it('должен обновить шаблон', async () => {
    const promise = firstValueFrom(service.updateTemplate('tt-1', { name: 'После обновления' }));
    const req = httpMock.expectOne('/api/v1/table-templates/tt-1');
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true, data: { ...MOCK_TPL, name: 'После обновления' } });
    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('После обновления');
  });

  it('должен удалить шаблон', async () => {
    const promise = firstValueFrom(service.deleteTemplate('tt-1'));
    httpMock.expectOne('/api/v1/table-templates/tt-1').flush({ success: true, data: null });
    const result = await promise;
    expect(result.success).toBe(true);
  });

  it('должен клонировать шаблон', async () => {
    const clonePromise = firstValueFrom(service.cloneTemplate('tt-1'));
    const getReq = httpMock.expectOne('/api/v1/table-templates/tt-1');
    getReq.flush({ success: true, data: { ...MOCK_TPL, name: 'Оригинал', columns: [{ tableName: 'products', fieldName: 'price', label: 'Цена', order: 0 }] } });
    const postReq = httpMock.expectOne('/api/v1/table-templates');
    postReq.flush({ success: true, data: { ...MOCK_TPL, id: 'tt-cloned', name: 'Оригинал (копия)', columns: [{ tableName: 'products', fieldName: 'price', label: 'Цена', order: 0 }] } });
    const result = await clonePromise;
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Оригинал (копия)');
    expect(result.data.columns.length).toBe(1);
    expect(result.data.id).not.toBe('tt-1');
  });

  it('должен вернуть ошибку для несуществующего шаблона', async () => {
    const promise = firstValueFrom(service.getTemplate('nonexistent-id'));
    httpMock.expectOne('/api/v1/table-templates/nonexistent-id').flush({ success: false, data: undefined });
    const result = await promise;
    expect(result.success).toBe(false);
  });
});
