import { Component, input, signal, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'kp-input',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, InputNumberModule, FloatLabelModule, LucideDynamicIcon],
  template: `
    <div class="kp-input-field" [class.kp-input-field--error]="!!error()">
      @if (label()) {
        @if (type() === 'number') {
          <p-floatlabel variant="on">
            <p-inputnumber
              [inputId]="inputId()"
              [name]="name() || inputId()"
              [(ngModel)]="value"
              (ngModelChange)="onValueChange($event)"
              [disabled]="disabled()"
              [attr.aria-label]="label() || 'Числовое поле'"
              [attr.aria-describedby]="error() ? inputId() + '-error' : null"
            />
            <label [for]="inputId()">{{ label() }}</label>
          </p-floatlabel>
        } @else {
          <div class="kp-input__wrapper">
            <p-floatlabel variant="on">
              <input
                [id]="inputId()"
                [name]="name() || inputId()"
                [type]="showPassword() ? 'text' : type()"
                pInputText
                [(ngModel)]="value"
                (ngModelChange)="onValueChange($event)"
                [disabled]="disabled()"
                [class.ng-invalid]="!!error()"
                [attr.aria-label]="label() || 'Поле ввода'"
                [attr.aria-describedby]="error() ? inputId() + '-error' : null"
              />
              <label [for]="inputId()">{{ label() }}</label>
            </p-floatlabel>
            @if (showClear() && value) {
              <button type="button" class="kp-input__action" (click)="clear()" tabindex="-1" aria-label="Очистить">
                <svg lucideIcon="x"></svg>
              </button>
            }
            @if (type() === 'password') {
              <button type="button" class="kp-input__action" (click)="showPassword.set(!showPassword())" tabindex="-1" [attr.aria-label]="showPassword() ? 'Скрыть пароль' : 'Показать пароль'">
                @if (showPassword()) {
                  <svg lucideIcon="eye-off"></svg>
                } @else {
                  <svg lucideIcon="eye"></svg>
                }
              </button>
            }
          </div>
        }
      }

      @if (!label()) {
        @if (type() === 'number') {
          <p-inputnumber
            [name]="name() || inputId()"
            [(ngModel)]="value"
            (ngModelChange)="onValueChange($event)"
            [disabled]="disabled()"
            [placeholder]="placeholder()"
            [attr.aria-label]="placeholder() || 'Числовое поле'"
          />
        } @else {
          <div class="kp-input__wrapper">
            <input
              [name]="name() || inputId()"
              [type]="showPassword() ? 'text' : type()"
              pInputText
              [(ngModel)]="value"
              (ngModelChange)="onValueChange($event)"
              [disabled]="disabled()"
              [placeholder]="placeholder()"
              [class.ng-invalid]="!!error()"
              [attr.aria-label]="placeholder() || 'Поле ввода'"
            />
            @if (showClear() && value) {
              <button type="button" class="kp-input__action" (click)="clear()" tabindex="-1" aria-label="Очистить">
                <svg lucideIcon="x"></svg>
              </button>
            }
            @if (type() === 'password') {
              <button type="button" class="kp-input__action" (click)="showPassword.set(!showPassword())" tabindex="-1" [attr.aria-label]="showPassword() ? 'Скрыть пароль' : 'Показать пароль'">
                @if (showPassword()) {
                  <svg lucideIcon="eye-off"></svg>
                } @else {
                  <svg lucideIcon="eye"></svg>
                }
              </button>
            }
          </div>
        }
      }

      @if (error()) {
        <small class="kp-input__error" [id]="inputId() + '-error'">{{ error() }}</small>
      }
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }

    .kp-input-field {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      width: 100%;
    }

    /* Float label */
    :host ::ng-deep p-floatlabel {
      display: block;
      width: 100%;
      position: relative;
    }

    :host ::ng-deep p-floatlabel label {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: var(--form-label-font-size);
      font-weight: var(--form-label-font-weight);
      color: var(--form-label-color);
      background: transparent;
      pointer-events: none;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    :host ::ng-deep p-floatlabel:has(.p-inputwrapper-focus) label,
    :host ::ng-deep p-floatlabel:has(.p-focus) label,
    :host ::ng-deep p-floatlabel:has(.p-filled) label {
      top: 0;
      transform: translateY(-50%);
      font-size: 11px;
      color: var(--form-label-color-floating);
      background: var(--color-surface);
      padding: 0 4px;
    }

    .kp-input-field--error :host ::ng-deep p-floatlabel:has(.ng-invalid) label {
      color: var(--form-label-color-error);
    }

    /* Input styling */
    :host ::ng-deep .p-inputtext {
      width: 100%;
      height: var(--form-height);
      border-radius: var(--form-border-radius);
      border: 1px solid var(--form-border-color);
      background: var(--form-bg);
      font-size: var(--form-font-size);
      color: var(--form-text-color);
      padding: 0 var(--form-padding-x);
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }

    :host ::ng-deep .p-inputtext:hover {
      border-color: var(--form-border-color-hover);
    }

    :host ::ng-deep .p-inputtext:focus,
    :host ::ng-deep .p-inputtext.p-filled {
      border-color: var(--form-border-color-focus);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
    }

    .kp-input-field--error :host ::ng-deep .p-inputtext {
      border-color: var(--form-border-color-error);
    }

    .kp-input-field--error :host ::ng-deep .p-inputtext:focus {
      border-color: var(--form-border-color-error);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 20%, transparent);
    }

    /* Disabled */
    :host ::ng-deep .p-inputtext:disabled {
      opacity: 0.55;
      background: var(--form-bg-disabled);
      cursor: not-allowed;
    }

    /* Placeholder */
    :host ::ng-deep .p-inputtext::placeholder {
      color: var(--form-placeholder-color);
    }

    .kp-input__wrapper { position: relative; display: flex; align-items: center; }
    .kp-input__wrapper input { width: 100%; padding-right: 2.5rem; }
    .kp-input__number { width: 100%; }

    .kp-input__action {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 4px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      transition: color var(--transition-spring), background var(--transition-spring);
    }
    .kp-input__action + .kp-input__action { right: 32px; }
    .kp-input__action:hover {
      color: var(--color-text);
      background: var(--color-surface-hover);
    }

    .kp-input__error {
      color: var(--form-error-color);
      font-size: var(--form-error-font-size);
      margin-top: var(--form-error-margin-top);
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KpInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpInputComponent implements ControlValueAccessor {
  label = input('');
  type = input<'text' | 'number' | 'password' | 'email'>('text');
  placeholder = input('');
  disabled = input(false);
  error = input('');
  showClear = input(false);
  inputId = input(`kp-input-${Math.random().toString(36).slice(2, 8)}`);
  /** name для формы (Angular NG01203 требует name при [(ngModel)]) */
  name = input('');
  showPassword = signal(false);

  value: string | number = '';
  onChange: (value: string | number) => void = () => {};
  onTouched: () => void = () => {};

  clear() {
    this.value = '';
    this.onChange('');
  }

  onValueChange(value: string | number) {
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: string | number): void { this.value = value ?? ''; }
  registerOnChange(fn: (value: string | number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(_: boolean): void { /* handled by input */ }
}
