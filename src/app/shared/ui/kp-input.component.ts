import { Component, input, signal, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'kp-input',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, InputNumberModule, FloatLabelModule],
  template: `
    <div class="kp-input-field" [class.kp-input-field--error]="!!error()">
      @if (label()) { <p-floatlabel>
        @if (type() === 'number') {
          <p-inputnumber
            [inputId]="inputId()"
            [(ngModel)]="value"
            (ngModelChange)="onValueChange($event)"
            [disabled]="disabled()"
            [styleClass]="'kp-input__number' + (error() ? ' ng-invalid' : '')"
            [placeholder]="placeholder()"
            [attr.aria-label]="label() || placeholder() || 'Поле ввода'"
            [attr.aria-describedby]="error() ? inputId() + '-error' : null"
          />
          <label [for]="inputId()">{{ label() }}</label>
        } @else {
          <div class="kp-input__wrapper">
            <input
              [id]="inputId()"
              [type]="showPassword() ? 'text' : type()"
              pInputText
              [(ngModel)]="value"
              (ngModelChange)="onValueChange($event)"
              [disabled]="disabled()"
              [placeholder]="placeholder()"
              [class.ng-invalid]="!!error()"
              [attr.aria-label]="label() || placeholder() || 'Поле ввода'"
              [attr.aria-describedby]="error() ? inputId() + '-error' : null"
            />
            @if (showClear() && value) {
              <button type="button" class="kp-input__action" (click)="clear()" tabindex="-1" aria-label="Очистить">
                <i class="pi pi-times"></i>
              </button>
            }
            @if (type() === 'password') {
              <button type="button" class="kp-input__action" (click)="showPassword.set(!showPassword())" tabindex="-1" [attr.aria-label]="showPassword() ? 'Скрыть пароль' : 'Показать пароль'">
                <i [class]="showPassword() ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            }
          </div>
          <label [for]="inputId()">{{ label() }}</label>
        }
      </p-floatlabel> }

      @if (!label()) {
        @if (type() === 'number') {
          <p-inputnumber
            [(ngModel)]="value"
            (ngModelChange)="onValueChange($event)"
            [disabled]="disabled()"
            [placeholder]="placeholder()"
          />
        } @else {
          <div class="kp-input__wrapper">
            <input
              [type]="showPassword() ? 'text' : type()"
              pInputText
              [(ngModel)]="value"
              (ngModelChange)="onValueChange($event)"
              [disabled]="disabled()"
              [placeholder]="placeholder()"
              [class.ng-invalid]="!!error()"
            />
            @if (showClear() && value) {
              <button type="button" class="kp-input__action" (click)="clear()" tabindex="-1" aria-label="Очистить">
                <i class="pi pi-times"></i>
              </button>
            }
            @if (type() === 'password') {
              <button type="button" class="kp-input__action" (click)="showPassword.set(!showPassword())" tabindex="-1" [attr.aria-label]="showPassword() ? 'Скрыть пароль' : 'Показать пароль'">
                <i [class]="showPassword() ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
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
    .kp-input-field { display: flex; flex-direction: column; gap: var(--space-2); }
    .kp-input-field--error :host ::ng-deep .p-inputtext { border-color: var(--color-error); }
    .kp-input__error { color: var(--color-error); font-size: var(--font-size-xs); margin-top: var(--space-1); }
    .kp-input__number { width: 100%; }
    .kp-input__wrapper { position: relative; display: flex; align-items: center; }
    .kp-input__wrapper input { width: 100%; padding-right: 2.5rem; }
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
