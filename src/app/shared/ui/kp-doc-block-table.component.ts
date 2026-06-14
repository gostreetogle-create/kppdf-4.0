import { Component, input, output, signal, computed, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import type { DocBlock, TableTemplate } from '../../../../shared/types/index.js';
import { TableTemplateService } from '../../core/table-template.service.js';
import { ApiService } from '../../core/api.service.js';

/** API-путь по имени таблицы */
function tableNameToApiPath(name: string): string {
  return '/' + name;
}

@Component({
  selector: 'kp-doc-block-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-block">
      @if (block().title) {
        <div class="table-block__title">{{ block().title }}</div>
      }
      @if (tmpl(); as template) {
        @if (rows(); as data) {
          <table class="table-block__preview">
            <thead>
              <tr>
                @for (col of template.columns; track col.fieldName) {
                  <th [style.width]="col.width || 'auto'">{{ col.label }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of data; track trackByRow(row, $index); let i = $index) {
                <tr class="table-block__data-row" (click)="onRowClick(row, i)">
                  @for (col of template.columns; track col.fieldName) {
                    <td [class.table-block__td-num]="isNumericField(col.fieldName)">{{ getFieldValue(row, col.fieldName) }}</td>
                  }
                </tr>
              }
              @if (data.length === 0) {
                <tr>
                  <td [attr.colspan]="template.columns.length" class="table-block__empty-row">
                    Нет данных
                  </td>
                </tr>
              }
            </tbody>
            @if (data.length > 0 && columnSummaries(); as sums) {
              <tfoot>
                <tr class="table-block__footer-row">
                  @for (col of template.columns; track col.fieldName) {
                    <td [class.table-block__td-num]="isNumericField(col.fieldName)">
                      @if (sums[col.fieldName] !== undefined) {
                        <strong>{{ formatSum(sums[col.fieldName], col.fieldName) }}</strong>
                      }
                    </td>
                  }
                </tr>
                @for (fr of footerRows(); track fr.label) {
                  <tr class="table-block__footer-row table-block__footer-row--extra">
                    <td [attr.colspan]="template.columns.length" class="table-block__footer-extra-cell">
                      <span class="table-block__footer-label">{{ fr.label }}</span>
                      <strong>{{ fr.value }}</strong>
                    </td>
                  </tr>
                }
              </tfoot>
            }
          </table>
        } @else {
          <table class="table-block__preview">
            <thead>
              <tr>
                @for (col of template.columns; track col.fieldName) {
                  <th [style.width]="col.width || 'auto'">{{ col.label }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @if (mode() === 'template') {
                <tr>
                  @for (col of template.columns; track col.fieldName) {
                    <td class="table-block__placeholder">{{ '{' + '{' + col.fieldName + '}' + '}' }}</td>
                  }
                </tr>
              } @else {
                <tr>
                  <td [attr.colspan]="template.columns.length" class="table-block__loading">
                    Загрузка данных...
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      } @else {
        <div class="table-block__empty">
          Двойной клик для выбора шаблона таблицы
        </div>
      }
    </div>
  `,
  styles: [`
    .table-block {
      padding: 5mm;
      border: 1px dashed transparent;
      border-radius: 2px;
      transition: border-color 0.15s ease;
    }
    .table-block__title { font-weight: 600; margin-bottom: 2mm; }

    .table-block__preview {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 11px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      overflow: hidden;
    }
    .table-block__preview th,
    .table-block__preview td {
      border-bottom: 1px solid #d1d5db;
      border-right: 1px solid #d1d5db;
      padding: 2mm 3mm;
      text-align: left;
    }
    .table-block__preview th:last-child,
    .table-block__preview td:last-child {
      border-right: none;
    }
    .table-block__preview th {
      background: transparent;
      font-weight: 700;
      border-bottom: 2px solid #94a3b8;
    }
    .table-block__preview tbody tr:last-child td {
      border-bottom: none;
    }

    .table-block__placeholder { color: #9ca3af; font-style: italic; }
    .table-block__empty {
      text-align: center; padding: 8mm; color: #9ca3af;
      border: 1px dashed #d1d5db; border-radius: 4px;
    }
    .table-block__loading {
      text-align: center; padding: 4mm; color: #9ca3af; font-style: italic;
    }
    .table-block__empty-row {
      text-align: center; padding: 4mm; color: #9ca3af;
    }

    .table-block__td-num { text-align: right; font-variant-numeric: tabular-nums; }

    /* Строка итогов (суммы по колонкам) */
    .table-block__footer-row {
      font-weight: 700;
      background: transparent;
    }
    .table-block__footer-row td {
      border-top: 2px solid #94a3b8;
      padding: 2mm 3mm;
    }

    /* Дополнительные строки подвала (Итого, НДС, К оплате) — прозрачный фон, правое выравнивание */
    .table-block__footer-row--extra td {
      border-top: none;
      border-bottom: none;
      padding: 1mm 3mm;
      font-weight: 600;
    }
    .table-block__footer-label {
      color: #64748b;
      font-weight: 600;
      margin-right: 6px;
    }
    .table-block__footer-extra-cell {
      text-align: right;
      white-space: nowrap;
      border: none !important;
    }
    .table-block__footer-extra-cell .table-block__footer-label {
      margin-right: 6px;
    }

    .table-block__data-row {
      cursor: pointer;
      transition: background 0.12s ease;
    }
    .table-block__data-row:hover {
      background: rgba(148, 163, 184, 0.1);
    }
    .table-block__data-row:active {
      background: rgba(148, 163, 184, 0.18);
    }
  `]
})
export class KpDocBlockTableComponent {
  block = input.required<DocBlock>();
  mode = input<'template' | 'instance'>('template');
  editClick = output<DocBlock>();
  /** Клик по строке данных (для интерактивного режима) */
  rowClick = output<{ row: Record<string, unknown>; index: number }>();

  private templateService = inject(TableTemplateService);
  private api = inject(ApiService);
  tmpl = signal<TableTemplate | undefined>(undefined);
  rows = signal<Record<string, unknown>[] | null>(null);
  loadingData = signal(false);

  constructor() {
    // Загружаем шаблон таблицы и данные при изменении ID
    effect(async () => {
      const block = this.block();
      const tid = block.tableTemplateId;
      const inlineData = block._inlineRows;
      // Если есть инлайн-данные (из витрины/КП) — используем их вместо API
      const effectiveMode = inlineData ? 'instance' : this.mode();

      if (inlineData) {
        this.rows.set(inlineData);
      }

      if (tid) {
        try {
          const res = await firstValueFrom(this.templateService.getTemplate(tid));
          if (res.success && res.data) {
            this.tmpl.set(res.data);

            // В режиме instance загружаем реальные данные, если нет инлайн-данных
            if (!inlineData && effectiveMode === 'instance' && res.data.columns.length > 0) {
              const tableName = res.data.columns[0].tableName;
              await this.loadTableData(tableName);
            }
          }
        } catch {
          this.tmpl.set(undefined);
          if (!inlineData) this.rows.set([]);
        }
      } else {
        this.tmpl.set(undefined);
        if (!inlineData) this.rows.set(null);
      }
    });
  }

  /** Загрузить данные из API по имени таблицы */
  private async loadTableData(tableName: string) {
    this.loadingData.set(true);
    try {
      const apiPath = tableNameToApiPath(tableName);          const res = await firstValueFrom(this.api.get<Record<string, unknown>[]>(apiPath));
          if (res.success && Array.isArray(res.data)) {
            this.rows.set(res.data);
          } else {
            this.rows.set([]);
          }
    } catch {
      this.rows.set([]);
    } finally {
      this.loadingData.set(false);
    }
  }

  /** Итоговые суммы по колонкам (из _inlineRows + _columnSummaries) */
  columnSummaries = computed(() => {
    const block = this.block();
    const data = this.rows();
    if (!data || data.length === 0) return null;

    const tmpl = this.tmpl();
    if (!tmpl) return null;

    const sums: Record<string, number> = { ...(block._columnSummaries || {}) };

    // Суммируем числовые поля из данных
    for (const col of tmpl.columns) {
      if (this.isNumericField(col.fieldName) && sums[col.fieldName] === undefined) {
        sums[col.fieldName] = data.reduce((acc, row) => {
          const val = row[col.fieldName];
          return acc + (typeof val === 'number' ? val : 0);
        }, 0);
      }
    }

    return sums;
  });

  /** Дополнительные строки подвала */
  footerRows = computed(() => {
    return this.block()._footerRows || [];
  });

  /** Проверить, является ли поле числовым (цена, сумма, количество) */
  isNumericField(fieldName: string): boolean {
    const numKeywords = ['price', 'total', 'sum', 'amount', 'quantity', 'count', 'weight', 'percent', 'markup'];
    const lower = fieldName.toLowerCase();
    const isNumeric = numKeywords.some(kw => lower.includes(kw));
    if (isNumeric) return true;
    // Fallback: если хоть одна строка содержит число в этом поле
    const data = this.rows();
    if (data && data.length > 0) {
      return typeof data[0][fieldName] === 'number';
    }
    return false;
  }

  /** Форматировать сумму с символом валюты */
  formatSum(val: number, fieldName: string): string {
    const lower = fieldName.toLowerCase();
    if (lower.includes('percent') || lower.includes('markup')) {
      return val.toLocaleString('ru-RU') + '%';
    }
    if (lower.includes('weight') || lower.includes('kg')) {
      return val.toLocaleString('ru-RU') + ' кг';
    }
    if (lower.includes('price') || lower.includes('total') || lower.includes('sum') || lower.includes('amount')) {
      return val.toLocaleString('ru-RU') + ' ₽';
    }
    return val.toLocaleString('ru-RU');
  }

  /** Получить значение поля из строки с форматированием */
  getFieldValue(row: Record<string, unknown>, fieldName: string): string {
    const val = row[fieldName];
    if (val === null || val === undefined) return '—';
    if (typeof val === 'boolean') return val ? '✓' : '—';
    if (typeof val === 'number') {
      // Цены, суммы — с форматированием
      if (fieldName.toLowerCase().includes('price') || fieldName.toLowerCase().includes('total') || fieldName.toLowerCase().includes('sum')) {
        return val.toLocaleString('ru-RU') + ' ₽';
      }
      // Проценты
      if (fieldName.toLowerCase().includes('percent') || fieldName.toLowerCase().includes('markup')) {
        return val + '%';
      }
      // Вес
      if (fieldName.toLowerCase().includes('weight') || fieldName.toLowerCase().includes('kg')) {
        return val.toLocaleString('ru-RU') + ' кг';
      }
      return val.toLocaleString('ru-RU');
    }
    return String(val);
  }

  /** Клик по строке данных */
  onRowClick(row: Record<string, unknown>, index: number): void {
    this.rowClick.emit({ row, index });
  }

  /** Трек для строк таблицы (по id или индексу) */
  trackByRow(_row: Record<string, unknown>, index: number): number {
    return index;
  }
}
