import { Component, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KpDialogComponent } from './kp-dialog.component.js';
import { KpInputComponent } from './kp-input.component.js';
import { KpSelectComponent, SelectOption } from './kp-select.component.js';
import { KpButtonComponent } from './kp-button.component.js';
import type { DocBlock, DocTextColumn } from '../../../../shared/types/index.js';

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

@Component({
  selector: 'kp-doc-text-editor-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, KpDialogComponent, KpInputComponent, KpSelectComponent, KpButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kp-dialog
      header="Редактирование текстового блока"
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      width="700px"
    >
      <div class="editor">
        <kp-input label="Заголовок блока" [(ngModel)]="title" placeholder="Необязательный заголовок" />

        <kp-select
          label="Количество колонок"
          [options]="columnCountOptions"
          [ngModel]="columnCount()"
          (ngModelChange)="onColumnCountChange($event)"
        />

        @for (col of columns(); track col.id; let i = $index) {
          <div class="editor__col">
            <div class="editor__col-header">Колонка {{ i + 1 }}</div>
            <textarea
              class="editor__textarea"
              [ngModel]="col.content"
              (ngModelChange)="updateColumn(i, 'content', $event)"
              placeholder="Текст колонки..."
              rows="3"
            ></textarea>
            <div class="editor__col-toolbar">
              <kp-select
                label="Выравнивание"
                [options]="alignOptions"
                [ngModel]="col.textAlign || 'left'"
                (ngModelChange)="updateColumn(i, 'textAlign', $event)"
              />
              <kp-select
                label="Начертание"
                [options]="weightOptions"
                [ngModel]="col.fontWeight || 'normal'"
                (ngModelChange)="updateColumn(i, 'fontWeight', $event)"
              />
              <kp-select
                label="Подчёркивание"
                [options]="decorationOptions"
                [ngModel]="col.textDecoration || 'none'"
                (ngModelChange)="updateColumn(i, 'textDecoration', $event)"
              />
              <kp-input
                label="Ширина"
                [placeholder]="'auto'"
                [(ngModel)]="col.width"
              />
            </div>
          </div>
        }
      </div>

      <div class="editor__footer">
        <kp-button label="Сохранить" icon="pi pi-check" (buttonClick)="save()" />
        <kp-button label="Отмена" severity="secondary" icon="pi pi-times" (buttonClick)="visible.set(false)" />
      </div>
    </kp-dialog>
  `,
  styles: [`
    .editor { display: flex; flex-direction: column; gap: 12px; }
    .editor__col {
      background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px;
    }
    .editor__col-header {
      font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 6px;
    }
    .editor__textarea {
      width: 100%; border: 1px solid #d1d5db; border-radius: 4px; padding: 6px 8px;
      font-family: inherit; font-size: 13px; resize: vertical;
    }
    .editor__col-toolbar {
      display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;
    }
    .editor__footer {
      display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;
    }
  `]
})
export class KpDocTextEditorDialogComponent {
  visible = signal(false);
  block = signal<DocBlock | null>(null);
  saved = output<DocBlock>();

  title = '';
  columnCount = signal(1);
  columns = signal<DocTextColumn[]>([]);

  columnCountOptions: SelectOption[] = [
    { value: 1, label: '1 колонка' },
    { value: 2, label: '2 колонки' },
    { value: 3, label: '3 колонки' },
    { value: 4, label: '4 колонки' },
  ];

  alignOptions: SelectOption[] = [
    { value: 'left', label: 'По левому' },
    { value: 'center', label: 'По центру' },
    { value: 'right', label: 'По правому' },
  ];

  weightOptions: SelectOption[] = [
    { value: 'normal', label: 'Обычный' },
    { value: 'bold', label: 'Жирный' },
  ];

  decorationOptions: SelectOption[] = [
    { value: 'none', label: 'Нет' },
    { value: 'underline', label: 'Подчёркнутый' },
  ];

  open(block: DocBlock) {
    this.block.set(block);
    this.title = block.title ?? '';
    const cols = block.columns?.length ? block.columns : [{ id: genId(), content: block.content ?? '' }];
    this.columns.set(cols.map((c: DocTextColumn) => ({ ...c })));
    this.columnCount.set(cols.length);
    this.visible.set(true);
  }

  onColumnCountChange(count: unknown) {
    const n = Number(count);
    this.columnCount.set(n);
    this.columns.update(cols => {
      while (cols.length < n) cols.push({ id: genId(), content: '' });
      return cols.slice(0, n);
    });
  }

  updateColumn(index: number, field: keyof DocTextColumn, value: unknown) {
    this.columns.update(cols => {
      const arr = [...cols];
      arr[index] = { ...arr[index], [field]: value };
      return arr;
    });
  }

  save() {
    const b = this.block();
    if (!b) return;
    const cols = this.columns();
    const updated: DocBlock = {
      ...b,
      title: this.title || undefined,
      content: cols.length === 1 ? cols[0].content : undefined,
      columns: cols.length > 1 ? cols : undefined,
    };
    this.saved.emit(updated);
    this.visible.set(false);
  }
}
