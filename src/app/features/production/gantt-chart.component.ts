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
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttChartComponent {
  private taskSvc = inject(OrderTaskService);
  private orderSvc = inject(ProductionOrderService);
  private workerSvc = inject(WorkerService);

  readonly STATUS_LABELS = STATUS_LABELS;
  readonly STATUS_COLORS = STATUS_COLORS;

  orders = signal<ProductionOrder[]>([]);
  selectedOrderId = signal('');
  tasks = signal<OrderTask[]>([]);
  allTasks = signal<OrderTask[]>([]);
  zoom = signal<ZoomLevel>('day');

  hoveredTaskId = signal('');
  tooltipX = signal(0);
  tooltipY = signal(0);
  tooltipTask = computed(() => this.tasks().find(t => t.id === this.hoveredTaskId()));

  draggingTaskId = signal('');
  resizingTaskId = signal('');
  private dragStartX = 0;
  private dragStartLeft = 0;
  private dragStartWidth = 0;
  private dragOrigStart = '';
  private dragOrigEnd = '';

  statusVisibility = signal<Record<string, boolean>>({ pending: true, assigned: true, in_progress: true, done: true, cancelled: true });

  colWidth = computed(() => this.zoom() === 'day' ? 40 : this.zoom() === 'week' ? 28 : 18);

  orderOptions = computed(() => this.orders().map(o => ({ label: `${o.number} — ${o.productName}`, value: o.id })));
  breadcrumbs = computed((): MenuItem[] => [{ label: '🏭 Производство' }, { label: 'Диаграмма Ганта' }]);
  statuses = computed(() => Object.entries(STATUS_COLORS).map(([key, color]) => ({ key, color, label: STATUS_LABELS[key] || key })));

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

  statusFilters = computed(() => {
    const vis = this.statusVisibility();
    return Object.entries(STATUS_COLORS).map(([key, color]) => ({
      key, color, label: STATUS_LABELS[key] || key,
      visible: vis[key] ?? true,
      count: this.tasks().filter(t => t.status === key).length,
    }));
  });

  toggleStatus(key: string) { this.statusVisibility.update(v => ({ ...v, [key]: !(v[key] ?? true) })); }

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
    const todayStr = new Date().toISOString().substring(0, 10);
    const zoom = this.zoom();
    if (zoom === 'day') {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const iso = d.toISOString().substring(0, 10);
        const dow = d.getDay();
        cols.push({ label: d.toISOString().substring(5, 10), isWeekend: dow === 0 || dow === 6, isToday: iso === todayStr });
      }
    } else if (zoom === 'week') {
      const cur = new Date(start);
      while (cur <= end) {
        const weekEnd = new Date(cur); weekEnd.setDate(weekEnd.getDate() + 6);
        const label = `${cur.toISOString().substring(5, 10)}-${weekEnd.toISOString().substring(5, 10)}`;
        cols.push({ label, isWeekend: false, isToday: todayStr >= cur.toISOString().substring(0, 10) && todayStr <= weekEnd.toISOString().substring(0, 10) });
        cur.setDate(cur.getDate() + 7);
      }
    } else {
      const cur = new Date(start.getFullYear(), start.getMonth(), 1);
      while (cur <= end) {
        const monthEnd = new Date(cur.getFullYear(), cur.getMonth() + 1, 0);
        const label = cur.toLocaleString('ru', { month: 'short' });
        const monthStartIso = cur.toISOString().substring(0, 10);
        const monthEndIso = monthEnd.toISOString().substring(0, 10);
        cols.push({ label, isWeekend: false, isToday: todayStr >= monthStartIso && todayStr <= monthEndIso });
        cur.setMonth(cur.getMonth() + 1);
      }
    }
    return cols;
  });

  todayColumnIndex = computed(() => {
    if (this.zoom() !== 'day') return -1;
    return this.timelineColumns().findIndex(c => c.isToday);
  });

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
    return this.timelineColumns().findIndex(c => c.label === monthLabel);
  }

  private colIndex(date: string | undefined): number {
    const z = this.zoom();
    if (z === 'day') return this.dayIndex(date);
    if (z === 'week') return this.weekIndex(date);
    return this.monthIndex(date);
  }

  private durationInCols(start: string | undefined, end: string | undefined): number {
    if (!start || !end) return 1;
    return Math.max(this.colIndex(end) - this.colIndex(start) + 1, 1);
  }

  bars = computed((): GanttBar[] => this.tasks().map(task => {
    const left = this.colIndex(task.plannedStartDate) * this.colWidth();
    const width = this.durationInCols(task.plannedStartDate, task.plannedEndDate) * this.colWidth();
    return { task, left: Math.max(left, 0), width: Math.max(width, 4), color: STATUS_COLORS[task.status] || '#94a3b8', gradient: STATUS_GRADIENTS[task.status] || STATUS_GRADIENTS.pending };
  }));

  visibleBars = computed(() => {
    const vis = this.statusVisibility();
    return this.bars().filter(b => vis[b.task.status] ?? true);
  });

  actualLeft(task: OrderTask): number { return this.colIndex(task.actualStartDate) * this.colWidth(); }
  actualWidth(task: OrderTask): number { return Math.max(this.durationInCols(task.actualStartDate, task.actualEndDate) * this.colWidth(), 2); }
  workerName(wid: string): string { const w = this.workerSvc.getRawItems().find(x => x.id === wid); return w ? w.lastName : wid; }

  svgW = computed(() => this.timelineColumns().length * this.colWidth() + 240);
  svgH = computed(() => Math.max(this.visibleBars().length * 48 + 36, 100));

  depArrows = computed(() => {
    const arrows: { from: string; to: string; x1: number; y1: number; x2: number; y2: number; path: string }[] = [];
    const bars = this.visibleBars();
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

  onBarEnter(event: MouseEvent, taskId: string) {
    if (this.draggingTaskId() || this.resizingTaskId()) return;
    this.hoveredTaskId.set(taskId);
    this.tooltipX.set(event.clientX + 12);
    this.tooltipY.set(event.clientY + 12);
  }

  onBarLeave() {
    if (this.draggingTaskId() || this.resizingTaskId()) return;
    this.hoveredTaskId.set('');
  }

  depNames(depIds: string[]): string {
    return depIds.map(id => {
      const t = this.tasks().find(x => x.id === id);
      return t ? `${t.componentName} — ${t.workTypeName}` : id;
    }).join('; ');
  }

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
    if (this.hoveredTaskId() && !this.draggingTaskId() && !this.resizingTaskId()) {
      this.tooltipX.set(event.clientX + 12);
      this.tooltipY.set(event.clientY + 12);
    }
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
