import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ClientListComponent } from './client-list.component';
import { ClientService } from '../../core/client.service';
import { OrganizationService } from '../../core/organization.service';
import { NotificationService } from '../../core/notification.service';
import { API_URL } from '../../core/api-url.token';

const SEED_CLIENTS = [
  { id: 'cli-1', lastName: 'Иванов', firstName: 'Иван', patronymic: 'Иванович', phone: '+7 (918) 555-01-01', isActive: true, personalMarkupPercent: 0, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cli-2', lastName: 'Петров', firstName: 'Пётр', patronymic: 'Петрович', phone: '+7 (918) 555-02-02', isActive: true, personalMarkupPercent: 0, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cli-3', lastName: 'Сидорова', firstName: 'Анна', patronymic: '', phone: '+7 (918) 555-03-03', isActive: true, personalMarkupPercent: 5, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cli-4', lastName: 'Кузнецов', firstName: 'Дмитрий', patronymic: '', phone: '+7 (918) 555-04-04', isActive: true, personalMarkupPercent: 0, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cli-5', lastName: 'Смирнова', firstName: 'Ольга', patronymic: '', phone: '+7 (918) 555-05-05', isActive: false, personalMarkupPercent: 0, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

/** flush конструкторных HTTP-запросов: constructor() → load() → clients + organizations */
function flushConstructor(httpMock: HttpTestingController) {
  httpMock.expectOne('/api/v1/clients').flush({ success: true, data: SEED_CLIENTS });
  httpMock.expectOne('/api/v1/organizations').flush({ success: true, data: [] });
}

describe('ClientListComponent', () => {
  let notification: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'references/clients', component: ClientListComponent }]),
        provideNoopAnimations(),
        provideHttpClient(), provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api/v1' },
        MessageService, ConfirmationService, NotificationService, ClientService, OrganizationService,
      ],
    });
    await TestBed.compileComponents();
    notification = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { TestBed.resetTestingModule(); httpMock.verify(); });

  async function createComponent(): Promise<ClientListComponent> {
    let c!: ClientListComponent;
    TestBed.runInInjectionContext(() => { c = new ClientListComponent(); });
    flushConstructor(httpMock);
    await Promise.resolve(); // даём async load() завершиться
    return c;
  }

  it('создаётся', async () => { expect(await createComponent()).toBeTruthy(); });

  it('значения по умолчанию', async () => {
    const c = await createComponent();
    // constructor уже загрузил данные
    expect(c.loading()).toBe(false);
    expect(c.saving()).toBe(false);
    expect(c.dialogVisible()).toBe(false);
    expect(c.editId()).toBeNull();
    expect(c.breadcrumbs.length).toBe(2);
    expect(c.tableColumns.length).toBe(5);
  });

  it('openAddDialog открывает диалог и сбрасывает поля', async () => {
    const c = await createComponent();
    c.openAddDialog();
    expect(c.dialogVisible()).toBe(true);
    expect(c.editId()).toBeNull();
    expect(c.editLastName()).toBe('');
    expect(c.editFirstName()).toBe('');
    expect(c.editPhone()).toBe('');
    expect(c.lastNameError()).toBe('');
    expect(c.firstNameError()).toBe('');
    expect(c.phoneError()).toBe('');
  });

  it('save показывает ошибку если фамилия пустая', async () => {
    const c = await createComponent();
    c.openAddDialog();
    c.editLastName.set(''); c.editFirstName.set('Иван'); c.editPhone.set('+7 (918) 555-01-01');
    await c.save();
    expect(c.lastNameError()).toBe('Фамилия обязательна');
    expect(c.dialogVisible()).toBe(true);
  });

  it('save показывает ошибку если имя пустое', async () => {
    const c = await createComponent();
    c.openAddDialog();
    c.editLastName.set('Иванов'); c.editFirstName.set(''); c.editPhone.set('+7 (918) 555-01-01');
    await c.save();
    expect(c.firstNameError()).toBe('Имя обязательно');
  });

  it('save показывает ошибку если телефон пустой', async () => {
    const c = await createComponent();
    c.openAddDialog();
    c.editLastName.set('Иванов'); c.editFirstName.set('Иван'); c.editPhone.set('');
    await c.save();
    expect(c.phoneError()).toBe('Телефон обязателен');
  });

  it.skip('save создаёт клиента', async () => {
    const c = await createComponent();
    const notifySpy = vi.spyOn(notification, 'success');
    c.openAddDialog();
    c.editLastName.set('Новиков'); c.editFirstName.set('Сергей'); c.editPhone.set('+7 (918) 555-99-99');

    // save() — асинхронный, запускаем без await
    const savePromise = c.save();
    // Даём макрозадачу чтобы async save() дошёл до HTTP-запроса
    await new Promise(r => setTimeout(r, 0));

    // Перехватываем POST запрос
    const req = httpMock.expectOne('/api/v1/clients');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: { id: 'cli-new', lastName: 'Новиков', firstName: 'Сергей', patronymic: '', phone: '+7 (918) 555-99-99', isActive: true, personalMarkupPercent: 0, createdAt: '', updatedAt: '' } });

    // save() вызывает load() после POST → ждём GET запросы
    const getClientsReq = httpMock.expectOne('/api/v1/clients');
    getClientsReq.flush({ success: true, data: [...SEED_CLIENTS, { id: 'cli-new', lastName: 'Новиков', firstName: 'Сергей', patronymic: '', phone: '+7 (918) 555-99-99', isActive: true, personalMarkupPercent: 0, createdAt: '', updatedAt: '' }] });
    const getOrgsReq = httpMock.expectOne('/api/v1/organizations');
    getOrgsReq.flush({ success: true, data: [] });

    await savePromise;
    expect(notifySpy).toHaveBeenCalledWith('Клиент создан');
    expect(c.dialogVisible()).toBe(false);
  });

  it('onEditRow заполняет поля диалога', async () => {
    const c = await createComponent();
    const seedClient = c.rows()[0];
    c.onEditRow(seedClient);
    expect(c.dialogVisible()).toBe(true);
    expect(c.editId()).toBe(seedClient.id);
    expect(c.editLastName()).toBe(seedClient.lastName);
    expect(c.editFirstName()).toBe(seedClient.firstName);
    expect(c.editPhone()).toBe(seedClient.phone);
  });

  it('load загружает seed-клиентов', async () => {
    const c = await createComponent();
    // constructor уже вызвал load() → данные загружены через flushConstructor
    expect(c.rows().length).toBe(5);
    expect(c.rows()[0].lastName).toBe('Иванов');
    expect(c.rows()[0].firstName).toBe('Иван');
    expect(c.rows()[0].fullName).toBe('Иванов Иван Иванович');
    expect(c.rows()[0].statusLabel).toBe('Активен');
  });
});
