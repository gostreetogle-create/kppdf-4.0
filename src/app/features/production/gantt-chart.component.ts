import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { OrderTaskService } from '../../core/order-task.service';
import { WorkerService } from '../../core/worker.service';
import { ProductionOrderService } from '../../core/production-order.service';
import type { OrderTask, ProductionOrder, TaskStatus } from '../../../../shared/types/index.js';

const STATUS_COLORS: Record<TaskStatus, string> = { pending: '#94a3b8', assigned: '#f59e0b', in_progress: '#3b82f6', done: '#22c55e', cancelled: '#ef4444' };
const STATUS_GRADIENTS: Record<TaskStatus, string> = { pending: 'linear-gradient(135deg, #94a3b8, #cbd5e1)', assigned: 'linear-gradient(135deg, #f59e0b, #fbbf24)', in_progress: 'linear-gradient(135deg, #3b82f6, #60a5fa)', done: 'linear-gradient(135deg, #22c55e, #4ade80)', cancelled: 'linear-gradient(135deg, #ef4444, #f87171)' };
const STATUS_LABELS: Record<string, string> = { pending: 'Ожидает', assigned: 'Назначена', in_progress: 'В работе', done: 'Выполнена', cancelled: 'Отменена' };

type ZoomLevel = 'day' | 'week' | 'month';

interface GanttBar { task: OrderTask; left: number; width: number; color: string; gradient: string; }

@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, KpCardComponent, KpBreadcrumbComponent, KpSelectComponent, KpButtonComponent],
  template: `
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs()" />
      <div class="gantt-header">
        <h2 class="gantt-title">📊 Диаграмма Ганта</h2>
        <div class="gantt-controls">
          <div class="gantt-zoom">
            <kp-button label="День" [severity]="zoom() === 'day' ? 'info' : 'secondary'" size="small" (clicked)="zoom.set('day')" />
            <kp-button label="Неделя" [severity]="zoom() === 'week' ? 'info' : 'secondary'" size="small" (clicked)="zoom.set('week')" />
            <kp-button label="Месяц" [severity]="zoom() === 'month' ? 'info' : 'secondary'" size="small" (clicked)="zoom.set('month')" />
          </div>
          <kp-select [options]="orderOptions()" [(ngModel)]="selectedOrderId" placeholder="Выберите заказ" styleClass="gantt-filter" (ngModelChange)="loadTasks()" />
        </div>
      </div>

      @if (selectedOrderId() && bars().length > 0) {

        <!-- Панель работников -->
        <div class="gantt-workers">
          <span class="gantt-workers__title">👷 Работники:</span>
          @for (w of workerSummary(); track w.id) {
            <span class="gantt-worker-badge" [class.gantt-worker-badge--busy]="w.busy" [class.gantt-worker-badge--free]="!w.busy"
              [title]="w.name + (w.busy ? ' — занят до ' + w.busyUntil : ' — свободен') + ' · ' + w.rate + '₽/ч'">
              {{ w.name }}
            </span>
          }
        </div>

        <!-- Фильтры статусов -->
        <div class="gantt-filters">
          @for (s of statusFilters(); track s.key) {
            <label class="gantt-filter-chip" [style.--chip-color]="s.color">
              <input type="checkbox" [checked]="s.visible" (change)="toggleStatus(s.key)" />
              <span class="gantt-filter-chip__label">{{ s.label }}</span>
              <span class="gantt-filter-chip__count">{{ s.count }}</span>
            </label>
          }
        </div>

        <div class="gantt-chart" (mousemove)="onMouseMove($event)" (mouseup)="onMouseUp()" (mouseleave)="onMouseUp()">
          <!-- Хедер с фиксированными лейблами и скроллящейся шкалой -->
          <div class="gantt-grid">
            <div class="gantt-grid__labels">
              <div class="gantt-grid__axis-label">Компонент / Работа</div>
              @for (bar of visibleBars(); track bar.task.id) {
                <div class="gantt-grid__row-label" [style.background]="bar.task.dependsOnTaskIds.length ? 'var(--color-surface)' : 'transparent'">
                  <span class="gantt-grid__comp">{{ bar.task.componentName }}</span>
                  <span class="gantt-grid__work">
                    {{ bar.task.workTypeName }}
                    @if (bar.task.workerId) { · 👷{{ workerName(bar.task.workerId) }} }
                  </span>
                </div>
              }
            </div>

            <div class="gantt-grid__timeline">
              <!-- Ось времени -->
              <div class="gantt-axis">
                @for (col of timelineColumns(); track col.label) {
                  <div class="gantt-axis__cell" [style.width.px]="colWidth()">
                    <span class="gantt-axis__label" [class.gantt-axis__label--today]="col.isToday">{{ col.label }}</span>
                  </div>
                }
              </div>
              <!-- Строки с полосами -->
              @for (bar of visibleBars(); track bar.task.id) {
                <div class="gantt-row">
                  <div class="gantt-row__track">
                    <!-- Фоновая сетка -->
                    @for (col of timelineColumns(); track col.label) {
                      <div class="gantt-row__cell" [style.width.px]="colWidth()" [class.gantt-row__cell--weekend]="col.isWeekend" [class.gantt-row__cell--today]="col.isToday"></div>
                    }
                    <!-- Полоса задачи -->
                    <div class="gantt-bar"
                      [style.left.px]="bar.left"
                      [style.width.px]="bar.width"
                      [style.background]="bar.gradient"
                      [class.gantt-bar--dragging]="draggingTaskId() === bar.task.id"
                      [class.gantt-bar--resizing]="resizingTaskId() === bar.task.id"
                      (mousedown)="onBarMouseDown($event, bar.task)"
                      title="{{ bar.task.componentName }} — {{ bar.task.workTypeName }} · {{ bar.task.plannedHours }}ч · {{ bar.task.plannedStartDate }} → {{ bar.task.plannedEndDate }}"
                    >
                      <span class="gantt-bar__label">{{ bar.task.plannedHours }}ч</span>
                      <!-- Ручка ресайза справа -->
                      <div class="gantt-bar__resize-handle" (mousedown)="onResizeMouseDown($event, bar.task)"></div>
                    </div>
                    <!-- Фактическая полоса -->
                    @if (bar.task.actualStartDate && bar.task.actualEndDate) {
                      <div class="gantt-actual"
                        [style.left.px]="actualLeft(bar.task)"
                        [style.width.px]="actualWidth(bar.task)"
                      ></div>
                    }
                  </div>
                </div>
              }
              <!-- Линия сегодня -->
              @if (todayColumnIndex() >= 0) {
                <div class="gantt-today-line" [style.left.px]="todayColumnIndex() * colWidth() + colWidth() / 2"></div>
              }
            </div>
          </div>

          <!-- SVG зависимости -->
          <svg class="gantt-svg" [attr.viewBox]="'0 0 ' + svgW() + ' ' + svgH()">
            @for (arrow of depArrows(); track arrow.from + '-' + arrow.to) {
              <line [attr.x1]="arrow.x1" [attr.y1]="arrow.y1" [attr.x2]="arrow.x2" [attr.y2]="arrow.y2"
                stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrowhead)" />
            }
            @for (arrow of depArrows(); track arrow.from + '-corner-' + arrow.to) {
              <path [attr.d]="arrow.path" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrowhead)" />
            }
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#94a3b8" />
              </marker>
            </defs>
          </svg>
        </div>

        <!-- Легенда -->
        <div class="gantt-legend">
          <div class="gantt-legend__item"><span class="gantt-legend__swatch gantt-legend__swatch--plan"></span> План</div>
          <div class="gantt-legend__item"><span class="gantt-legend__swatch gantt-legend__swatch--actual"></span> Факт</div>
          <div class="gantt-legend__item"><span class="gantt-legend__swatch gantt-legend__swatch--today"></span> Сегодня</div>
          <div class="gantt-legend__item"><span style="color:#94a3b8;">- - →</span> Зависимость</div>
          @for (s of statuses(); track s.key) {
            <div class="gantt-legend__item"><span class="gantt-legend__swatch" [style.background]="s.color"></span> {{ s.label }}</div>
          }
        </div>

      } @else if (selectedOrderId()) {
        <p class="gantt-empty">Нет задач для выбранного заказа</p>
      } @else {
        <p class="gantt-empty">Выберите производственный заказ для отображения диаграммы</p>
      }
    </kp-card>
  `,
  styles: [`
    :host { display: block; max-width: 100%; margin: 0 auto; padding: var(--space-6); }
    .gantt-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }
    .gantt-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); }
    .gantt-controls { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
    .gantt-zoom { display: flex; gap: 2px; background: var(--color-surface); border-radius: var(--radius-md); padding: 2px; }
    .gantt-filter { width: 320px; }

    /* Workers panel */
    .gantt-workers { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-3) 0; flex-wrap: wrap; border-bottom: 1px solid var(--color-border); margin-bottom: var(--space-3); }
    .gantt-workers__title { font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); color: var(--color-text-muted); margin-right: var(--space-1); }
    .gantt-worker-badge { font-size: var(--font-size-xs); padding: 2px 10px; border-radius: var(--radius-full); font-weight: var(--font-weight-medium); transition: all var(--transition-fast); }
    .gantt-worker-badge--free { background: #dcfce7; color: #166534; }
    .gantt-worker-badge--busy { background: #fef3c7; color: #92400e; }

    /* Status filters */
    .gantt-filters { display: flex; gap: var(--space-2); margin-bottom: var(--space-3); flex-wrap: wrap; }
    .gantt-filter-chip { display: flex; align-items: center; gap: var(--space-1); padding: 2px 10px; border-radius: var(--radius-full); background: var(--color-surface); border: 1px solid var(--chip-color, var(--color-border)); cursor: pointer; font-size: var(--font-size-xs); transition: all var(--transition-fast); user-select: none; }
    .gantt-filter-chip:has(input:checked) { background: color-mix(in srgb, var(--chip-color) 15%, transparent); border-color: var(--chip-color); }
    .gantt-filter-chip input { accent-color: var(--chip-color); cursor: pointer; }
    .gantt-filter-chip__count { color: var(--color-text-muted); font-size: 0.65rem; background: var(--color-bg); padding: 0 5px; border-radius: var(--radius-full); }

    /* Chart */
    .gantt-chart { position: relative; border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; background: var(--color-surface); }
    .gantt-grid { display: flex; }
    .gantt-grid__labels { flex-shrink: 0; width: 240px; min-width: 240px; border-right: 2px solid var(--color-border); background: var(--color-surface); z-index: 3; }
    .gantt-grid__axis-label { height: 36px; display: flex; align-items: center; padding: 0 var(--space-3); font-size: var(--font-size-xs); color: var(--color-text-muted); font-weight: var(--font-weight-semibold); border-bottom: 2px solid var(--color-border); }
    .gantt-grid__row-label { height: 48px; display: flex; flex-direction: column; justify-content: center; padding: 0 var(--space-3); border-bottom: 1px solid var(--color-border-light); }
    .gantt-grid__comp { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--color-text); }
    .gantt-grid__work { font-size: var(--font-size-xs); color: var(--color-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .gantt-grid__timeline { flex: 1; overflow-x: auto; overflow-y: hidden; position: relative; }
    .gantt-axis { display: flex; height: 36px; border-bottom: 2px solid var(--color-border); position: sticky; top: 0; background: var(--color-surface); z-index: 2; }
    .gantt-axis__cell { flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-right: 1px solid var(--color-border-light); }
    .gantt-axis__label { font-size: 0.6rem; color: var(--color-text-muted); text-align: center; white-space: nowrap; }
    .gantt-axis__label--today { color: #ef4444; font-weight: var(--font-weight-bold); }

    .gantt-row { height: 48px; position: relative; }
    .gantt-row__track { height: 100%; position: relative; display: flex; }
    .gantt-row__cell { flex-shrink: 0; height: 100%; border-right: 1px solid var(--color-border-light); border-bottom: 1px solid var(--color-border-light); }
    .gantt-row__cell--weekend { background: rgba(0,0,0,0.015); }
    .gantt-row__cell--today { background: rgba(239,68,68,0.03); }

    /* Bars */
    .gantt-bar { position: absolute; top: 8px; height: 32px; border-radius: 6px; display: flex; align-items: center; padding: 0 10px; min-width: 8px; cursor: grab; transition: box-shadow 0.15s, filter 0.15s; z-index: 3; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
    .gantt-bar:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.2); filter: brightness(1.08); z-index: 5; }
    .gantt-bar:active { cursor: grabbing; }
    .gantt-bar--dragging { box-shadow: 0 8px 24px rgba(0,0,0,0.25) !important; filter: brightness(1.12) !important; z-index: 10 !important; opacity: 0.9; }
    .gantt-bar--resizing { z-index: 10 !important; }
    .gantt-bar__label { font-size: 11px; color: #fff; font-weight: var(--font-weight-bold); text-shadow: 0 1px 2px rgba(0,0,0,0.3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .gantt-bar__resize-handle { position: absolute; right: 0; top: 0; bottom: 0; width: 8px; cursor: ew-resize; border-radius: 0 6px 6px 0; transition: background 0.15s; }
    .gantt-bar__resize-handle:hover { background: rgba(255,255,255,0.3); }

    /* Actual bar */
    .gantt-actual { position: absolute; bottom: 3px; height: 6px; border-radius: 3px; background: rgba(239,68,68,0.5); z-index: 1; }

    /* Today line */
    .gantt-today-line { position: absolute; top: 0; bottom: 0; width: 2px; background: #ef4444; z-index: 4; pointer-events: none; opacity: 0.6; }
    .gantt-today-line::before { content: '▼'; position: absolute; top: 0; left: -5px; color: #ef4444; font-size: 10px; }

    /* SVG */
    .gantt-svg { position: absolute; top: 36px; left: 240px; pointer-events: none; z-index: 1; }

    /* Legend */
    .gantt-legend { display: flex; gap: var(--space-4); margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid var(--color-border); flex-wrap: wrap; }
    .gantt-legend__item { display: flex; align-items: center; gap: var(--space-1); font-size: var(--font-size-xs); color: var(--color-text-secondary); }
    .gantt-legend__swatch { width: 12px; height: 12px; border-radius: 2px; }
    .gantt-legend__swatch--plan { background: #3b82f6; }
    .gantt-legend__swatch--actual { background: rgba(239, 68, 68, 0.5); }
    .gantt-legend__swatch--today { background: #ef4444; }

    .gantt-empty { color: var(--color-text-secondary); font-style: italic; padding: var(--space-8); text-align: center; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttChartComponent {
  private taskSvc = inject(OrderTaskService);
  private orderSvc = inject(ProductionOrderService);
  private workerSvc = inject(WorkerService);

  orders = signal<ProductionOrder[]>([]);
  selectedOrderId = signal('');
  tasks = signal<OrderTask[]>([]);
  allTasks = signal<OrderTask[]>([]);
  zoom = signal<ZoomLevel>('day');

  // Drag-and-drop state
  draggingTaskId = signal('');
  resizingTaskId = signal('');
  private dragStartX = 0;
  private dragStartLeft = 0;
  private dragStartWidth = 0;
  private dragOrigStart = '';
  private dragOrigEnd = '';

  // Status filter state
  statusVisibility = signal<Record<string, boolean>>({ pending: true, assigned: true, in_progress: true, done: true, cancelled: true });

  colWidth = computed(() => this.zoom() === 'day' ? 40 : this.zoom() === 'week' ? 28 : 18);

  orderOptions = computed(() => this.orders().map(o => ({ label: `${o.number} — ${o.productName}`, value: o.id })));
  breadcrumbs = computed((): MenuItem[] => [{ label: '🏭 Производство' }, { label: 'Диаграмма Ганта' }]);
  statuses = computed(() => Object.entries(STATUS_COLORS).map(([key, color]) => ({ key, color, label: STATUS_LABELS[key] || key })));

  /** Summary of workers: free vs busy */
  workerSummary = computed(() => {
    const workers = this.workerSvc.getRawItems().filter(w => w.isActive);
    const busyUntil = new Map<string, string>();
    for (const t of this.tasks()) {
      if (t.workerId && (t.status === 'assigned' || t.status === 'in_progress')) {
        const cur = busyUntil.get(t.workerId);
        const end = t.actualEndDate || t.plannedEndDate || '';
        if (!cur || end > cur) busyUntil.set(t.workerId, end);
      }
    }
    return workers.map(w => ({
      id: w.id, name: w.lastName, busy: busyUntil.has(w.id),
      busyUntil: busyUntil.get(w.id) || '', rate: w.ratePerHour,
    }));
  });

  /** Status filter chips */
  statusFilters = computed(() => {
    const vis = this.statusVisibility();
    return Object.entries(STATUS_COLORS).map(([key, color]) => ({
      key, color,
      label: STATUS_LABELS[key] || key,
      visible: vis[key] ?? true,
      count: this.tasks().filter(t => t.status === key).length,
    }));
  });

  toggleStatus(key: string) {
    this.statusVisibility.update(v => ({ ...v, [key]: !(v[key] ?? true) }));
  }

  /** Timeline columns based on zoom */
  timelineColumns = computed(() => {
    const t = this.tasks();
    if (!t.length) return [];
    const dates: string[] = [];
    for (const task of t) { if (task.plannedStartDate) dates.push(task.plannedStartDate); if (task.plannedEndDate) dates.push(task.plannedEndDate); if (task.actualEndDate) dates.push(task.actualEndDate); }
    if (!dates.length) return [];
    dates.sort();
    const start = new Date(dates[0]!); start.setDate(start.getDate() - 1);
    const end = new Date(dates[dates.length - 1]!); end.setDate(end.getDate() + 1);
    const cols: { label: string; isWeekend: boolean; isToday: boolean }[] = [];
    const today = new Date().toISOString().substring(0, 10);
    const zoom = this.zoom();

    if (zoom === 'day') {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const iso = d.toISOString().substring(0, 10);
        const dow = d.getDay();
        cols.push({ label: d.toISOString().substring(5, 10), isWeekend: dow === 0 || dow === 6, isToday: iso === today });
      }
    } else if (zoom === 'week') {
      const cur = new Date(start);
      while (cur <= end) {
        const weekEnd = new Date(cur); weekEnd.setDate(weekEnd.getDate() + 6);
        const label = `${cur.toISOString().substring(5, 10)}-${weekEnd.toISOString().substring(5, 10)}`;
        const weekStr = `${cur.getFullYear()}-W${Math.ceil((cur.getDate() + (new Date(cur.getFullYear(), 0, 1).getDay() || 7) - 1) / 7)}`;
        cols.push({ label, isWeekend: false, isToday: today >= cur.toISOString().substring(0, 10) && today <= weekEnd.toISOString().substring(0, 10) });
        cur.setDate(cur.getDate() + 7);
      }
    } else {
      // month
      let cur = new Date(start.getFullYear(), start.getMonth(), 1);
      while (cur <= end) {
        const monthEnd = new Date(cur.getFullYear(), cur.getMonth() + 1, 0);
        const label = cur.toLocaleString('ru', { month: 'short' });
        const monthStartIso = cur.toISOString().substring(0, 10);
        const monthEndIso = monthEnd.toISOString().substring(0, 10);
        cols.push({ label, isWeekend: false, isToday: today >= monthStartIso && today <= monthEndIso });
        cur.setMonth(cur.getMonth() + 1);
      }
    }
    return cols;
  });

  todayColumnIndex = computed(() => {
    const today = new Date().toISOString().substring(0, 10);
    if (this.zoom() !== 'day') return -1;
    return this.timelineColumns().findIndex(c => c.isToday);
  });

  /** Convert dates to pixel positions */
  private dayIndex(date: string | undefined): number {
    if (!date || this.zoom() !== 'day') return 0;
    const cols = this.timelineColumns();
    const idx = cols.findIndex(c => c.label === date.substring(5, 10));
    return idx >= 0 ? idx : 0;
  }

  private weekIndex(date: string | undefined): number {
    if (!date || this.zoom() !== 'week') return 0;
    const d = new Date(date);
    const cols = this.timelineColumns();
    for (let i = 0; i < cols.length; i++) {
      const [sm, sd] = cols[i]!.label.split('-');
      const start = new Date(`2026-${sm}-${sd}`);
      const end = new Date(start); end.setDate(end.getDate() + 6);
      if (d >= start && d <= end) return i;
    }
    return 0;
  }

  private monthIndex(date: string | undefined): number {
    if (!date || this.zoom() !== 'month') return 0;
    const d = new Date(date);
    const monthLabel = d.toLocaleString('ru', { month: 'short' });
    const cols = this.timelineColumns();
    const idx = cols.findIndex(c => c.label === monthLabel);
    return idx >= 0 ? idx : 0;
  }

  private colIndex(date: string | undefined): number {
    const z = this.zoom();
    if (z === 'day') return this.dayIndex(date);
    if (z === 'week') return this.weekIndex(date);
    return this.monthIndex(date);
  }

  private durationInCols(start: string | undefined, end: string | undefined): number {
    if (!start || !end) return 1;
    const si = this.colIndex(start);
    const ei = this.colIndex(end);
    return Math.max(ei - si + 1, 1);
  }

  /** All bars with pixel positions */
  bars = computed((): GanttBar[] => {
    return this.tasks().map(task => {
      const left = this.colIndex(task.plannedStartDate) * this.colWidth();
      const width = this.durationInCols(task.plannedStartDate, task.plannedEndDate) * this.colWidth();
      return { task, left: Math.max(left, 0), width: Math.max(width, 4), color: STATUS_COLORS[task.status] || '#94a3b8', gradient: STATUS_GRADIENTS[task.status] || STATUS_GRADIENTS.pending };
    });
  });

  visibleBars = computed(() => {
    const vis = this.statusVisibility();
    return this.bars().filter(b => vis[b.task.status] ?? true);
  });

  actualLeft(task: OrderTask): number { return this.colIndex(task.actualStartDate) * this.colWidth(); }
  actualWidth(task: OrderTask): number { return Math.max(this.durationInCols(task.actualStartDate, task.actualEndDate) * this.colWidth(), 2); }
  workerName(wid: string): string { const w = this.workerSvc.getRawItems().find(x => x.id === wid); return w ? w.lastName : wid; }

  // SVG dimensions
  svgW = computed(() => this.timelineColumns().length * this.colWidth() + 240);
  svgH = computed(() => Math.max(this.visibleBars().length * 48 + 36, 100));
  depArrows = computed(() => {
    const arrows: { from: string; to: string; x1: number; y1: number; x2: number; y2: number; path: string }[] = [];
    const bars = this.visibleBars();
    const cw = this.colWidth();
    const labelW = 240; const headerH = 36; const rowH = 48;
    for (const bar of bars) {
      for (const depId of bar.task.dependsOnTaskIds) {
        const depBar = bars.find(b => b.task.id === depId);
        if (!depBar) continue;
        const fromIdx = bars.indexOf(depBar); const toIdx = bars.indexOf(bar);
        const x1 = labelW + depBar.left + depBar.width;
        const y1 = headerH + fromIdx * rowH + rowH / 2;
        const x2 = labelW + bar.left;
        const y2 = headerH + toIdx * rowH + rowH / 2;
        const midX = (x1 + x2) / 2;
        arrows.push({ from: depId, to: bar.task.id, x1, y1, x2, y2, path: `M${x1},${y1} L${midX},${y1} L${midX},${y2} L${x2},${y2}` });
      }
    }
    return arrows;
  });

  // ═══ Drag & Drop ═══

  onBarMouseDown(event: MouseEvent, task: OrderTask) {
    if ((event.target as HTMLElement).classList.contains('gantt-bar__resize-handle')) return;
    event.preventDefault();
    this.draggingTaskId.set(task.id);
    this.dragStartX = event.clientX;
    this.dragStartLeft = this.colIndex(task.plannedStartDate) * this.colWidth();
    this.dragOrigStart = task.plannedStartDate || '';
    this.dragOrigEnd = task.plannedEndDate || '';
  }

  onResizeMouseDown(event: MouseEvent, task: OrderTask) {
    event.preventDefault();
    event.stopPropagation();
    this.resizingTaskId.set(task.id);
    this.dragStartX = event.clientX;
    this.dragStartWidth = this.durationInCols(task.plannedStartDate, task.plannedEndDate) * this.colWidth();
  }

  onMouseMove(event: MouseEvent) {
    const cw = this.colWidth();
    if (this.draggingTaskId()) {
      const dx = event.clientX - this.dragStartX;
      const colShift = Math.round(dx / cw);
      if (colShift === 0) return;
      const id = this.draggingTaskId();
      const task = this.tasks().find(t => t.id === id);
      if (!task || !this.dragOrigStart || !this.dragOrigEnd) return;

      const origSi = this.colIndex(this.dragOrigStart);
      const origEi = this.colIndex(this.dragOrigEnd);
      const newSi = origSi + colShift;
      const newEi = origEi + colShift;
      const cols = this.timelineColumns();
      if (newSi < 0 || newEi >= cols.length) return;

      const newStart = this.colDate(newSi); if (!newStart) return;
      const newEnd = this.colDate(newEi); if (!newEnd) return;

      const updated = { ...task, plannedStartDate: newStart, plannedEndDate: newEnd };
      this.tasks.update(arr => arr.map(t => t.id === id ? updated : t));
    }
    if (this.resizingTaskId()) {
      const dx = event.clientX - this.dragStartX;
      const colShift = Math.round(dx / cw);
      if (colShift === 0) return;
      const id = this.resizingTaskId();
      const task = this.tasks().find(t => t.id === id);
      if (!task || !task.plannedStartDate) return;
      const origEi = this.colIndex(task.plannedEndDate);
      const newEi = origEi + colShift;
      const cols = this.timelineColumns();
      if (newEi >= cols.length || newEi < this.colIndex(task.plannedStartDate)) return;
      const newEnd = this.colDate(newEi); if (!newEnd) return;
      const updated = { ...task, plannedEndDate: newEnd };
      this.tasks.update(arr => arr.map(t => t.id === id ? updated : t));
    }
  }

  onMouseUp() {
    if (this.draggingTaskId()) {
      const task = this.tasks().find(t => t.id === this.draggingTaskId());
      if (task) { firstValueFrom(this.taskSvc.updateDates(task.id, task.plannedStartDate, task.plannedEndDate)); }
    }
    if (this.resizingTaskId()) {
      const task = this.tasks().find(t => t.id === this.resizingTaskId());
      if (task) { firstValueFrom(this.taskSvc.updateDates(task.id, undefined, task.plannedEndDate)); }
    }
    this.draggingTaskId.set(''); this.resizingTaskId.set('');
  }

  private static RU_MONTHS: Record<string, number> = {
    'янв.': 0, 'февр.': 1, 'март': 2, 'апр.': 3, 'май': 4, 'мая': 4,
    'июнь': 5, 'июль': 6, 'авг.': 7, 'сент.': 8, 'окт.': 9, 'нояб.': 10, 'дек.': 11,
  };

  private colDate(index: number): string | null {
    const cols = this.timelineColumns();
    if (index < 0 || index >= cols.length) return null;
    const label = cols[index]!.label;
    const z = this.zoom();
    if (z === 'day') return `2026-${label}`;
    if (z === 'week') {
      const [sm, sd] = label.split('-');
      return `2026-${sm}-${sd}`;
    }
    // month: use dictionary for robust parsing
    const m = GanttChartComponent.RU_MONTHS[label];
    const monthStr = String(m !== undefined ? m + 1 : 1).padStart(2, '0');
    return `2026-${monthStr}-01`;
  }

  constructor() { this.load(); }
  async load() {
    const [tasks, orders] = await Promise.all([firstValueFrom(this.taskSvc.getTasks()), firstValueFrom(this.orderSvc.getAll())]);
    this.allTasks.set(tasks.data); this.orders.set(orders.data);
    if (orders.data.length > 0) { this.selectedOrderId.set(orders.data[0]!.id); this.loadTasks(); }
  }
  loadTasks() {
    const oid = this.selectedOrderId();
    this.tasks.set(oid ? this.allTasks().filter(t => t.productionOrderId === oid).sort((a, b) => a.sortOrder - b.sortOrder) : []);
  }
}
