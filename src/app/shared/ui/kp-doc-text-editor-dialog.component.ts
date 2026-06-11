import { Component, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KpDialogComponent } from './kp-dialog.component.js';
import { KpInputComponent } from './kp-input.component.js';
import { KpSelectComponent, SelectOption } from './kp-select.component.js';
import { KpButtonComponent } from './kp-button.component.js';
import { LucideDynamicIcon } from '@lucide/angular';
import type { DocBlock, DocTextColumn } from '../../../../shared/types/index.js';

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

interface PlaceholderDef {
  /** Плейсхолдер без {{}} */
  key: string;
  /** Человеческое название */
  label: string;
  /** Категория для группировки */
  category: string;
  /** Описание */
  description: string;
}

/** Плейсхолдеры, доступные в текстовых блоках */
const PLACEHOLDER_GROUPS: PlaceholderDef[] = [
  // Документ
  { key: 'number', label: 'Номер документа', category: 'Документ', description: 'Номер документа' },
  { key: 'date', label: 'Дата', category: 'Документ', description: 'Текущая дата' },
  { key: 'city', label: 'Город', category: 'Документ', description: 'Город составления' },
  { key: 'delivery_days', label: 'Срок поставки (дн)', category: 'Документ', description: 'Срок поставки в рабочих днях' },
  // Клиент
  { key: 'client.name', label: 'Наименование клиента', category: 'Клиент', description: 'Полное наименование организации-клиента' },
  { key: 'client.short_name', label: 'Краткое наименование', category: 'Клиент', description: 'Краткое наименование клиента' },
  { key: 'client.inn', label: 'ИНН клиента', category: 'Клиент', description: 'ИНН клиента' },
  { key: 'client.phone', label: 'Телефон клиента', category: 'Клиент', description: 'Контактный телефон клиента' },
  { key: 'client.email', label: 'Email клиента', category: 'Клиент', description: 'Электронная почта клиента' },
  { key: 'client.address', label: 'Адрес клиента', category: 'Клиент', description: 'Юридический адрес клиента' },
  // Наша компания
  { key: 'our_company.name', label: 'Наша компания', category: 'Наша компания', description: 'Полное наименование нашей организации' },
  { key: 'our_company.short_name', label: 'Наша компания (кратко)', category: 'Наша компания', description: 'Краткое наименование нашей организации' },
  { key: 'our_company.inn', label: 'Наш ИНН', category: 'Наша компания', description: 'ИНН нашей организации' },
  { key: 'our_company.phone', label: 'Наш телефон', category: 'Наша компания', description: 'Контактный телефон нашей организации' },
  { key: 'our_company.email', label: 'Наш email', category: 'Наша компания', description: 'Электронная почта нашей организации' },
  { key: 'our_company.address', label: 'Наш адрес', category: 'Наша компания', description: 'Юридический адрес нашей организации' },
  // Поставщик
  { key: 'supplier.name', label: 'Поставщик', category: 'Поставщик', description: 'Наименование поставщика' },
  { key: 'supplier.contact_person', label: 'Контактное лицо', category: 'Поставщик', description: 'Контактное лицо поставщика' },
  { key: 'supplier.phone', label: 'Телефон поставщика', category: 'Поставщик', description: 'Контактный телефон поставщика' },
  // Суммы
  { key: 'total_amount', label: 'Сумма всего', category: 'Суммы', description: 'Общая сумма документа' },
  { key: 'total_amount_words', label: 'Сумма прописью', category: 'Суммы', description: 'Общая сумма прописью' },
  { key: 'vat', label: 'НДС', category: 'Суммы', description: 'Сумма НДС' },
];

/** Получить уникальные категории */
const PLACEHOLDER_CATEGORIES = [...new Set(PLACEHOLDER_GROUPS.map(p => p.category))];

@Component({
  selector: 'kp-doc-text-editor-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, KpDialogComponent, KpInputComponent, KpSelectComponent, KpButtonComponent, LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kp-dialog
      header="Редактирование текстового блока"
      [(visible)]="visible"
      [width]="dialogWidth()"
    >
      <div class="editor">
        <kp-input label="Заголовок блока" [(ngModel)]="title" placeholder="Необязательный заголовок" />

        <kp-select
          label="Количество колонок"
          [options]="columnCountOptions"
          [ngModel]="columnCount()"
          (ngModelChange)="onColumnCountChange($event)"
        />

        <div class="editor__cols">
          @for (col of columns(); track col.id; let i = $index) {
            <div class="editor__col">
              <div class="editor__col-header">
                <span>Колонка {{ i + 1 }}</span>
              </div>

              <textarea
                #colTextarea
                class="editor__textarea"
                [ngModel]="col.content"
                (ngModelChange)="updateColumn(i, 'content', $event)"
                [placeholder]="'Текст колонки ' + (i + 1) + '...'"
                rows="3"
              ></textarea>

              <!-- Live WYSIWYG preview -->
              @if (col.content.trim()) {
                <div
                  class="editor__preview"
                  [style.font-weight]="col.fontWeight || 'normal'"
                  [style.font-style]="col.fontStyle || 'normal'"
                  [style.text-decoration]="col.textDecoration || 'none'"
                  [style.text-align]="col.textAlign || 'left'"
                  [style.color]="col.color || 'inherit'"
                >{{ col.content }}</div>
              }

              <!-- Панель плейсхолдеров -->
              <div class="editor__placeholders">
                <button
                  type="button"
                  class="editor__placeholders-trigger"
                  (click)="togglePlaceholderCat(col.id)"
                >
                  <svg [lucideIcon]="'braces'" class="editor__placeholders-icon"></svg>
                  Вставить плейсхолдер
                </button>

                @if (placeholderState()?.colId === col.id) {
                  <div class="editor__placeholders-body">
                    @for (cat of placeholderCategories; track cat) {
                      <div class="editor__placeholders-group">
                        <button
                          type="button"
                          class="editor__placeholders-cat-btn"
                          [class.editor__placeholders-cat-btn--open]="placeholderState()?.category === cat"
                          (click)="toggleCategory(cat)"
                        >
                          <svg
                            [lucideIcon]="placeholderState()?.category === cat ? 'chevron-down' : 'chevron-right'"
                            class="editor__placeholders-cat-icon"
                          ></svg>
                          {{ cat }}
                        </button>
                        @if (placeholderState()?.category === cat) {
                          <div class="editor__placeholders-chips">
                            @for (ph of placeholdersByCategory(cat); track ph.key) {
                              <button
                                type="button"
                                class="editor__placeholder-chip"
                                (click)="insertPlaceholder(i, ph.key, colTextarea)"
                                [attr.title]="ph.description"
                              >
                                <span class="editor__placeholder-key">{{ '{{' + ph.key + '}}' }}</span>
                                <span class="editor__placeholder-label">{{ ph.label }}</span>
                              </button>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Панель форматирования: иконки -->
              <div class="editor__col-toolbar">
                <!-- Выравнивание -->
                <div class="editor__toolbar-group">
                  <kp-button
                    lucideIcon="align-left"
                    size="small"
                    [severity]="(col.textAlign || 'left') === 'left' ? 'primary' : 'secondary'"
                    [text]="(col.textAlign || 'left') !== 'left'"
                    [rounded]="true"
                    pTooltip="По левому краю"
                    tooltipPosition="top"
                    (buttonClick)="updateColumn(i, 'textAlign', 'left')"
                  />
                  <kp-button
                    lucideIcon="text-align-center"
                    size="small"
                    [severity]="col.textAlign === 'center' ? 'primary' : 'secondary'"
                    [text]="col.textAlign !== 'center'"
                    [rounded]="true"
                    pTooltip="По центру"
                    tooltipPosition="top"
                    (buttonClick)="updateColumn(i, 'textAlign', 'center')"
                  />
                  <kp-button
                    lucideIcon="text-align-end"
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
                    lucideIcon="bold"
                    size="small"
                    [severity]="col.fontWeight === 'bold' ? 'primary' : 'secondary'"
                    [text]="col.fontWeight !== 'bold'"
                    [rounded]="true"
                    pTooltip="Жирный"
                    tooltipPosition="top"
                    (buttonClick)="updateColumn(i, 'fontWeight', col.fontWeight === 'bold' ? 'normal' : 'bold')"
                  />
                  <kp-button
                    lucideIcon="italic"
                    size="small"
                    [severity]="col.fontStyle === 'italic' ? 'primary' : 'secondary'"
                    [text]="col.fontStyle !== 'italic'"
                    [rounded]="true"
                    pTooltip="Курсив"
                    tooltipPosition="top"
                    (buttonClick)="updateColumn(i, 'fontStyle', col.fontStyle === 'italic' ? 'normal' : 'italic')"
                  />
                  <kp-button
                    lucideIcon="underline"
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
      </div>

      <div class="editor__footer">
        <kp-button label="Сохранить" lucideIcon="check" (buttonClick)="save()" />
        <kp-button label="Отмена" severity="secondary" lucideIcon="x" (buttonClick)="visible.set(false)" />
      </div>
    </kp-dialog>
  `,
  styles: [`
    .editor { display: flex; flex-direction: column; gap: 12px; }
    .editor__cols {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 12px;
    }
    .editor__col {
      flex: 1 1 200px;
      min-width: 180px;
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

    /* === WYSIWYG Preview === */
    .editor__preview {
      margin-top: 8px;
      padding: 10px 12px;
      min-height: 36px;
      background: var(--color-surface);
      border: 1px dashed var(--color-border);
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.5;
      color: var(--color-text);
      white-space: pre-wrap;
      word-break: break-word;
      transition: all 0.15s;
    }

    /* === Placeholders Panel === */
    .editor__placeholders {
      margin-top: 8px;
      border: 1px solid var(--color-border-light);
      border-radius: 6px;
      background: var(--color-surface);
    }

    .editor__placeholders-trigger {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-secondary);
      background: none;
      border: none;
      cursor: pointer;
      user-select: none;
      transition: color 0.15s;
      font-family: inherit;
    }
    .editor__placeholders-trigger:hover {
      color: var(--color-primary);
    }
    .editor__placeholders-icon {
      width: 14px;
      height: 14px;
    }
    .editor__placeholders-body {
      padding: 6px 10px 10px;
      border-top: 1px solid var(--color-border-light);
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 300px;
      overflow-y: auto;
    }
    .editor__placeholders-group {
      border-bottom: 1px solid var(--color-border-light);
      padding-bottom: 6px;
    }
    .editor__placeholders-group:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .editor__placeholders-cat-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      width: 100%;
      padding: 5px 0;
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-secondary);
      background: none;
      border: none;
      cursor: pointer;
      font-family: inherit;
      transition: color 0.15s;
    }
    .editor__placeholders-cat-btn:hover {
      color: var(--color-primary);
    }
    .editor__placeholders-cat-btn--open {
      color: var(--color-primary);
    }
    .editor__placeholders-cat-icon {
      width: 12px;
      height: 12px;
      flex-shrink: 0;
    }
    .editor__placeholders-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .editor__placeholder-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      font-size: 11px;
      border: 1px solid var(--color-border-light);
      border-radius: 4px;
      background: var(--color-surface-alt);
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .editor__placeholder-chip:hover {
      border-color: var(--color-primary-border);
      background: var(--color-primary-light);
      color: var(--color-primary);
    }
    .editor__placeholder-key {
      font-family: monospace;
      font-weight: 600;
      color: var(--color-primary);
    }
    .editor__placeholder-label {
      color: var(--color-text-muted);
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

  placeholderCategories = PLACEHOLDER_CATEGORIES;

  columnCountOptions: SelectOption[] = [
    { value: 1, label: '1 колонка' },
    { value: 2, label: '2 колонки' },
    { value: 3, label: '3 колонки' },
    { value: 4, label: '4 колонки' },
    { value: 5, label: '5 колонок' },
    { value: 6, label: '6 колонок' },
  ];

  /** Какая колонка и категория плейсхолдеров сейчас открыты */
  placeholderState = signal<{ colId: string; category: string | null } | null>(null);

  /** Динамическая ширина диалога: чем больше колонок — тем шире */
  dialogWidth = computed(() => {
    const n = this.columnCount();
    if (n <= 3) return '900px';
    if (n === 4) return '1100px';
    if (n === 5) return '1300px';
    return '95vw'; // 6 колонок — почти на весь экран
  });

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

  togglePlaceholderCat(colId: string) {
    this.placeholderState.update(cur =>
      cur?.colId === colId ? null : { colId, category: null }
    );
  }

  toggleCategory(category: string) {
    this.placeholderState.update(cur =>
      cur ? { ...cur, category: cur.category === category ? null : category } : null
    );
  }

  placeholdersByCategory(category: string): PlaceholderDef[] {
    return PLACEHOLDER_GROUPS.filter(p => p.category === category);
  }

  /**
   * Вставляет плейсхолдер в textarea под курсором.
   * Если курсор не в фокусе — добавляет в конец.
   */
  insertPlaceholder(colIndex: number, key: string, textarea: HTMLTextAreaElement) {
    const cols = this.columns();
    const currentContent = cols[colIndex]?.content ?? '';
    const placeholder = `{{${key}}}`;

    let newContent: string;

    // Пробуем вставить под курсором
    if (textarea && typeof textarea.selectionStart === 'number') {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      newContent = currentContent.slice(0, start) + placeholder + currentContent.slice(end);
      // После вставки возвращаем фокус и ставим курсор после вставленного плейсхолдера
      setTimeout(() => {
        textarea.focus();
        const pos = start + placeholder.length;
        textarea.setSelectionRange(pos, pos);
      });
    } else {
      // Если не можем определить позицию — добавляем в конец
      newContent = currentContent + (currentContent ? ' ' : '') + placeholder;
    }

    this.columns.update(cols => {
      const arr = [...cols];
      if (arr[colIndex]) {
        arr[colIndex] = { ...arr[colIndex], content: newContent };
      }
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
