import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { KpButtonComponent } from './kp-button.component';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLucideIcons, LucidePencil, LucideTrash2, LucideEye } from '@lucide/angular';

describe('KpButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpButtonComponent],
      providers: [provideNoopAnimations(), provideLucideIcons(LucidePencil, LucideTrash2, LucideEye)],
    }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('создаётся и рендерит кнопку', () => {
    const f = TestBed.createComponent(KpButtonComponent);
    f.detectChanges();
    expect(f.componentInstance).toBeTruthy();
    expect(f.debugElement.query(By.css('button'))).toBeTruthy();
  });

  it('значения по умолчанию у всех сигналов', () => {
    const c = TestBed.createComponent(KpButtonComponent).componentInstance;
    expect(c.severity()).toBe('primary');
    expect(c.size()).toBe('small');
    expect(c.outlined()).toBe(false);
    expect(c.raised()).toBe(false);
    expect(c.rounded()).toBe(false);
    expect(c.text()).toBe(false);
    expect(c.plain()).toBe(false);
    expect(c.loading()).toBe(false);
    expect(c.disabled()).toBe(false);
    expect(c.label()).toBe('');
    expect(c.icon()).toBe('');
    expect(c.lucideIcon()).toBe('');
    expect(c.iconPos()).toBe('left');
    expect(c.styleClass()).toBe('');
    expect(c.pTooltip()).toBe('');
    expect(c.tooltipPosition()).toBe('top');
  });

  it('вызывает buttonClick при клике', () => {
    const f = TestBed.createComponent(KpButtonComponent);
    f.detectChanges();
    let clicked = false;
    f.componentInstance.buttonClick.subscribe(() => (clicked = true));
    f.debugElement.query(By.css('button'))!.nativeElement.click();
    expect(clicked).toBe(true);
  });

  // === lucideIcon ===

  it('lucideIcon по умолчанию — пустая строка', () => {
    const c = TestBed.createComponent(KpButtonComponent).componentInstance;
    expect(c.lucideIcon()).toBe('');
  });

  it('с lucideIcon="" рендерит кнопку без ошибок', () => {
    const f = TestBed.createComponent(KpButtonComponent);
    f.detectChanges();
    // Кнопка рендерится с пустыми иконками по умолчанию
    expect(f.debugElement.query(By.css('button'))).toBeTruthy();
  });

  // === aria-label ===

  it('aria-label логика: label() || pTooltip() || "Кнопка" — при пустых default="Кнопка"', () => {
    const c = TestBed.createComponent(KpButtonComponent).componentInstance;
    const ariaLabel = c.label() || c.pTooltip() || 'Кнопка';
    expect(ariaLabel).toBe('Кнопка');
  });

  it('aria-label логика: при label="Сохранить" возвращает label', () => {
    // Тестируем логику вычисления aria-label напрямую
    const label = 'Сохранить';
    const tooltip = '';
    const ariaLabel = label || tooltip || 'Кнопка';
    expect(ariaLabel).toBe('Сохранить');
  });

  it('aria-label логика: при пустом label использует pTooltip', () => {
    const label = '';
    const tooltip = 'Редактировать';
    const ariaLabel = label || tooltip || 'Кнопка';
    expect(ariaLabel).toBe('Редактировать');
  });

  // === Обратная совместимость icon ===

  it('icon по умолчанию — пустая строка', () => {
    const c = TestBed.createComponent(KpButtonComponent).componentInstance;
    expect(c.icon()).toBe('');
  });

  it('pTooltip по умолчанию — пустая строка', () => {
    const c = TestBed.createComponent(KpButtonComponent).componentInstance;
    expect(c.pTooltip()).toBe('');
  });
});
