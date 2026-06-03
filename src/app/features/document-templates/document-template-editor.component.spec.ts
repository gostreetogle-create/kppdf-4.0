import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DocumentTemplateEditorComponent } from './document-template-editor.component';
import { DocumentTemplateService } from '../../core/document-template.service';
import { NotificationService } from '../../core/notification.service';

describe('DocumentTemplateEditorComponent', () => {
  let notification: NotificationService;


  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'admin/document-templates', children: [{ path: ':id/edit', component: DocumentTemplateEditorComponent }] }]),
        provideNoopAnimations(),
        MessageService,
        ConfirmationService,
        NotificationService,
        DocumentTemplateService,
      ],
    });
    await TestBed.compileComponents();
    notification = TestBed.inject(NotificationService);
  });

  afterEach(() => TestBed.resetTestingModule());

  /** Создаём компонент через injection context — обходим templateUrl в Vitest */
  function createComponent(): DocumentTemplateEditorComponent {
    let component!: DocumentTemplateEditorComponent;
    TestBed.runInInjectionContext(() => {
      component = new DocumentTemplateEditorComponent();
    });
    return component;
  }

  it('создаётся', () => {
    expect(createComponent()).toBeTruthy();
  });

  it('значения по умолчанию', () => {
    const c = createComponent();
    expect(c.isNew()).toBe(true);
    expect(c.templateId()).toBeNull();
    expect(c.templateName()).toBe('');
    expect(c.nameError()).toBe('');
    expect(c.description()).toBe('');
    expect(c.docType()).toBe('quotation');
    expect(c.blocks()).toEqual([]);
    expect(c.selectedBlockId()).toBe('');
    expect(c.loading()).toBe(false);
    expect(c.saving()).toBe(false);
    expect(c.docTypeOptions.length).toBe(4);
    expect(c.breadcrumbs.length).toBe(3);
  });

  it('addBlock добавляет текстовый блок', () => {
    const c = createComponent();
    c.addBlock('text');
    expect(c.blocks().length).toBe(1);
    expect(c.blocks()[0].type).toBe('text');
    expect(c.blocks()[0].title).toBe('');
    expect(c.blocks()[0].content).toBe('');
    expect(c.selectedBlockId()).toBe(c.blocks()[0].id);
  });

  it('addBlock добавляет разделитель', () => {
    const c = createComponent();
    c.addBlock('separator');
    expect(c.blocks().length).toBe(1);
    expect(c.blocks()[0].type).toBe('separator');
    expect(c.blocks()[0].height).toBe(20);
    expect(c.blocks()[0].showLine).toBe(false);
  });

  it('addBlock добавляет таблицу', () => {
    const c = createComponent();
    c.addBlock('table');
    expect(c.blocks().length).toBe(1);
    expect(c.blocks()[0].type).toBe('table');
  });

  it('addBlock присваивает правильный order', () => {
    const c = createComponent();
    c.addBlock('text');
    c.addBlock('separator');
    c.addBlock('text');
    expect(c.blocks()[0].order).toBe(0);
    expect(c.blocks()[1].order).toBe(1);
    expect(c.blocks()[2].order).toBe(2);
  });

  it('removeBlock удаляет блок по id', () => {
    const c = createComponent();
    c.addBlock('text');
    c.addBlock('separator');
    const firstId = c.blocks()[0].id;
    c.removeBlock(firstId);
    expect(c.blocks().length).toBe(1);
    expect(c.blocks()[0].type).toBe('separator');
  });

  it('removeBlock сбрасывает selectedBlockId если удалён выбранный', () => {
    const c = createComponent();
    c.addBlock('text');
    const id = c.blocks()[0].id;
    expect(c.selectedBlockId()).toBe(id);
    c.removeBlock(id);
    expect(c.selectedBlockId()).toBe('');
  });

  it('moveBlockUp перемещает блок вверх', () => {
    const c = createComponent();
    c.addBlock('text');
    c.addBlock('separator');
    const first = c.blocks()[0];
    const second = c.blocks()[1];
    c.moveBlockUp(1);
    expect(c.blocks()[0]).toEqual(second);
    expect(c.blocks()[1]).toEqual(first);
  });

  it('moveBlockUp не делает ничего для index=0', () => {
    const c = createComponent();
    c.addBlock('text');
    c.addBlock('separator');
    const snapshot = [...c.blocks()];
    c.moveBlockUp(0);
    expect(c.blocks()).toEqual(snapshot);
  });

  it('moveBlockDown перемещает блок вниз', () => {
    const c = createComponent();
    c.addBlock('text');
    c.addBlock('separator');
    const first = c.blocks()[0];
    const second = c.blocks()[1];
    c.moveBlockDown(0);
    expect(c.blocks()[0]).toEqual(second);
    expect(c.blocks()[1]).toEqual(first);
  });

  it('moveBlockDown не делает ничего для последнего', () => {
    const c = createComponent();
    c.addBlock('text');
    c.addBlock('separator');
    const snapshot = [...c.blocks()];
    c.moveBlockDown(1);
    expect(c.blocks()).toEqual(snapshot);
  });

  it('validate возвращает false если имя пустое', () => {
    const c = createComponent();
    c.addBlock('text');
    expect(c.validate()).toBe(false);
    expect(c.nameError()).toBe('Название обязательно');
  });

  it('validate возвращает false если нет блоков', () => {
    const c = createComponent();
    c.templateName.set('Тест');
    const notifySpy = vi.spyOn(notification, 'error');
    expect(c.validate()).toBe(false);
    expect(notifySpy).toHaveBeenCalledWith('Добавьте хотя бы один блок');
  });

  it('validate возвращает true если имя и блоки есть', () => {
    const c = createComponent();
    c.templateName.set('Тест');
    c.addBlock('text');
    expect(c.validate()).toBe(true);
    expect(c.nameError()).toBe('');
  });

  it('onTextBlockSave обновляет блок в списке', () => {
    const c = createComponent();
    c.addBlock('text');
    const original = c.blocks()[0];
    const updated = { ...original, title: 'Новый', content: 'Обновлено' };
    c.onTextBlockSave(updated);
    expect(c.blocks()[0].title).toBe('Новый');
    expect(c.blocks()[0].content).toBe('Обновлено');
  });

  it('onTextBlockSave не трогает другие блоки', () => {
    const c = createComponent();
    c.addBlock('text');
    c.addBlock('separator');
    const first = c.blocks()[0];
    const second = { ...c.blocks()[1], height: 50 };
    c.onTextBlockSave(second);
    expect(c.blocks()[0]).toEqual(first);
    expect(c.blocks()[1].height).toBe(50);
  });
});
