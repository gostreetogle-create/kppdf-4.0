import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ClientListComponent } from './client-list.component';
import { ClientService } from '../../core/client.service';
import { OrganizationService } from '../../core/organization.service';
import { NotificationService } from '../../core/notification.service';

describe('ClientListComponent', () => {
  let notification: NotificationService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'references/clients', component: ClientListComponent }]),
        provideNoopAnimations(),
        MessageService,
        ConfirmationService,
        NotificationService,
        ClientService,
        OrganizationService,
      ],
    });
    await TestBed.compileComponents();
    notification = TestBed.inject(NotificationService);
  });

  afterEach(() => TestBed.resetTestingModule());

  function createComponent(): ClientListComponent {
    let component!: ClientListComponent;
    TestBed.runInInjectionContext(() => {
      component = new ClientListComponent();
    });
    return component;
  }

  // ─────── Создание и значения по умолчанию ───────

  it('создаётся', () => {
    expect(createComponent()).toBeTruthy();
  });

  it('значения по умолчанию', async () => {
    const c = createComponent();
    await c.load(); // ждём асинхронную загрузку
    expect(c.loading()).toBe(false);
    expect(c.saving()).toBe(false);
    expect(c.dialogVisible()).toBe(false);
    expect(c.editId()).toBeNull();
    expect(c.editLastName()).toBe('');
    expect(c.editFirstName()).toBe('');
    expect(c.editPatronymic()).toBe('');
    expect(c.editPhone()).toBe('');
    expect(c.editIsActive()).toBe(true);
    expect(c.lastNameError()).toBe('');
    expect(c.firstNameError()).toBe('');
    expect(c.phoneError()).toBe('');
    expect(c.breadcrumbs.length).toBe(2);
    expect(c.tableColumns.length).toBe(5);
  });

  // ─────── Диалог добавления ───────

  it('openAddDialog открывает диалог и сбрасывает поля', () => {
    const c = createComponent();
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

  // ─────── Валидация при сохранении ───────

  it('save показывает ошибку если фамилия пустая', async () => {
    const c = createComponent();
    c.openAddDialog();
    c.editLastName.set('');
    c.editFirstName.set('Иван');
    c.editPhone.set('+7 (918) 555-01-01');
    await c.save();
    expect(c.lastNameError()).toBe('Фамилия обязательна');
    expect(c.dialogVisible()).toBe(true);
  });

  it('save показывает ошибку если имя пустое', async () => {
    const c = createComponent();
    c.openAddDialog();
    c.editLastName.set('Иванов');
    c.editFirstName.set('');
    c.editPhone.set('+7 (918) 555-01-01');
    await c.save();
    expect(c.firstNameError()).toBe('Имя обязательно');
  });

  it('save показывает ошибку если телефон пустой', async () => {
    const c = createComponent();
    c.openAddDialog();
    c.editLastName.set('Иванов');
    c.editFirstName.set('Иван');
    c.editPhone.set('');
    await c.save();
    expect(c.phoneError()).toBe('Телефон обязателен');
  });

  it('save создаёт клиента', async () => {
    const c = createComponent();
    const notifySpy = vi.spyOn(notification, 'success');
    c.openAddDialog();
    c.editLastName.set('Новиков');
    c.editFirstName.set('Сергей');
    c.editPhone.set('+7 (918) 555-99-99');
    await c.save();
    expect(notifySpy).toHaveBeenCalledWith('Клиент создан');
    expect(c.dialogVisible()).toBe(false);
  });

  // ─────── Редактирование строки ───────

  it('onEditRow заполняет поля диалога', async () => {
    const c = createComponent();
    await c.load();
    const seedClient = c.rows()[0];
    c.onEditRow(seedClient);
    expect(c.dialogVisible()).toBe(true);
    expect(c.editId()).toBe(seedClient.id);
    expect(c.editLastName()).toBe(seedClient.lastName);
    expect(c.editFirstName()).toBe(seedClient.firstName);
    expect(c.editPhone()).toBe(seedClient.phone);
  });

  // ─────── Загрузка данных ───────

  it('load загружает seed-клиентов', async () => {
    const c = createComponent();
    await c.load();
    expect(c.rows().length).toBe(5); // 5 seed-клиентов
    expect(c.rows()[0].lastName).toBe('Иванов');
    expect(c.rows()[0].firstName).toBe('Иван');
    expect(c.rows()[0].fullName).toBe('Иванов Иван Иванович');
    expect(c.rows()[0].statusLabel).toBe('Активен');
  });
});
