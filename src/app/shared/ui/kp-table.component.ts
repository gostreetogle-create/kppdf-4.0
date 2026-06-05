import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { KpButtonComponent } from './kp-button.component';
import { KpBadgeComponent } from './kp-badge.component';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'badge';
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
      [rowsPerPageOptions]="[10, 20, 50]"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Показано {first}-{last} из {totalRecords}"
    >
      <ng-template pTemplate="header" let-columns>
        <tr>
          @for (col of columns; track col.field) {
            <th [pSortableColumn]="col.sortable ? col.field : ''" [style.width]="col.width || 'auto'" [class.kp-table__th--right]="col.type === 'number' || col.type === 'date'">
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
                @default {
                  {{ rowData[col.field] }}
                }
              }
            </td>
          }
          @if (showActions()) {
            <td class="kp-table__actions">
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
    .kp-table__actions-header { width: 175px; }

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
export class KpTableComponent {
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
  emptyMessage = input('Нет данных');

  readonly rowEdit = output<unknown>();
  readonly rowDelete = output<unknown>();
  readonly rowClone = output<unknown>();
  readonly rowView = output<unknown>();
}
