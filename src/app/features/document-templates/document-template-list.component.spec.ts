import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DocumentTemplateListComponent } from './document-template-list.component';
import { DocumentTemplateService } from '../../core/document-template.service';
import { NotificationService } from '../../core/notification.service';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('DocumentTemplateListComponent', () => {
  let service: DocumentTemplateService;
  let notification: NotificationService;
  let confirmService: ConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        MessageService,
        ConfirmationService,
        NotificationService,
        DocumentTemplateService,
      ],
    });

    service = TestBed.inject(DocumentTemplateService);
    notification = TestBed.inject(NotificationService);
    confirmService = TestBed.inject(ConfirmationService);
  });

  afterEach(() => TestBed.resetTestingModule());

  /** Создаём компонент через injection context — обходим templateUrl в Vitest */
  function createComponent(): DocumentTemplateListComponent {
    let component!: DocumentTemplateListComponent;
    TestBed.runInInjectionContext(() => {
      component = new DocumentTemplateListComponent();
    });
    return component;
  }

  it('создаётся', () => {
    expect(createComponent()).toBeTruthy();
  });

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
    await c.loadTemplates();

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

    await c.loadTemplates();
    const initialCount = c.templates().length;
    const firstId = c.templates()[0].id;

    await c.onClone({ id: firstId });

    expect(notifySpy).toHaveBeenCalledWith('Шаблон склонирован');
    expect(c.templates().length).toBe(initialCount + 1);
    expect(c.templates().some(t => t.name.includes('(копия)'))).toBe(true);
  });

  it('onDelete вызывает ConfirmationService.confirm с правильными аргументами', async () => {
    const c = createComponent();
    const confirmSpy = vi.spyOn(confirmService, 'confirm');

    await c.loadTemplates();
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
    await c.loadTemplates();
    const initialCount = c.templates().length;
    await c.onClone({ id: 'nonexistent-id' });
    expect(notifySpy).toHaveBeenCalledWith('Шаблон не найден');
    expect(c.templates().length).toBe(initialCount);
  });

  it('onDelete accept callback удаляет шаблон и показывает уведомление', async () => {
    const c = createComponent();
    const notifySpy = vi.spyOn(notification, 'success');
    const confirmSpy = vi.spyOn(confirmService, 'confirm');

    await c.loadTemplates();
    const initialCount = c.templates().length;
    const firstId = c.templates()[0].id;

    c.onDelete({ id: firstId, name: 'Тестовый шаблон' });

    // Извлекаем accept callback из вызова confirm
    const acceptCallback = confirmSpy.mock.calls[0][0].accept;
    expect(acceptCallback).toBeDefined();

    // Вызываем accept — это должно удалить шаблон
    await acceptCallback!();

    expect(notifySpy).toHaveBeenCalledWith('Шаблон удалён');
    expect(c.templates().length).toBe(initialCount - 1);
  });
});
