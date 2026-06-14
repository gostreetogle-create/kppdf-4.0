import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DocTypeListComponent } from './doc-type-list.component';
import { DocTypeService } from '../../core/doc-type.service';
import { NotificationService } from '../../core/notification.service';
import { API_URL } from '../../core/api-url.token';

const SEED_DOC_TYPES = [
  { id: 'dt-1', name: 'Коммерческое предложение', slug: 'quotation', description: 'КП', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'dt-2', name: 'Договор', slug: 'contract', description: 'Договор поставки', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'dt-3', name: 'Счёт', slug: 'invoice', description: 'Счёт на оплату', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'dt-4', name: 'Акт', slug: 'act', description: 'Акт выполненных работ', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

function flushConstructor(httpMock: HttpTestingController) {
  httpMock.expectOne('/api/v1/doc-types').flush({ success: true, data: SEED_DOC_TYPES });
}

describe('DocTypeListComponent', () => {
  let notification: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'references/doc-types', component: DocTypeListComponent }]),
        provideNoopAnimations(),
        provideHttpClient(), provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api/v1' },
        MessageService, ConfirmationService, NotificationService, DocTypeService,
      ],
    });
    await TestBed.compileComponents();
    notification = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { TestBed.resetTestingModule(); httpMock.verify(); });

  async function createComponent(): Promise<DocTypeListComponent> {
    let c!: DocTypeListComponent;
    TestBed.runInInjectionContext(() => { c = new DocTypeListComponent(); });
    flushConstructor(httpMock);
    await Promise.resolve();
    return c;
  }

  it('создаётся', async () => { expect(await createComponent()).toBeTruthy(); });

  it('значения по умолчанию', async () => {
    const c = await createComponent();
    expect(c.loading()).toBe(false);
    expect(c.saving()).toBe(false);
    expect(c.dialogVisible()).toBe(false);
    expect(c.editId()).toBeNull();
    expect(c.editName()).toBe('');
    expect(c.editSlug()).toBe('');
    expect(c.editDescription()).toBe('');
    expect(c.editIsActive()).toBe(true);
    expect(c.nameError()).toBe('');
    expect(c.breadcrumbs.length).toBe(2);
    expect(c.breadcrumbs[0].label).toBe('Справочники');
    expect(c.breadcrumbs[1].label).toBe('Типы документов');
    expect(c.tableColumns.length).toBe(4);
    expect(c.tableColumns[0].field).toBe('name');
  });

  it('openAddDialog открывает диалог и сбрасывает поля', async () => {
    const c = await createComponent();
    c.openAddDialog();
    expect(c.dialogVisible()).toBe(true);
    expect(c.editId()).toBeNull();
    expect(c.editName()).toBe('');
    expect(c.editSlug()).toBe('');
    expect(c.editDescription()).toBe('');
    expect(c.editIsActive()).toBe(true);
    expect(c.nameError()).toBe('');
  });

  it('save показывает ошибку если название пустое', async () => {
    const c = await createComponent();
    c.openAddDialog(); c.editName.set('');
    await c.save();
    expect(c.nameError()).toBe('Название обязательно');
    expect(c.dialogVisible()).toBe(true);
  });

  it('save создаёт тип документа', async () => {
    const c = await createComponent();
    const notifySpy = vi.spyOn(notification, 'success');
    c.openAddDialog();
    c.editName.set('Акт выполненных работ'); c.editSlug.set('act');

    // save() создаёт POST синхронно при вызове
    const savePromise = c.save();

    const req = httpMock.expectOne('/api/v1/doc-types');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: { id: 'dt-new', name: 'Акт выполненных работ', slug: 'act', description: '', isActive: true, createdAt: '', updatedAt: '' } });

    // flush() ставит микрозадачу на возобновление save() → load() → GET.
    await Promise.resolve();

    // После успешного POST save() вызывает load() → GET запрос
    httpMock.expectOne('/api/v1/doc-types').flush({ success: true, data: [...SEED_DOC_TYPES, { id: 'dt-new', name: 'Акт выполненных работ', slug: 'act', description: '', isActive: true, createdAt: '', updatedAt: '' }] });

    await savePromise;
    expect(notifySpy).toHaveBeenCalledWith('Тип документа создан');
    expect(c.dialogVisible()).toBe(false);
  });

  it('save обновляет существующий тип документа', async () => {
    const c = await createComponent();
    const notifySpy = vi.spyOn(notification, 'success');
    const seedDoc = c.rows()[0];
    c.onEditRow(seedDoc);
    c.editName.set('Коммерческое предложение (обновлено)');

    // save() создаёт PUT синхронно при вызове
    const savePromise = c.save();

    const req = httpMock.expectOne(`/api/v1/doc-types/${seedDoc.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true, data: { ...seedDoc, name: 'Коммерческое предложение (обновлено)' } });

    // flush() ставит микрозадачу на возобновление save() → load() → GET.
    await Promise.resolve();

    // После успешного PUT save() вызывает load() → GET запрос
    httpMock.expectOne('/api/v1/doc-types').flush({ success: true, data: SEED_DOC_TYPES });

    await savePromise;
    expect(notifySpy).toHaveBeenCalledWith('Тип документа обновлён');
    expect(c.dialogVisible()).toBe(false);
  });

  it('onEditRow заполняет поля диалога', async () => {
    const c = await createComponent();
    const seedDoc = c.rows()[0];
    c.onEditRow(seedDoc);
    expect(c.dialogVisible()).toBe(true);
    expect(c.editId()).toBe(seedDoc.id);
    expect(c.editName()).toBe(seedDoc.name);
    expect(c.editSlug()).toBe(seedDoc.slug);
  });

  it('load загружает seed-типы документов', async () => {
    const c = await createComponent();
    expect(c.rows().length).toBe(4);
    expect(c.rows()[0].name).toBe('Коммерческое предложение');
    expect(c.rows()[0].statusLabel).toBe('Активен');
  });
});
