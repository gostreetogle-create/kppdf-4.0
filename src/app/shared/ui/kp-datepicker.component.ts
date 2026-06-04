import { Component, input, model, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
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
    .kp-field { display: flex; flex-direction: column; gap: var(--space-2, 8px); }
    .kp-field__label { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-secondary); }
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
