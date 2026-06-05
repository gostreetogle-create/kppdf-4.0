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
            <div class="editor__col-header">
              <span>Колонка {{ i + 1 }}</span>
            </div>

            <textarea
              class="editor__textarea"
              [ngModel]="col.content"
              (ngModelChange)="updateColumn(i, 'content', $event)"
              [placeholder]="'Текст колонки ' + (i + 1) + '...'"
              rows="3"
            ></textarea>

            <!-- Панель форматирования: иконки -->
            <div class="editor__col-toolbar">
              <!-- Выравнивание -->
              <div class="editor__toolbar-group">
                <kp-button
                  icon="pi pi-align-left"
                  size="small"
                  [severity]="(col.textAlign || 'left') === 'left' ? 'primary' : 'secondary'"
                  [text]="(col.textAlign || 'left') !== 'left'"
                  [rounded]="true"
                  pTooltip="По левому краю"
                  tooltipPosition="top"
                  (buttonClick)="updateColumn(i, 'textAlign', 'left')"
                />
                <kp-button
                  icon="pi pi-align-center"
                  size="small"
                  [severity]="col.textAlign === 'center' ? 'primary' : 'secondary'"
                  [text]="col.textAlign !== 'center'"
                  [rounded]="true"
                  pTooltip="По центру"
                  tooltipPosition="top"
                  (buttonClick)="updateColumn(i, 'textAlign', 'center')"
                />
                <kp-button
                  icon="pi pi-align-right"
                  size="small"
                  [severity]="col.textAlign === 'right' ? 'primary' : 'secondary'"
                  [text]="col.textAlign !== 'right'"
                  [rounded]="true"
                  pTooltip="По правому краю"
                  tooltipPosition="top"
                  (buttonClick)="updateColumn(i, 'textAlign', 'right')"
                />
              </div>

              <div class="editor__toolbar-divider"></div>

              <!-- Начертание: B, I, U -->
              <div class="editor__toolbar-group">
                <kp-button
                  icon="pi pi-bold"
                  size="small"
                  [severity]="col.fontWeight === 'bold' ? 'primary' : 'secondary'"
                  [text]="col.fontWeight !== 'bold'"
                  [rounded]="true"
                  pTooltip="Жирный"
                  tooltipPosition="top"
                  (buttonClick)="updateColumn(i, 'fontWeight', col.fontWeight === 'bold' ? 'normal' : 'bold')"
                />
                <kp-button
                  icon="pi pi-italic"
                  size="small"
                  [severity]="col.fontStyle === 'italic' ? 'primary' : 'secondary'"
                  [text]="col.fontStyle !== 'italic'"
                  [rounded]="true"
                  pTooltip="Курсив"
                  tooltipPosition="top"
                  (buttonClick)="updateColumn(i, 'fontStyle', col.fontStyle === 'italic' ? 'normal' : 'italic')"
                />
                <kp-button
                  icon="pi pi-underline"
                  size="small"
                  [severity]="col.textDecoration === 'underline' ? 'primary' : 'secondary'"
                  [text]="col.textDecoration !== 'underline'"
                  [rounded]="true"
                  pTooltip="Подчёркнутый"
                  tooltipPosition="top"
                  (buttonClick)="updateColumn(i, 'textDecoration', col.textDecoration === 'underline' ? 'none' : 'underline')"
                />
              </div>

              <div class="editor__toolbar-divider"></div>

              <!-- Ширина колонки -->
              <div class="editor__width-field">
                <kp-input
                  label="Ширина"
                  [placeholder]="'auto'"
                  [(ngModel)]="col.width"
                />
              </div>
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
      background: var(--color-surface-alt);
      border: 1px solid var(--color-border-light);
      border-radius: 6px;
      padding: 10px;
    }
    .editor__col-header {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-muted);
      margin-bottom: 6px;
    }
    .editor__textarea {
      width: 100%;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      padding: 6px 8px;
      font-family: inherit;
      font-size: 13px;
      resize: vertical;
      background: var(--color-surface);
      color: var(--color-text);
    }
    .editor__textarea:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 1px var(--color-primary-light);
    }
    .editor__col-toolbar {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .editor__toolbar-group {
      display: flex;
      gap: 2px;
    }
    .editor__toolbar-divider {
      width: 1px;
      height: 24px;
      background: var(--color-border);
      margin: 0 4px;
    }
    .editor__width-field {
      width: 90px;
      margin-left: auto;
    }
    .editor__footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 16px;
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
