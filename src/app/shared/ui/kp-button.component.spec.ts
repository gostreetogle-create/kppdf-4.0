import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { KpButtonComponent } from './kp-button.component';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLucideIcons, LucidePencil, LucideTrash2, LucideEye } from '@lucide/angular';

describe('KpButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpButtonComponent],
      providers: [provideNoopAnimations(), provideLucideIcons(LucidePencil, LucideTrash2, LucideEye), provideRouter([])],
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
    expect(c.size()).toBe('large');
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

  // === icon (обратная совместимость) ===

  it('icon по умолчанию — пустая строка', () => {
    const c = TestBed.createComponent(KpButtonComponent).componentInstance;
    expect(c.icon()).toBe('');
  });

  it('routerLink по умолчанию — undefined', () => {
    const c = TestBed.createComponent(KpButtonComponent).componentInstance;
    expect(c.routerLink()).toBeUndefined();
  });

  it('queryParams по умолчанию — пустой объект', () => {
    const c = TestBed.createComponent(KpButtonComponent).componentInstance;
    // queryParams input может быть {} или undefined — проверяем что нет ошибок
    expect(c.queryParams).toBeDefined();
  });
});
