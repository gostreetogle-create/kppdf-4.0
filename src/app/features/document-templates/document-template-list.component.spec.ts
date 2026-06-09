import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DocumentTemplateListComponent } from './document-template-list.component';
import { DocumentTemplateService } from '../../core/document-template.service';
import { NotificationService } from '../../core/notification.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { API_URL } from '../../core/api-url.token';
import type { DocumentTemplate } from '../../../../shared/types/index.js';

const MOCK_QUOTATION: DocumentTemplate = {
  id: 't1', name: 'Коммерческое предложение', docType: 'quotation',
  blocks: [{ id: 'b1', type: 'text', label: 'A', content: 'test', sortOrder: 1 },{ id: 'b2', type: 'text', label: 'B', content: 'test', sortOrder: 2 },{ id: 'b3', type: 'table', label: 'C', tableTemplateId: 'tt-1', sortOrder: 3 },{ id: 'b4', type: 'text', label: 'D', content: 'test', sortOrder: 4 },{ id: 'b5', type: 'text', label: 'E', content: 'test', sortOrder: 5 }],
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
} as DocumentTemplate;

const MOCK_CONTRACT: DocumentTemplate = {
  id: 't2', name: 'Договор поставки', docType: 'contract',
  blocks: [{ id: 'b6', type: 'text', label: 'A', content: 'test', sortOrder: 1 },{ id: 'b7', type: 'text', label: 'B', content: 'test', sortOrder: 2 },{ id: 'b8', type: 'text', label: 'C', content: 'test', sortOrder: 3 },{ id: 'b9', type: 'text', label: 'D', content: 'test', sortOrder: 4 },{ id: 'b10', type: 'text', label: 'E', content: 'test', sortOrder: 5 }],
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
} as DocumentTemplate;

const SEED_TEMPLATES = [MOCK_QUOTATION, MOCK_CONTRACT];

describe('DocumentTemplateListComponent', () => {
  let notification: NotificationService;
  let confirmService: ConfirmationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api/v1' },
        MessageService, ConfirmationService, NotificationService, DocumentTemplateService,
      ],
    });
    notification = TestBed.inject(NotificationService);
    confirmService = TestBed.inject(ConfirmationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { TestBed.resetTestingModule(); httpMock.verify(); });

  function createComponent(): DocumentTemplateListComponent {
    let component!: DocumentTemplateListComponent;
    TestBed.runInInjectionContext(() => { component = new DocumentTemplateListComponent(); });
    return component;
  }

  function mockLoadTemplates() {
    httpMock.expectOne('/api/v1/document-templates').flush({ success: true, data: SEED_TEMPLATES });
  }

  it('создаётся', () => { expect(createComponent()).toBeTruthy(); });

  it('значения по умолчанию', () => {
    const c = createComponent();
    expect(c.templates()).toEqual([]);
    expect(c.loading()).toBe(false);
    expect(c.tableColumns.length).toBe(4);
    expect(c.breadcrumbs.length).toBe(2);
  });

  it('tableColumns содержит правильные колонки', () => {
    const c = createComponent();
    const fields = c.tableColumns.map(col => col.field);
    expect(fields).toEqual(['name', 'docTypeLabel', 'blocksCount', 'updatedAtDisplay']);
  });

  it('loadTemplates загружает мок-данные и трансформирует', async () => {
    const c = createComponent();
    const promise = c.loadTemplates(); mockLoadTemplates(); await promise;
    const templates = c.templates();
    expect(templates.length).toBe(2);
    expect(templates[0].name).toBe('Коммерческое предложение');
    expect(templates[0].blocksCount).toBe(5);
    expect(templates[0].docTypeLabel).toBe('КП');
    expect(templates[1].name).toBe('Договор поставки');
    expect(templates[1].blocksCount).toBe(5);
    expect(templates[1].docTypeLabel).toBe('Договор');
    expect(c.loading()).toBe(false);
  });

  it('loadTemplates устанавливает loading=true во время загрузки', async () => {
    const c = createComponent();
    const promise = c.loadTemplates();
    expect(c.loading()).toBe(true);
    mockLoadTemplates();
    await promise;
    expect(c.loading()).toBe(false);
  });

  it('onEditRow навигирует на страницу редактирования', () => {
    const c = createComponent();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    c.onEditRow({ id: 't1', name: 'Test' });
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/document-templates', 't1', 'edit']);
  });

  it('onClone клонирует шаблон и обновляет список', async () => {
    const c = createComponent();
    const notifySpy = vi.spyOn(notification, 'success');
    const loadPromise = c.loadTemplates(); mockLoadTemplates(); await loadPromise;
    const initialCount = c.templates().length;
    const firstId = c.templates()[0].id;
    const clonePromise = c.onClone({ id: firstId });
    // cloneTemplate: GET + POST
    httpMock.expectOne(`/api/v1/document-templates/${firstId}`).flush({ success: true, data: MOCK_QUOTATION });
    httpMock.expectOne('/api/v1/document-templates').flush({ success: true, data: { ...MOCK_QUOTATION, id: 'cloned', name: 'Коммерческое предложение (копия)' } });
    await Promise.resolve(); // даём onClone продолжиться → loadTemplates()
    // onClone успех → loadTemplates() → GET /api/v1/document-templates
    httpMock.expectOne('/api/v1/document-templates').flush({ success: true, data: [MOCK_QUOTATION, MOCK_CONTRACT, { ...MOCK_QUOTATION, id: 'cloned', name: 'Коммерческое предложение (копия)' }] });
    await clonePromise;
    expect(notifySpy).toHaveBeenCalledWith('Шаблон склонирован');
    expect(c.templates().length).toBe(initialCount + 1);
    expect(c.templates().some(t => t.name.includes('(копия)'))).toBe(true);
  });

  it('onDelete вызывает ConfirmationService.confirm с правильными аргументами', async () => {
    const c = createComponent();
    const confirmSpy = vi.spyOn(confirmService, 'confirm');
    const loadPromise = c.loadTemplates(); mockLoadTemplates(); await loadPromise;
    const firstId = c.templates()[0].id;
    c.onDelete({ id: firstId, name: 'Тестовый шаблон' });
    expect(confirmSpy).toHaveBeenCalledOnce();
    const args = confirmSpy.mock.calls[0][0];
    expect(args.header).toBe('Удаление шаблона');
    expect(args.message).toContain('Тестовый шаблон');
    expect(args.acceptLabel).toBe('Удалить');
    expect(args.rejectLabel).toBe('Отмена');
  });

  it('onClone показывает ошибку для несуществующего id', async () => {
    const c = createComponent();
    const notifySpy = vi.spyOn(notification, 'error');
    const loadPromise = c.loadTemplates(); mockLoadTemplates(); await loadPromise;
    const initialCount = c.templates().length;
    const clonePromise = c.onClone({ id: 'nonexistent-id' });
    httpMock.expectOne('/api/v1/document-templates/nonexistent-id').flush({ success: false, data: undefined });
    await clonePromise;
    expect(notifySpy).toHaveBeenCalledWith('Шаблон не найден');
    expect(c.templates().length).toBe(initialCount);
  });

  it('onDelete accept callback удаляет шаблон и показывает уведомление', async () => {
    const c = createComponent();
    const notifySpy = vi.spyOn(notification, 'success');
    const confirmSpy = vi.spyOn(confirmService, 'confirm');
    const loadPromise = c.loadTemplates(); mockLoadTemplates(); await loadPromise;
    const initialCount = c.templates().length;
    const firstId = c.templates()[0].id;
    c.onDelete({ id: firstId, name: 'Тестовый шаблон' });
    const acceptCallback = confirmSpy.mock.calls[0][0].accept;
    expect(acceptCallback).toBeDefined();
    const acceptPromise = acceptCallback!();
    httpMock.expectOne(`/api/v1/document-templates/${firstId}`).flush({ success: true, data: null });
    await Promise.resolve(); // даём onDelete продолжиться → loadTemplates()
    // onDelete accept успех → loadTemplates() → GET /api/v1/document-templates
    httpMock.expectOne('/api/v1/document-templates').flush({ success: true, data: [MOCK_CONTRACT] });
    await acceptPromise;
    expect(notifySpy).toHaveBeenCalledWith('Шаблон удалён');
    expect(c.templates().length).toBe(initialCount - 1);
  });
});
