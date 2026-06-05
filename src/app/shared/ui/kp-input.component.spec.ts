import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { KpInputComponent } from './kp-input.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLucideIcons, LucideX, LucideEye, LucideEyeOff } from '@lucide/angular';

describe('KpInputComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpInputComponent, FormsModule],
      providers: [provideNoopAnimations(), provideLucideIcons(LucideX, LucideEye, LucideEyeOff)],
    }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('создаётся и рендерит поле ввода', () => {
    const f = TestBed.createComponent(KpInputComponent);
    f.detectChanges();
    expect(f.componentInstance).toBeTruthy();
    expect(f.debugElement.query(By.css('.kp-input-field'))).toBeTruthy();
  });

  it('значения по умолчанию', () => {
    const c = TestBed.createComponent(KpInputComponent).componentInstance;
    expect(c.type()).toBe('text');
    expect(c.label()).toBe('');
    expect(c.placeholder()).toBe('');
    expect(c.disabled()).toBe(false);
    expect(c.error()).toBe('');
    expect(c.showClear()).toBe(false);
    expect(c.showPassword()).toBe(false);
  });

  it('ControlValueAccessor: writeValue', () => {
    const c = TestBed.createComponent(KpInputComponent).componentInstance;
    c.writeValue('тест');
    expect(c.value).toBe('тест');
  });

  it('ControlValueAccessor: registerOnChange', () => {
    const c = TestBed.createComponent(KpInputComponent).componentInstance;
    let changed = '';
    c.registerOnChange((v) => (changed = v as string));
    c.onValueChange('новое');
    expect(changed).toBe('новое');
  });

  it('writeValue с null даёт пустую строку', () => {
    const c = TestBed.createComponent(KpInputComponent).componentInstance;
    c.writeValue(null as unknown as string);
    expect(c.value).toBe('');
  });

  // === Очистка ===

  it('showClear по умолчанию false', () => {
    const c = TestBed.createComponent(KpInputComponent).componentInstance;
    expect(c.showClear()).toBe(false);
  });

  it('clear() очищает значение и вызывает onChange', () => {
    const c = TestBed.createComponent(KpInputComponent).componentInstance;
    let changed: string | number = 'старое';
    c.registerOnChange((v) => (changed = v));
    c.writeValue('значение');
    c.clear();
    expect(c.value).toBe('');
    expect(changed).toBe('');
  });

  it('кнопка очистки НЕ рендерится при showClear=false (по умолчанию)', () => {
    const f = TestBed.createComponent(KpInputComponent);
    f.componentInstance.writeValue('текст');
    f.detectChanges();
    expect(f.debugElement.query(By.css('.kp-input__action'))).toBeNull();
  });

  // === Пароль ===

  it('showPassword по умолчанию false', () => {
    const c = TestBed.createComponent(KpInputComponent).componentInstance;
    expect(c.showPassword()).toBe(false);
  });

  it('кнопка пароля НЕ рендерится при type=text (по умолчанию)', () => {
    const f = TestBed.createComponent(KpInputComponent);
    f.detectChanges();
    expect(f.debugElement.query(By.css('.kp-input__action'))).toBeNull();
  });

  // === Ошибка ===

  it('error по умолчанию пустая строка', () => {
    const c = TestBed.createComponent(KpInputComponent).componentInstance;
    expect(c.error()).toBe('');
  });

  it('.kp-input__error не рендерится когда error пустой', () => {
    const f = TestBed.createComponent(KpInputComponent);
    f.detectChanges();
    expect(f.debugElement.query(By.css('.kp-input__error'))).toBeNull();
  });
});
