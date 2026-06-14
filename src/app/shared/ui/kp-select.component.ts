import { Component, input, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Select } from 'primeng/select';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  value: unknown;
  label: string;
}

@Component({
  selector: 'kp-select',
  standalone: true,
  imports: [CommonModule, FormsModule, Select],
  template: `
    <div class="kp-select-field" [class.kp-select-field--error]="!!error()">
      @if (label()) {
        <label class="kp-select__label" [for]="inputId()">{{ label() }}</label>
      }
      <p-select
        [inputId]="inputId()"
        [name]="inputId()"
        [options]="options()"
        [(ngModel)]="value"
        (ngModelChange)="onValueChange($event)"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [showClear]="showClear()"
        [filter]="filter()"
        [filterBy]="filterBy()"
        [class.kp-select--error]="!!error()"
        [attr.aria-label]="label() || placeholder() || 'Выпадающий список'"
        [attr.aria-describedby]="error() ? inputId() + '-error' : null"
        styleClass="kp-select__trigger"
        panelStyleClass="kp-select__panel"
        [appendTo]="appendTo()"
      />
      @if (error()) {
        <small class="kp-select__error" [id]="inputId() + '-error'">{{ error() }}</small>
      }
    </div>
  `,
  styles: [`
    /* === Хост — полная ширина по умолчанию === */
    :host {
      display: block;
      width: 100%;
    }

    .kp-select-field {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      width: 100%;
    }

    /* Label над полем */
    .kp-select__label {
      font-size: var(--form-label-font-size);
      font-weight: var(--form-label-font-weight);
      color: var(--form-label-color);
      line-height: 1.2;
    }

    /* === Триггер (поле выбора) === */
    :host ::ng-deep .kp-select__trigger {
      width: 100%;
      min-height: var(--form-height);
      height: var(--form-height);
      align-items: center;
      border-radius: var(--form-border-radius);
      border: 1px solid var(--form-border-color);
      background: var(--form-bg);
      font-size: var(--form-font-size);
      color: var(--form-text-color);
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
      padding: 0 var(--form-padding-x);
    }

    :host ::ng-deep .kp-select__trigger:hover {
      border-color: var(--color-primary);
    }

    :host ::ng-deep .kp-select__trigger.p-focus,
    :host ::ng-deep .kp-select__trigger.p-inputwrapper-focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
    }

    /* Состояние ошибки */
    :host ::ng-deep .kp-select__trigger.kp-select--error {
      border-color: var(--color-error);
    }

    :host ::ng-deep .kp-select__trigger.kp-select--error.p-focus,
    :host ::ng-deep .kp-select__trigger.kp-select--error.p-inputwrapper-focus {
      border-color: var(--color-error);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 20%, transparent);
    }

    /* Disabled */
    :host ::ng-deep .kp-select__trigger.p-disabled {
      opacity: 0.55;
      background: var(--color-surface-alt);
      cursor: not-allowed;
    }

    /* Текст выбранного значения — с ellipsis */
    :host ::ng-deep .kp-select__trigger .p-select-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      max-width: 100%;
    }

    /* Placeholder цвет */
    :host ::ng-deep .kp-select__trigger .p-select-label.p-placeholder {
      color: var(--form-placeholder-color);
    }

    /* Clear-кнопка (крестик) */
    :host ::ng-deep .kp-select__trigger .p-select-clear-icon {
      color: var(--color-text-muted);
      width: 16px;
      height: 16px;
      transition: color var(--transition-fast);
    }
    :host ::ng-deep .kp-select__trigger .p-select-clear-icon:hover {
      color: var(--color-text);
    }

    /* Chevron-стрелка */
    :host ::ng-deep .kp-select__trigger .p-select-dropdown-icon {
      color: var(--color-text-muted);
      width: 16px;
      height: 16px;
      transition: transform var(--transition-fast), color var(--transition-fast);
    }

    /* === Дропдаун-панель === */
    :host ::ng-deep .kp-select__panel {
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-xl);
      margin-top: var(--space-1);
      background: var(--color-surface);
      overflow: hidden;
    }

    /* Поле поиска внутри дропдауна */
    :host ::ng-deep .kp-select__panel .p-select-filter-container {
      padding: var(--space-2);
      border-bottom: 1px solid var(--color-border-light);
    }

    :host ::ng-deep .kp-select__panel .p-select-filter {
      width: 100%;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border-light);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      background: var(--color-surface);
      outline: none;
      transition: border-color var(--transition-fast);
    }

    :host ::ng-deep .kp-select__panel .p-select-filter:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 15%, transparent);
    }

    /* Опции */
    :host ::ng-deep .kp-select__panel .p-select-option {
      padding: var(--space-2) var(--space-4);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      cursor: pointer;
      transition: background var(--transition-fast), color var(--transition-fast);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :host ::ng-deep .kp-select__panel .p-select-option:not(.p-select-option-selected):hover {
      background: var(--color-primary-subtle);
      color: var(--color-primary);
    }

    :host ::ng-deep .kp-select__panel .p-select-option.p-select-option-selected {
      background: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: var(--font-weight-semibold);
    }

    /* Заголовок опции (когда optionLabel не 'label') */
    :host ::ng-deep .kp-select__panel .p-select-option-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }

    /* Скролл внутри дропдауна */
    :host ::ng-deep .kp-select__panel .p-select-list-container {
      max-height: 240px;
      overflow-y: auto;
    }

    /* Сообщение об ошибке */
    .kp-select__error {
      color: var(--form-error-color);
      font-size: var(--form-error-font-size);
      margin-top: var(--form-error-margin-top);
      line-height: 1.3;
    }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => KpSelectComponent), multi: true }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpSelectComponent implements ControlValueAccessor {
  label = input('');
  options = input<SelectOption[]>([]);
  optionLabel = input('label');
  optionValue = input('value');
  placeholder = input('Выберите...');
  disabled = input(false);
  error = input('');
  showClear = input(false);
  filter = input(false);
  filterBy = input('label');
  appendTo = input<string>('body');
  inputId = input(`kp-select-${Math.random().toString(36).slice(2, 8)}`);

  value: unknown = null;
  onChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  onValueChange(value: unknown) {
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: unknown): void { this.value = value; }
  registerOnChange(fn: (value: unknown) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(_: boolean): void {}
}
