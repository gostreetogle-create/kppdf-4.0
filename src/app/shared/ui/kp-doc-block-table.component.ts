import { Component, input, output, signal, ChangeDetectionStrategy, inject, effect } from '@angular/core';
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
              @for (row of data; track trackByRow(row, $index)) {
                <tr>
                  @for (col of template.columns; track col.fieldName) {
                    <td>{{ getFieldValue(row, col.fieldName) }}</td>
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
    .table-block__preview { width: 100%; border-collapse: collapse; font-size: 11px; }
    .table-block__preview th,
    .table-block__preview td { border: 1px solid #d1d5db; padding: 2mm 3mm; text-align: left; }
    .table-block__preview th { background: #f3f4f6; font-weight: 600; }
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
  `]
})
export class KpDocBlockTableComponent {
  block = input.required<DocBlock>();
  mode = input<'template' | 'instance'>('template');
  editClick = output<DocBlock>();

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
      const isInstance = this.mode() === 'instance';

      if (tid) {
        try {
          const res = await firstValueFrom(this.templateService.getTemplate(tid));
          if (res.success && res.data) {
            this.tmpl.set(res.data);

            // В режиме instance загружаем реальные данные
            if (isInstance && res.data.columns.length > 0) {
              const tableName = res.data.columns[0].tableName;
              await this.loadTableData(tableName);
            }
          }
        } catch {
          this.tmpl.set(undefined);
          this.rows.set([]);
        }
      } else {
        this.tmpl.set(undefined);
        this.rows.set(null);
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

  /** Трек для строк таблицы (по id или индексу) */
  trackByRow(_row: Record<string, unknown>, index: number): number {
    return index;
  }
}
