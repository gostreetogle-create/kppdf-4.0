import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { OrderTaskService } from '../../core/order-task.service';
import { ProductionOrderService } from '../../core/production-order.service';
import type { OrderTask, ProductionOrder } from '../../../../shared/types/index.js';

const STATUS_COLORS: Record<string, string> = { pending: '#94a3b8', assigned: '#f59e0b', in_progress: '#3b82f6', done: '#22c55e', cancelled: '#ef4444' };

@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, KpCardComponent, KpBreadcrumbComponent, KpSelectComponent],
  template: `
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs()" />
      <div class="gantt-header">
        <h2 class="page__title">📊 Диаграмма Ганта</h2>
        <kp-select [options]="orderOptions()" [(ngModel)]="selectedOrderId" placeholder="Выберите заказ" styleClass="gantt-filter" (ngModelChange)="loadTasks()" />
      </div>

      @if (selectedOrderId() && tasks().length > 0) {
        <div class="gantt-chart" #ganttContainer>
          <!-- SVG-слой для стрелок зависимостей -->
          <svg class="gantt-svg" [attr.viewBox]="'0 0 ' + svgWidth() + ' ' + svgHeight()">
            @for (arrow of depArrows(); track arrow.from + '-' + arrow.to) {
              <line [attr.x1]="arrow.x1" [attr.y1]="arrow.y1" [attr.x2]="arrow.x2" [attr.y2]="arrow.y2"
                stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,3"
                marker-end="url(#arrowhead)" />
            }
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#94a3b8" />
              </marker>
            </defs>
          </svg>

          <!-- Шкала времени -->
          <div class="gantt-timeline">
            <div class="gantt-axis">
              @for (day of dateRange(); track day) {
                <div class="gantt-axis__label">{{ day }}</div>
              }
            </div>
            <!-- Полосы задач -->
            @for (task of tasks(); track task.id) {
              <div class="gantt-row">
                <div class="gantt-row__label">
                  <span class="gantt-row__comp">{{ task.componentName }}</span>
                  <span class="gantt-row__work">
                    {{ task.workTypeName }}
                    @if (task.workerId) {
                      <span class="gantt-row__worker">👷{{ task.workerId?.replace('wkr-', '') }}</span>
                    }
                  </span>
                </div>
                <div class="gantt-row__track">
                  <div class="gantt-bar"
                    [style.left]="barLeft(task) + '%'"
                    [style.width]="barWidth(task) + '%'"
                    [style.background]="barColor(task)"
                    [title]="task.componentName + ' — ' + task.workTypeName + ' (' + task.plannedHours + 'ч)' + (task.dependsOnTaskIds.length ? ' ⬅ зависит от ' + task.dependsOnTaskIds.length + ' задач' : '')"
                  >
                    <span class="gantt-bar__label">{{ task.plannedHours }}ч</span>
                  </div>
                  @if (task.actualStartDate && task.actualEndDate) {
                    <div class="gantt-bar gantt-bar--actual"
                      [style.left]="actualBarLeft(task) + '%'"
                      [style.width]="actualBarWidth(task) + '%'"
                    ></div>
                  }
                </div>
              </div>
            }
          </div>
          <!-- Легенда -->
          <div class="gantt-legend">
            <div class="gantt-legend__item"><span class="gantt-legend__swatch gantt-legend__swatch--plan"></span> План</div>
            <div class="gantt-legend__item"><span class="gantt-legend__swatch gantt-legend__swatch--actual"></span> Факт</div>
            <div class="gantt-legend__item"><span style="color:#94a3b8;font-size:1rem;">- - →</span> Зависимость</div>
            @for (s of statuses(); track s.key) {
              <div class="gantt-legend__item"><span class="gantt-legend__swatch" [style.background]="s.color"></span> {{ s.label }}</div>
            }
          </div>
        </div>
      } @else if (selectedOrderId()) {
        <p class="gantt-empty">Нет задач для выбранного заказа</p>
      } @else {
        <p class="gantt-empty">Выберите производственный заказ для отображения диаграммы</p>
      }
    </kp-card>
  `,
  styles: [`
    :host { display: block; max-width: 1300px; margin: 0 auto; padding: var(--space-6); }
    .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }
    .gantt-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); }
    .gantt-filter { width: 320px; }
    .gantt-empty { color: var(--color-text-secondary); font-style: italic; padding: var(--space-8); text-align: center; }
    .gantt-chart { overflow-x: auto; position: relative; }
    .gantt-svg { position: absolute; top: 28px; left: 200px; pointer-events: none; z-index: 1; }
    .gantt-timeline { min-width: 800px; position: relative; z-index: 2; }
    .gantt-axis { display: flex; border-bottom: 2px solid var(--color-border); margin-bottom: var(--space-1); }
    .gantt-axis__label { flex: 1; text-align: center; font-size: var(--font-size-xs); color: var(--color-text-muted); padding: var(--space-1) 0; min-width: 40px; }
    .gantt-row { display: flex; align-items: center; border-bottom: 1px solid var(--color-border); min-height: 44px; }
    .gantt-row__label { width: 200px; min-width: 200px; padding: var(--space-1) var(--space-2); display: flex; flex-direction: column; }
    .gantt-row__comp { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .gantt-row__work { font-size: var(--font-size-xs); color: var(--color-text-secondary); }
    .gantt-row__worker { margin-left: var(--space-1); color: var(--color-primary); }
    .gantt-row__track { flex: 1; position: relative; height: 44px; }
    .gantt-bar { position: absolute; top: 6px; height: 20px; border-radius: var(--radius-sm); display: flex; align-items: center; padding: 0 var(--space-1); min-width: 4px; }
    .gantt-bar__label { font-size: 10px; color: #fff; font-weight: var(--font-weight-bold); }
    .gantt-bar--actual { top: 28px; height: 8px; background: rgba(239, 68, 68, 0.6) !important; border-radius: 2px; }
    .gantt-legend { display: flex; gap: var(--space-4); margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid var(--color-border); flex-wrap: wrap; }
    .gantt-legend__item { display: flex; align-items: center; gap: var(--space-1); font-size: var(--font-size-xs); color: var(--color-text-secondary); }
    .gantt-legend__swatch { width: 12px; height: 12px; border-radius: 2px; }
    .gantt-legend__swatch--plan { background: #3b82f6; }
    .gantt-legend__swatch--actual { background: rgba(239, 68, 68, 0.6); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttChartComponent {
  private taskSvc = inject(OrderTaskService);
  private orderSvc = inject(ProductionOrderService);

  orders = signal<ProductionOrder[]>([]);
  selectedOrderId = signal('');
  tasks = signal<OrderTask[]>([]);
  allTasks = signal<OrderTask[]>([]);

  orderOptions = computed(() => this.orders().map(o => ({ label: `${o.number} — ${o.productName}`, value: o.id })));
  breadcrumbs = computed((): MenuItem[] => [{ label: '🏭 Производство' }, { label: 'Диаграмма Ганта' }]);
  statuses = computed(() => Object.entries(STATUS_COLORS).map(([key, color]) => ({
    key, color, label: { pending: 'Ожидает', assigned: 'Назначена', in_progress: 'В работе', done: 'Выполнена', cancelled: 'Отменена' }[key],
  })));

  /** Размеры SVG для стрелок */
  svgWidth = computed(() => this.totalDays() * 40 + 200);
  svgHeight = computed(() => Math.max(this.tasks().length * 44 + 20, 100));

  /** Вычисляем диапазон дат для шкалы */
  dateRange = computed(() => {
    const t = this.tasks();
    if (!t.length) return [];
    const dates: string[] = [];
    for (const task of t) {
      if (task.plannedStartDate) dates.push(task.plannedStartDate);
      if (task.plannedEndDate) dates.push(task.plannedEndDate);
      if (task.actualEndDate) dates.push(task.actualEndDate);
    }
    if (!dates.length) return [];
    dates.sort();
    const start = new Date(dates[0]!);
    const end = new Date(dates[dates.length - 1]!);
    const days: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(d.toISOString().substring(5, 10));
    }
    return days;
  });

  totalDays = computed(() => {
    const range = this.dateRange();
    return range.length || 1;
  });

  private dayIndex(date: string | undefined): number {
    if (!date) return 0;
    const range = this.dateRange();
    const idx = range.indexOf(date.substring(5, 10));
    return idx >= 0 ? idx : 0;
  }

  barLeft(task: OrderTask): number {
    return (this.dayIndex(task.plannedStartDate) / this.totalDays()) * 100;
  }
  barWidth(task: OrderTask): number {
    const days = this.dayIndex(task.plannedEndDate) - this.dayIndex(task.plannedStartDate) + 1;
    return Math.max((days / this.totalDays()) * 100, 2);
  }
  barColor(task: OrderTask): string {
    return STATUS_COLORS[task.status] || '#94a3b8';
  }
  actualBarLeft(task: OrderTask): number {
    return (this.dayIndex(task.actualStartDate) / this.totalDays()) * 100;
  }
  actualBarWidth(task: OrderTask): number {
    const days = this.dayIndex(task.actualEndDate) - this.dayIndex(task.actualStartDate) + 1;
    return Math.max((days / this.totalDays()) * 100, 2);
  }

  /** Стрелки зависимостей для SVG */
  depArrows = computed(() => {
    const arrows: { from: string; to: string; x1: number; y1: number; x2: number; y2: number }[] = [];
    const t = this.tasks();
    const rowH = 44;
    const startX = 200; // ширина лейбла
    const totalW = this.totalDays() * 40;

    for (const task of t) {
      for (const depId of task.dependsOnTaskIds) {
        const dep = t.find(x => x.id === depId);
        if (!dep) continue;

        const fromIdx = t.indexOf(dep);
        const toIdx = t.indexOf(task);
        const fromEnd = this.dayIndex(dep.plannedEndDate);
        const toStart = this.dayIndex(task.plannedStartDate);

        const x1 = startX + (fromEnd / this.totalDays()) * totalW;
        const y1 = 28 + fromIdx * rowH + rowH / 2;
        const x2 = startX + (toStart / this.totalDays()) * totalW;
        const y2 = 28 + toIdx * rowH + rowH / 2;

        arrows.push({ from: depId, to: task.id, x1: Math.round(x1 * 10) / 10, y1, x2: Math.round(x2 * 10) / 10, y2 });
      }
    }
    return arrows;
  });

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
