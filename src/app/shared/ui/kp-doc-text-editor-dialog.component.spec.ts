import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { KpDocTextEditorDialogComponent } from './kp-doc-text-editor-dialog.component';
import type { DocBlock } from '../../../../shared/types/index.js';

const TEXT_BLOCK: DocBlock = {
  id: 't1', type: 'text', order: 0, title: 'Заголовок', content: 'Простой текст',
};

const COLUMNS_BLOCK: DocBlock = {
  id: 't2', type: 'text', order: 0,
  columns: [
    { id: 'c1', content: 'Левая', width: '50%', textAlign: 'left', fontWeight: 'bold' },
    { id: 'c2', content: 'Правая', width: '50%', textAlign: 'right' },
  ],
};

describe('KpDocTextEditorDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpDocTextEditorDialogComponent],
      providers: [provideNoopAnimations(), provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('создаётся', () => {
    expect(TestBed.createComponent(KpDocTextEditorDialogComponent).componentInstance).toBeTruthy();
  });

  it('значения по умолчанию', () => {
    const c = TestBed.createComponent(KpDocTextEditorDialogComponent).componentInstance;
    expect(c.visible()).toBe(false);
    expect(c.block()).toBeNull();
    expect(c.columnCount()).toBe(1);
    expect(c.columns()).toEqual([]);
  });

  it('open() загружает блок с content (1 колонка)', () => {
    const c = TestBed.createComponent(KpDocTextEditorDialogComponent).componentInstance;
    c.open(TEXT_BLOCK);
    expect(c.visible()).toBe(true);
    expect(c.block()).toEqual(TEXT_BLOCK);
    expect(c.title).toBe('Заголовок');
    expect(c.columns().length).toBe(1);
    expect(c.columns()[0].content).toBe('Простой текст');
    expect(c.columnCount()).toBe(1);
  });

  it('open() загружает блок с columns (2 колонки)', () => {
    const c = TestBed.createComponent(KpDocTextEditorDialogComponent).componentInstance;
    c.open(COLUMNS_BLOCK);
    expect(c.visible()).toBe(true);
    expect(c.columns().length).toBe(2);
    expect(c.columns()[0].content).toBe('Левая');
    expect(c.columns()[1].content).toBe('Правая');
    expect(c.columnCount()).toBe(2);
  });

  it('onColumnCountChange увеличивает колонки', () => {
    const c = TestBed.createComponent(KpDocTextEditorDialogComponent).componentInstance;
    c.open(TEXT_BLOCK);
    c.onColumnCountChange(3);
    expect(c.columnCount()).toBe(3);
    expect(c.columns().length).toBe(3);
  });

  it('onColumnCountChange уменьшает колонки', () => {
    const c = TestBed.createComponent(KpDocTextEditorDialogComponent).componentInstance;
    c.open(COLUMNS_BLOCK);
    c.onColumnCountChange(1);
    expect(c.columnCount()).toBe(1);
    expect(c.columns().length).toBe(1);
    // Первая колонка сохраняется
    expect(c.columns()[0].content).toBe('Левая');
  });

  it('updateColumn обновляет поле колонки', () => {
    const c = TestBed.createComponent(KpDocTextEditorDialogComponent).componentInstance;
    c.open(TEXT_BLOCK);
    c.updateColumn(0, 'content', 'Новый текст');
    expect(c.columns()[0].content).toBe('Новый текст');
  });

  it('updateColumn обновляет textAlign', () => {
    const c = TestBed.createComponent(KpDocTextEditorDialogComponent).componentInstance;
    c.open(TEXT_BLOCK);
    c.updateColumn(0, 'textAlign', 'center');
    expect(c.columns()[0].textAlign).toBe('center');
  });

  it('save() emit saved с 1 колонкой → content', () => {
    const c = TestBed.createComponent(KpDocTextEditorDialogComponent).componentInstance;
    c.open(TEXT_BLOCK);
    c.title = 'Новый заголовок';
    c.updateColumn(0, 'content', 'Обновлённый текст');

    let emitted: DocBlock | undefined;
    c.saved.subscribe((b: DocBlock) => (emitted = b));
    c.save();

    expect(emitted).toBeDefined();
    expect(emitted!.title).toBe('Новый заголовок');
    expect(emitted!.content).toBe('Обновлённый текст');
    expect(emitted!.columns).toBeUndefined();
    expect(c.visible()).toBe(false);
  });

  it('save() emit saved с несколькими колонками → columns', () => {
    const c = TestBed.createComponent(KpDocTextEditorDialogComponent).componentInstance;
    c.open(COLUMNS_BLOCK);

    let emitted: DocBlock | undefined;
    c.saved.subscribe((b: DocBlock) => (emitted = b));
    c.save();

    expect(emitted).toBeDefined();
    expect(emitted!.columns).toBeDefined();
    expect(emitted!.columns!.length).toBe(2);
    expect(emitted!.content).toBeUndefined();
  });

  it('save() не делает ничего если block=null', () => {
    const c = TestBed.createComponent(KpDocTextEditorDialogComponent).componentInstance;
    let emitted = false;
    c.saved.subscribe(() => (emitted = true));
    c.save();
    expect(emitted).toBe(false);
  });

  it('save() с пустым title → title=undefined', () => {
    const c = TestBed.createComponent(KpDocTextEditorDialogComponent).componentInstance;
    c.open(TEXT_BLOCK);
    c.title = '';

    let emitted: DocBlock | undefined;
    c.saved.subscribe((b: DocBlock) => (emitted = b));
    c.save();

    expect(emitted!.title).toBeUndefined();
  });
});
