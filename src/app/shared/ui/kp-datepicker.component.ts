import { Component, input, model, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu);

@Component({
  selector: 'kp-datepicker',
  standalone: true,
  imports: [DatePickerModule, FormsModule, CommonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'ru' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kp-field">
      @if (label()) {
        <label class="kp-field__label" [for]="inputId()">{{ label() }}</label>
      }
      <p-datepicker
        [(ngModel)]="selectedDate"
        locale="ru"
        [showIcon]="showIcon()"
        [iconDisplay]="iconDisplay()"
        [dateFormat]="dateFormat()"
        [placeholder]="placeholder()"
        [showTime]="showTime()"
        [hourFormat]="hourFormat()"
        [disabled]="disabled()"
        [styleClass]="styleClass()"
        [inputId]="inputId()"
      />
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }

    .kp-field {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      width: 100%;
    }

    .kp-field__label {
      font-size: var(--form-label-font-size);
      font-weight: var(--form-label-font-weight);
      color: var(--form-label-color);
      margin-bottom: 0;
    }

    :host ::ng-deep .p-datepicker {
      width: 100%;
      height: var(--form-height);
      border-radius: var(--form-border-radius);
      border: 1px solid var(--form-border-color);
      background: var(--form-bg);
      font-size: var(--form-font-size);
      color: var(--form-text-color);
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }

    :host ::ng-deep .p-datepicker:hover {
      border-color: var(--form-border-color-hover);
    }

    :host ::ng-deep .p-datepicker.p-focus {
      border-color: var(--form-border-color-focus);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
    }

    :host ::ng-deep .p-datepicker .p-inputtext {
      font-size: var(--form-font-size);
      color: var(--form-text-color);
    }

    :host ::ng-deep .p-datepicker .p-inputtext::placeholder {
      color: var(--form-placeholder-color);
    }
  `],
})
export class KpDatepickerComponent {
  label = input('');
  selectedDate = model<Date | null>(null);
  showIcon = input(false);
  iconDisplay = input<'input' | 'button'>('input');
  dateFormat = input('dd.mm.yy');
  placeholder = input('');
  showTime = input(false);
  hourFormat = input('24');
  disabled = input(false);
  styleClass = input('');
  inputId = input('');
}
