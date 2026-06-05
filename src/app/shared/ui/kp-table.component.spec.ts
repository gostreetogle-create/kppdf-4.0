import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { KpTableComponent } from './kp-table.component';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLucideIcons, LucideEye, LucidePencil, LucideCopy, LucideTrash2 } from '@lucide/angular';

describe('KpTableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpTableComponent],
      providers: [provideNoopAnimations(), provideLucideIcons(LucideEye, LucidePencil, LucideCopy, LucideTrash2)],
    }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('создаётся и рендерит p-table', () => {
    const f = TestBed.createComponent(KpTableComponent);
    f.detectChanges();
    expect(f.componentInstance).toBeTruthy();
    expect(f.debugElement.query(By.css('p-table'))).toBeTruthy();
  });

  it('значения по умолчанию', () => {
    const c = TestBed.createComponent(KpTableComponent).componentInstance;
    expect(c.rows()).toBe(20);
    expect(c.paginator()).toBe(true);
    expect(c.showActions()).toBe(true);
    expect(c.showClone()).toBe(false);
    expect(c.showView()).toBe(false);
    expect(c.emptyMessage()).toBe('Нет данных');
    expect(c.data()).toEqual([]);
    expect(c.columns()).toEqual([]);
    expect(c.searchFields()).toEqual([]);
    expect(c.sortField()).toBe('');
    expect(c.sortOrder()).toBe(1);
    expect(c.loading()).toBe(false);
  });

  it('rowEdit и rowDelete — output сигналы', () => {
    const c = TestBed.createComponent(KpTableComponent).componentInstance;
    const row = { name: 'Заказ 1', status: 'Активен' };
    let edited: unknown = null;
    let deleted: unknown = null;
    c.rowEdit.subscribe((r) => (edited = r));
    c.rowDelete.subscribe((r) => (deleted = r));
    c.rowEdit.emit(row);
    c.rowDelete.emit(row);
    expect(edited).toBe(row);
    expect(deleted).toBe(row);
  });

  it('rowClone — output сигнал', () => {
    const c = TestBed.createComponent(KpTableComponent).componentInstance;
    const row = { name: 'Шаблон 1' };
    let cloned: unknown = null;
    c.rowClone.subscribe((r) => (cloned = r));
    c.rowClone.emit(row);
    expect(cloned).toBe(row);
  });

  it('rowView — output сигнал', () => {
    const c = TestBed.createComponent(KpTableComponent).componentInstance;
    const row = { name: 'Запись' };
    let viewed: unknown = null;
    c.rowView.subscribe((r) => (viewed = r));
    c.rowView.emit(row);
    expect(viewed).toBe(row);
  });

  // === showView / showClone defaults ===

  it('showView по умолчанию false', () => {
    const c = TestBed.createComponent(KpTableComponent).componentInstance;
    expect(c.showView()).toBe(false);
  });

  it('showClone по умолчанию false', () => {
    const c = TestBed.createComponent(KpTableComponent).componentInstance;
    expect(c.showClone()).toBe(false);
  });

  it('showActions по умолчанию true', () => {
    const c = TestBed.createComponent(KpTableComponent).componentInstance;
    expect(c.showActions()).toBe(true);
  });

  // === Рендеринг с минимальными данными ===

  it('рендерит пустую таблицу без ошибок', () => {
    const f = TestBed.createComponent(KpTableComponent);
    f.detectChanges();
    expect(f.debugElement.query(By.css('p-table'))).toBeTruthy();
  });

  it('emptyMessage по умолчанию "Нет данных"', () => {
    const c = TestBed.createComponent(KpTableComponent).componentInstance;
    expect(c.emptyMessage()).toBe('Нет данных');
  });
});
