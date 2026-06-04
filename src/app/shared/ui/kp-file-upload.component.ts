import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { FileUploadModule, FileUploadEvent, FileUploadErrorEvent } from 'primeng/fileupload';

@Component({
  selector: 'kp-file-upload',
  standalone: true,
  imports: [FileUploadModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kp-field">
      @if (label()) {
        <label class="kp-field__label">{{ label() }}</label>
      }
      <p-fileupload
        [name]="name()"
        [url]="url()"
        [accept]="accept()"
        [maxFileSize]="maxFileSize()"
        [multiple]="multiple()"
        [disabled]="disabled()"
        [auto]="auto()"
        [chooseLabel]="chooseLabel()"
        [uploadLabel]="uploadLabel()"
        [cancelLabel]="cancelLabel()"
        [mode]="mode()"
        [styleClass]="styleClass()"
        (onUpload)="fileUpload.emit($event)"
        (onError)="fileError.emit($event)"
      />
    </div>
  `,
  styles: [`
    .kp-field { display: flex; flex-direction: column; gap: var(--space-2); }
    .kp-field__label { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-secondary); }

    :host ::ng-deep .p-fileupload-content {
      border: 2px dashed var(--color-border-light);
      border-radius: var(--radius-lg);
      background: var(--color-surface-alt);
      transition: border-color var(--transition-fast), background var(--transition-fast);
      padding: var(--space-6);
      text-align: center;
    }
    :host ::ng-deep .p-fileupload-content.p-fileupload-highlight {
      border-color: var(--color-primary);
      background: var(--color-primary-subtle);
    }
  `],
})
export class KpFileUploadComponent {
  label = input('');
  name = input('file');
  url = input('/api/v1/upload');
  accept = input('');
  maxFileSize = input(10_000_000);
  multiple = input(false);
  disabled = input(false);
  auto = input(false);
  chooseLabel = input('Выбрать');
  uploadLabel = input('Загрузить');
  cancelLabel = input('Отмена');
  mode = input<'basic' | 'advanced'>('advanced');
  styleClass = input('');
  fileUpload = output<FileUploadEvent>();
  fileError = output<FileUploadErrorEvent>();
}
