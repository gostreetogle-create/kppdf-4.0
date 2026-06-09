import { Component, input, output, OnInit, afterNextRender, signal, ChangeDetectionStrategy, ElementRef, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { KpButtonComponent } from './kp-button.component';
import { KpBadgeComponent } from './kp-badge.component';

const STORAGE_PREFIX = 'kppdf:table-widths:';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'badge' | 'image';
}

/** Кастомная кнопка действия в строке таблицы */
export interface TableExtraAction {
  icon: string;
  severity: 'success' | 'info' | 'warn' | 'danger' | 'secondary';
  tooltip: string;
  /** Если задано — кнопка показывается только когда предикат возвращает true */
  visible?: (row: unknown) => boolean;
}

@Component({
  selector: 'kp-table',
  standalone: true,
  imports: [CommonModule, TableModule, TooltipModule, KpButtonComponent, KpBadgeComponent],
  template: `
    <p-table
      [value]="data()"
      [columns]="columns()"
      [rows]="rows()"
      [paginator]="paginator()"
      [loading]="loading()"
      [sortField]="sortField()"
      [sortOrder]="sortOrder()"
      [globalFilterFields]="searchFields()"
      stripedRows
      [resizableColumns]="resizable()"
      [columnResizeMode]="'expand'"
      (onColumnResize)="onColumnResize($event)"
      (onRowClick)="onRowClick($event)"
      [rowsPerPageOptions]="[10, 20, 50]"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Показано {first}-{last} из {totalRecords}"
    >
      <ng-template pTemplate="header" let-columns>
        <tr>
          @for (col of columns; track col.field) {
            <th pResizableColumn [id]="col.field" [pSortableColumn]="col.sortable ? col.field : ''" [style.width]="colWidthOverride(col.field) || col.width || 'auto'" [class.kp-table__th--right]="col.type === 'number' || col.type === 'date'">
              <div class="kp-table__th-inner">
                <span class="kp-table__th-text">{{ col.header }}</span>
                @if (col.sortable) { <p-sortIcon [field]="col.field" /> }
              </div>
            </th>
          }
          @if (showActions()) {
            <th class="kp-table__actions-header">Действия</th>
          }
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-rowData let-columns="columns">
        <tr>
          @for (col of columns; track col.field) {
            <td [class.kp-table__td--right]="col.type === 'number' || col.type === 'date'">
              @switch (col.type) {
                @case ('badge') {
                  <kp-badge [value]="rowData[col.field]" />
                }
                @case ('image') {
                  @if (rowData[col.field]) {
                    <img [src]="rowData[col.field]" class="kp-table__img" loading="lazy" />
                  } @else {
                    <span class="kp-table__no-img">—</span>
                  }
                }
                @default {
                  {{ rowData[col.field] }}
                }
              }
            </td>
          }
          @if (showActions()) {
            <td class="kp-table__actions">
              @for (act of extraActions(); track act.icon) {
                @if (!act.visible || act.visible(rowData)) {
                  <kp-button
                    [lucideIcon]="act.icon"
                    [severity]="act.severity"
                    [text]="true"
                    [rounded]="true"
                    [pTooltip]="act.tooltip"
                    tooltipPosition="top"
                    (buttonClick)="rowExtraAction.emit({ icon: act.icon, row: rowData })"
                  />
                }
              }
              @if (showAddToCart()) {
                <kp-button
                  lucideIcon="shopping-cart"
                  severity="success"
                  [text]="true"
                  [rounded]="true"
                  pTooltip="В корзину"
                  tooltipPosition="top"
                  (buttonClick)="rowAddToCart.emit(rowData)"
                />
              }
              @if (showView()) {
                <kp-button
                  lucideIcon="eye"
                  severity="info"
                  [text]="true"
                  [rounded]="true"
                  pTooltip="Просмотр"
                  tooltipPosition="top"
                  (buttonClick)="rowView.emit(rowData)"
                />
              }
              <kp-button
                lucideIcon="pencil"
                severity="secondary"
                [text]="true"
                [rounded]="true"
                pTooltip="Редактировать"
                tooltipPosition="top"
                (buttonClick)="rowEdit.emit(rowData)"
              />
              @if (showClone()) {
                <kp-button
                  lucideIcon="copy"
                  severity="info"
                  [text]="true"
                  [rounded]="true"
                  pTooltip="Клонировать"
                  tooltipPosition="top"
                  (buttonClick)="rowClone.emit(rowData)"
                />
              }
              <kp-button
                lucideIcon="trash-2"
                severity="danger"
                [text]="true"
                [rounded]="true"
                pTooltip="Удалить"
                tooltipPosition="top"
                (buttonClick)="rowDelete.emit(rowData)"
              />
            </td>
          }
        </tr>
      </ng-template>

      <ng-template pTemplate="emptymessage" let-columns>
        <tr>
          <td [attr.colspan]="columns.length + (showActions() ? 1 : 0)" class="kp-table__empty">
            {{ emptyMessage() }}
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: [`
    .kp-table__actions-header { min-width: 175px; white-space: nowrap; }

    /* Resize handle для колонок */
    :host ::ng-deep .p-column-resizer {
      cursor: col-resize;
      width: 8px;
    }
    :host ::ng-deep .p-column-resizer:hover {
      background: var(--color-primary);
      opacity: 0.3;
    }

    :host ::ng-deep .p-resizable-column {
      position: relative;
      overflow: hidden;
    }
    :host ::ng-deep .p-resizable-column:last-child .p-column-resizer {
      display: none;
    }

    .kp-table__th-inner {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
    }

    .kp-table__th--right .kp-table__th-inner {
      justify-content: flex-end;
    }

    .kp-table__td--right {
      text-align: right;
    }

    .kp-table__actions {
      display: flex;
      gap: 6px;
      white-space: nowrap;
      justify-content: center;
    }

    /* Кнопки действий — всегда видимый фон + чёткая рамка */
    .kp-table__actions ::ng-deep .p-button.p-button-text {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      transition: background var(--transition-spring), box-shadow var(--transition-spring), transform var(--transition-spring), border-color var(--transition-spring);
      border: 1.5px solid var(--color-border);
    }

    /* secondary (редактировать, ▲▼) */
    .kp-table__actions ::ng-deep .p-button.p-button-text.p-button-secondary {
      color: var(--color-text-secondary);
      background: var(--color-surface-alt);
      border-color: var(--color-border);
    }
    .kp-table__actions ::ng-deep .p-button.p-button-text.p-button-secondary:hover {
      color: var(--color-primary);
      background: var(--color-primary-subtle);
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 15%, transparent);
      transform: scale(1.08);
    }

    /* info (просмотр, клонировать) */
    .kp-table__actions ::ng-deep .p-button.p-button-text.p-button-info {
      color: var(--color-text-muted);
      background: var(--color-surface-alt);
      border-color: var(--color-border);
    }
    .kp-table__actions ::ng-deep .p-button.p-button-text.p-button-info:hover {
      color: var(--color-info);
      background: var(--color-info-bg);
      border-color: var(--color-info);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-info) 15%, transparent);
      transform: scale(1.08);
    }

    /* success (в корзину) */
    .kp-table__actions ::ng-deep .p-button.p-button-text.p-button-success {
      color: var(--color-text-muted);
      background: var(--color-surface-alt);
      border-color: var(--color-border);
    }
    .kp-table__actions ::ng-deep .p-button.p-button-text.p-button-success:hover {
      color: var(--color-success, #22c55e);
      background: color-mix(in srgb, var(--color-success, #22c55e) 8%, transparent);
      border-color: var(--color-success, #22c55e);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-success, #22c55e) 15%, transparent);
      transform: scale(1.08);
    }

    /* danger (удалить) */
    .kp-table__actions ::ng-deep .p-button.p-button-text.p-button-danger {
      color: var(--color-text-muted);
      background: var(--color-surface-alt);
      border-color: var(--color-border);
    }
    .kp-table__actions ::ng-deep .p-button.p-button-text.p-button-danger:hover {
      color: var(--color-error);
      background: var(--color-error-bg);
      border-color: var(--color-error);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-error) 15%, transparent);
      transform: scale(1.08);
    }

    .kp-table__empty {
      text-align: center;
      padding: var(--space-8) !important;
      color: var(--color-text-muted);
    }

    /* Миниатюра в таблице */
    .kp-table__img {
      width: 48px; height: 48px;
      object-fit: cover;
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      display: block;
    }
    .kp-table__no-img {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }

    /* Выравнивание данных в ячейках */
    :host ::ng-deep .p-datatable-table td {
      vertical-align: middle;
    }

    /* Hover-эффект на строке */
    :host ::ng-deep .p-datatable-table tbody tr:hover {
      background: var(--color-surface-hover);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpTableComponent implements OnInit {
  private elementRef = inject(ElementRef);
  data = input<unknown[]>([]);
  columns = input<TableColumn[]>([]);
  rows = input(20);
  paginator = input(true);
  loading = input(false);
  sortField = input('');
  sortOrder = input(1);
  searchFields = input<string[]>([]);
  showActions = input(true);
  showClone = input(false);
  showView = input(false);
  showAddToCart = input(false);
  /** Кастомные кнопки действий (статусы, workflow и т.д.) */
  extraActions = input<TableExtraAction[]>([]);
  emptyMessage = input('Нет данных');

  /** Ключ для localStorage (например 'organizations', 'doc-templates') */
  storageKey = input('');
  /** Включает/отключает ресайз колонок */
  resizable = input(true);

  readonly rowEdit = output<unknown>();
  readonly rowDelete = output<unknown>();
  readonly rowClone = output<unknown>();
  readonly rowView = output<unknown>();
  readonly rowAddToCart = output<unknown>();
  /** Срабатывает при клике на кастомную кнопку. payload = { icon, row } */
  readonly rowExtraAction = output<{ icon: string; row: unknown }>();
  readonly rowClick = output<unknown>();

  /** Событие при изменении ширины колонки */
  readonly columnResized = output<{ field: string; header: string; width: string }>();

  /** Локальный оверрайд ширин из localStorage */
  private savedWidths = signal<Record<string, string>>({});

  ngOnInit(): void {
    // Восстанавливаем сохранённые ширины в сигнал
    const saved = this.loadSavedWidths();
    if (Object.keys(saved).length > 0) {
      this.savedWidths.set(saved);
    }
  }

  constructor() {
    // Применяем сохранённые ширины после первого рендера
    // (PrimeNG перезаписывает [style.width] при init, поэтому применяем через DOM)
    afterNextRender(() => {
      const saved = this.savedWidths();
      const keys = Object.keys(saved);
      if (keys.length === 0) return;

      requestAnimationFrame(() => {
        for (const field of keys) {
          const th = this.elementRef.nativeElement.querySelector(`th[id="${field}"]`) as HTMLElement | null;
          if (th) {
            th.style.width = saved[field];
          }
        }
      });
    });
  }

  /** Возвращает сохранённую ширину для колонки, если есть */
  colWidthOverride(field: string): string | null {
    return this.savedWidths()[field] || null;
  }

  onRowClick(event: unknown): void {
    const evt = event as { data?: unknown } | null;
    this.rowClick.emit(evt?.data);
  }

  onColumnResize(event: unknown): void {
    const evt = event as { element?: HTMLElement } | undefined;
    const field = evt?.element?.id || '';
    const width = evt?.element?.style?.width || '';
    if (!field || !width) return;

    const header = evt?.element?.innerText?.trim() || '';

    // Сохраняем в localStorage
    this.saveColumnWidth(field, width);
    // Обновляем локальный сигнал
    this.savedWidths.update(w => ({ ...w, [field]: width }));

    // Оповещаем родителя
    this.columnResized.emit({ field, header, width });
  }

  private loadSavedWidths(): Record<string, string> {
    const key = this.storageKey();
    if (!key) return {};
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveColumnWidth(field: string, width: string): void {
    const key = this.storageKey();
    if (!key) return;
    try {
      const saved = this.loadSavedWidths();
      saved[field] = width;
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(saved));
    } catch {
      // localStorage недоступен — игнорируем
    }
  }
}
