import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DocTypeListComponent } from './doc-type-list.component';
import { DocTypeService } from '../../core/doc-type.service';
import { NotificationService } from '../../core/notification.service';

describe('DocTypeListComponent', () => {
  let notification: NotificationService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'references/doc-types', component: DocTypeListComponent }]),
        provideNoopAnimations(),
        MessageService,
        ConfirmationService,
        NotificationService,
        DocTypeService,
      ],
    });
    await TestBed.compileComponents();
    notification = TestBed.inject(NotificationService);
  });

  afterEach(() => TestBed.resetTestingModule());

  function createComponent(): DocTypeListComponent {
    let component!: DocTypeListComponent;
    TestBed.runInInjectionContext(() => {
      component = new DocTypeListComponent();
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

  // ─────── Диалог добавления ───────

  it('openAddDialog открывает диалог и сбрасывает поля', () => {
    const c = createComponent();
    c.openAddDialog();
    expect(c.dialogVisible()).toBe(true);
    expect(c.editId()).toBeNull();
    expect(c.editName()).toBe('');
    expect(c.editSlug()).toBe('');
    expect(c.editDescription()).toBe('');
    expect(c.editIsActive()).toBe(true);
    expect(c.nameError()).toBe('');
  });

  // ─────── Валидация при сохранении ───────

  it('save показывает ошибку если название пустое', async () => {
    const c = createComponent();
    c.openAddDialog();
    c.editName.set('');
    await c.save();
    expect(c.nameError()).toBe('Название обязательно');
    expect(c.dialogVisible()).toBe(true); // диалог не закрылся
  });

  it('save создаёт тип документа', async () => {
    const c = createComponent();
    const notifySpy = vi.spyOn(notification, 'success');
    c.openAddDialog();
    c.editName.set('Акт выполненных работ');
    c.editSlug.set('act');
    await c.save();
    expect(notifySpy).toHaveBeenCalledWith('Тип документа создан');
    expect(c.dialogVisible()).toBe(false);
  });

  it('save обновляет существующий тип документа', async () => {
    const c = createComponent();
    const notifySpy = vi.spyOn(notification, 'success');
    // Загружаем seed-тип
    await c.load();
    const seedDoc = c.rows()[0]; // КП
    c.onEditRow(seedDoc);
    c.editName.set('Коммерческое предложение (обновлено)');
    await c.save();
    expect(notifySpy).toHaveBeenCalledWith('Тип документа обновлён');
    expect(c.dialogVisible()).toBe(false);
  });

  // ─────── Редактирование строки ───────

  it('onEditRow заполняет поля диалога', async () => {
    const c = createComponent();
    await c.load();
    const seedDoc = c.rows()[0];
    c.onEditRow(seedDoc);
    expect(c.dialogVisible()).toBe(true);
    expect(c.editId()).toBe(seedDoc.id);
    expect(c.editName()).toBe(seedDoc.name);
    expect(c.editSlug()).toBe(seedDoc.slug);
  });

  // ─────── Загрузка данных ───────

  it('load загружает seed-типы документов', async () => {
    const c = createComponent();
    await c.load();
    expect(c.rows().length).toBe(4); // 4 seed-типа
    expect(c.rows()[0].name).toBe('Коммерческое предложение');
    expect(c.rows()[0].statusLabel).toBe('Активен');
  });
});
