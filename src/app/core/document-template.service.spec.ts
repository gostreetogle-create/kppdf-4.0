import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DocumentTemplateService } from './document-template.service';
import { API_URL } from './api-url.token';
import type { DocumentTemplate } from '../../../shared/types/index.js';

const MOCK_QUOTATION: DocumentTemplate = {
  id: 'mock-quotation-001', name: 'Коммерческое предложение', docType: 'quotation',
  blocks: [
    { id: 'b1', type: 'text', label: 'Заголовок', content: 'Коммерческое предложение', sortOrder: 1 },
    { id: 'b2', type: 'text', label: 'Дата', content: '{{date}}', sortOrder: 2 },
    { id: 'b3', type: 'table', label: 'Таблица позиций', tableTemplateId: 'tt-1', sortOrder: 3 },
    { id: 'b4', type: 'text', label: 'Условия', content: '{{notes}}', sortOrder: 4 },
    { id: 'b5', type: 'text', label: 'Подписи', content: 'Подпись: ______', sortOrder: 5 },
  ],
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
} as DocumentTemplate;

const MOCK_CONTRACT: DocumentTemplate = {
  id: 'mock-contract-001', name: 'Договор поставки', docType: 'contract',
  blocks: [{ id: 'b6', type: 'text', label: 'Текст договора', content: 'Договор поставки №...', sortOrder: 1 }],
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
} as DocumentTemplate;

describe('DocumentTemplateService', () => {
  let service: DocumentTemplateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(DocumentTemplateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('создаётся', () => { expect(service).toBeTruthy(); });

  it('getTemplates — возвращает мок-данные (2 шаблона)', async () => {
    const promise = firstValueFrom(service.getTemplates());
    httpMock.expectOne('/api/v1/document-templates').flush({ success: true, data: [MOCK_QUOTATION, MOCK_CONTRACT] });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data.length).toBe(2);
    expect(res.data[0].name).toBe('Коммерческое предложение');
    expect(res.data[1].name).toBe('Договор поставки');
  });

  it('getTemplate — возвращает шаблон по id', async () => {
    const promise = firstValueFrom(service.getTemplate('mock-quotation-001'));
    httpMock.expectOne('/api/v1/document-templates/mock-quotation-001').flush({ success: true, data: MOCK_QUOTATION });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data?.name).toBe('Коммерческое предложение');
    expect((res.data as DocumentTemplate)?.blocks.length).toBe(5);
  });

  it('getTemplate — возвращает undefined для несуществующего id', async () => {
    const promise = firstValueFrom(service.getTemplate('nonexistent'));
    httpMock.expectOne('/api/v1/document-templates/nonexistent').flush({ success: false, data: undefined });
    const res = await promise;
    expect(res.success).toBe(false);
    expect(res.data).toBeUndefined();
  });

  it('createTemplate — создаёт новый шаблон', async () => {
    const newTpl = { id: 'new-tpl', name: 'Новый шаблон', docType: 'invoice', blocks: [], createdAt: '2026-06-01T00:00:00.000Z', updatedAt: '2026-06-01T00:00:00.000Z' };
    const createPromise = firstValueFrom(service.createTemplate({ name: 'Новый шаблон', docType: 'invoice', blocks: [] }));
    const createReq = httpMock.expectOne('/api/v1/document-templates');
    expect(createReq.request.method).toBe('POST');
    createReq.flush({ success: true, data: newTpl });
    const res = await createPromise;
    expect(res.success).toBe(true);
    expect(res.data.name).toBe('Новый шаблон');
    expect(res.data.docType).toBe('invoice');
    expect(res.data.id).toBeTruthy();
    expect((res.data as DocumentTemplate).createdAt).toBeTruthy();
  });

  it('updateTemplate — обновляет существующий шаблон', async () => {
    const updated = { ...MOCK_QUOTATION, name: 'Обновлённое КП' };
    const promise = firstValueFrom(service.updateTemplate('mock-quotation-001', { name: 'Обновлённое КП' }));
    const req = httpMock.expectOne('/api/v1/document-templates/mock-quotation-001');
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true, data: updated });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data.name).toBe('Обновлённое КП');
  });

  it('updateTemplate — возвращает ошибку для несуществующего id', async () => {
    const promise = firstValueFrom(service.updateTemplate('nonexistent', { name: 'Test' }));
    httpMock.expectOne('/api/v1/document-templates/nonexistent').flush({ success: false, data: undefined, message: 'Сущность не найдена' });
    const res = await promise;
    expect(res.success).toBe(false);
    expect(res.message).toBe('Сущность не найдена');
  });

  it('deleteTemplate — удаляет шаблон', async () => {
    const promise = firstValueFrom(service.deleteTemplate('mock-contract-001'));
    httpMock.expectOne('/api/v1/document-templates/mock-contract-001').flush({ success: true, data: null });
    const res = await promise;
    expect(res.success).toBe(true);
  });

  it('deleteTemplate — возвращает ошибку для несуществующего id', async () => {
    const promise = firstValueFrom(service.deleteTemplate('nonexistent'));
    httpMock.expectOne('/api/v1/document-templates/nonexistent').flush({ success: false, data: undefined, message: 'Сущность не найдена' });
    const res = await promise;
    expect(res.success).toBe(false);
    expect(res.message).toBe('Сущность не найдена');
  });

  it('cloneTemplate — клонирует шаблон с суффиксом (копия)', async () => {
    // clone: GET template → POST clone
    const getPromise = firstValueFrom(service.cloneTemplate('mock-quotation-001'));
    const getReq = httpMock.expectOne('/api/v1/document-templates/mock-quotation-001');
    getReq.flush({ success: true, data: MOCK_QUOTATION });
    const postReq = httpMock.expectOne('/api/v1/document-templates');
    const cloned = { ...MOCK_QUOTATION, id: 'cloned-001', name: 'Коммерческое предложение (копия)' };
    postReq.flush({ success: true, data: cloned });
    const res = await getPromise;
    expect(res.success).toBe(true);
    expect(res.data.name).toBe('Коммерческое предложение (копия)');
    expect(res.data.id).not.toBe('mock-quotation-001');
  });

  it('cloneTemplate — возвращает ошибку для несуществующего id', async () => {
    const promise = firstValueFrom(service.cloneTemplate('nonexistent'));
    httpMock.expectOne('/api/v1/document-templates/nonexistent').flush({ success: false, data: undefined });
    const res = await promise;
    expect(res.success).toBe(false);
    expect(res.message).toBe('Шаблон не найден');
  });
});
