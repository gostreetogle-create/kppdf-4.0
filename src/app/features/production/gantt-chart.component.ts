import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpDatepickerComponent } from '../../shared/ui/kp-datepicker.component';
import { OrderTaskService } from '../../core/order-task.service';
import { WorkerService } from '../../core/worker.service';
import { ProductionOrderService } from '../../core/production-order.service';
import { ProductService } from '../../core/product.service';
import { OrganizationService } from '../../core/organization.service';
import type { OrderTask, ProductionOrder, Product, Organization, Worker, TaskStatus } from '../../../../shared/types/index.js';

const STATUS_COLORS: Record<TaskStatus, string> = { pending: '#94a3b8', assigned: '#f59e0b', in_progress: '#3b82f6', done: '#22c55e', cancelled: '#ef4444' };
const STATUS_GRADIENTS: Record<TaskStatus, string> = { pending: 'linear-gradient(135deg, #94a3b8, #cbd5e1)', assigned: 'linear-gradient(135deg, #f59e0b, #fbbf24)', in_progress: 'linear-gradient(135deg, #3b82f6, #60a5fa)', done: 'linear-gradient(135deg, #22c55e, #4ade80)', cancelled: 'linear-gradient(135deg, #ef4444, #f87171)' };
const STATUS_LABELS: Record<string, string> = { pending: 'Ожидает', assigned: 'Назначена', in_progress: 'В работе', done: 'Выполнена', cancelled: 'Отменена' };

type ZoomLevel = 'day' | 'week' | 'month';

interface GanttBar { task: OrderTask; left: number; width: number; color: string; gradient: string; }

interface GanttGroup { workTypeId: string; workTypeName: string; bars: GanttBar[]; }

interface LayoutRow { type: 'group' | 'bar'; groupName?: string; groupId?: string; bar?: GanttBar; barCount?: number; }

@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, KpCardComponent, KpBreadcrumbComponent, KpSelectComponent, KpButtonComponent, KpDialogComponent, KpInputComponent, KpDatepickerComponent],
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttChartComponent implements OnInit {
  private taskSvc = inject(OrderTaskService);
  private orderSvc = inject(ProductionOrderService);
  private workerSvc = inject(WorkerService);
  private productSvc = inject(ProductService);
  private orgSvc = inject(OrganizationService);

  cachedProducts = signal<Product[]>([]);
  cachedOrganizations = signal<Organization[]>([]);
  cachedWorkers = signal<Worker[]>([]);

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
  private dragOrigStart = '';
  private dragOrigEnd = '';
  private resizeOrigEnd = '';

  /** Год для вычисления дат (берётся из первой задачи) */
  private refYear = new Date().getFullYear();

  statusVisibility = signal<Record<string, boolean>>({ pending: true, assigned: true, in_progress: true, done: true, cancelled: true });

  colWidth = computed(() => this.zoom() === 'day' ? 40 : this.zoom() === 'week' ? 60 : 55);

  orderOptions = computed(() => [
    { label: '📋 Все заказы', value: '' },
    ...this.orders().map(o => ({ label: `${o.number} — ${o.productName}`, value: o.id }))
  ]);
  breadcrumbs = computed((): MenuItem[] => [{ label: '🏭 Производство' }, { label: 'Диаграмма Ганта' }]);
  statuses = computed(() => Object.entries(STATUS_COLORS).map(([key, color]) => ({ key, color, label: STATUS_LABELS[key] || key })));

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
    const zoom = this.zoom();
    const todayStr = new Date().toISOString().substring(0, 10);
    const cols: { label: string; isWeekend: boolean; isToday: boolean }[] = [];

    if (zoom === 'day') {
      const dates: string[] = [];
      for (const task of t) { if (task.plannedStartDate) dates.push(task.plannedStartDate); if (task.plannedEndDate) dates.push(task.plannedEndDate); if (task.actualEndDate) dates.push(task.actualEndDate); }
      if (!dates.length) return [];
      dates.sort();
      const start = new Date(dates[0]!); start.setDate(start.getDate() - 1);
      const end = new Date(dates[dates.length - 1]!); end.setDate(end.getDate() + 1);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const iso = d.toISOString().substring(0, 10);
        const dow = d.getDay();
        cols.push({ label: d.toISOString().substring(5, 10), isWeekend: dow === 0 || dow === 6, isToday: iso === todayStr });
      }
    } else if (zoom === 'week') {
      const year = this.refYear;
      // Начинаем с понедельника текущей недели
      const cur = new Date();
      const day = cur.getDay(); // 0=вс, 1=пн...
      const diff = cur.getDate() - day + (day === 0 ? -6 : 1); // понедельник
      cur.setDate(diff);
      cur.setHours(0, 0, 0, 0);
      // Показываем 26 недель вперёд (полгода)
      const end = new Date(cur); end.setDate(end.getDate() + 26 * 7);
      while (cur <= end) {
        const weekEnd = new Date(cur); weekEnd.setDate(weekEnd.getDate() + 6);
        const sm = String(cur.getMonth() + 1).padStart(2, '0');
        const sd = String(cur.getDate()).padStart(2, '0');
        const em = String(weekEnd.getMonth() + 1).padStart(2, '0');
        const ed = String(weekEnd.getDate()).padStart(2, '0');
        const label = `${sm}.${sd}\n${em}.${ed}`;
        const weekStartIso = `${year}-${sm}-${sd}`;
        const weekEndIso = `${year}-${em}-${ed}`;
        cols.push({ label, isWeekend: false, isToday: todayStr >= weekStartIso && todayStr <= weekEndIso });
        cur.setDate(cur.getDate() + 7);
      }
    } else {
      const year = this.refYear;
      for (let m = 0; m < 12; m++) {
        const d = new Date(year, m, 1);
        const label = d.toLocaleString('ru', { month: 'short' });
        const monthStartIso = d.toISOString().substring(0, 10);
        const monthEnd = new Date(year, m + 1, 0);
        const monthEndIso = monthEnd.toISOString().substring(0, 10);
        cols.push({ label, isWeekend: false, isToday: todayStr >= monthStartIso && todayStr <= monthEndIso });
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
    const y = this.refYear;
    for (let i = 0; i < cols.length; i++) {
      const parts = cols[i]!.label.split('\n');
      const [sm, sd] = parts[0]!.split('.');
      const start = new Date(y, parseInt(sm) - 1, parseInt(sd));
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
  workerName(wid: string): string { const w = this.cachedWorkers().find(x => x.id === wid); return w ? w.lastName : wid; }

  workerFullName(wid: string | undefined): string {
    if (!wid) return '—';
    const w = this.cachedWorkers().find(x => x.id === wid);
    if (!w) return '—';
    const i = (n: string | undefined) => n ? n.charAt(0) + '.' : '';
    return `${w.lastName} ${i(w.firstName)}${i(w.patronymic)}`;
  }

  ganttGroups = computed((): GanttGroup[] => {
    const bars = this.visibleBars();
    const map = new Map<string, GanttBar[]>();
    for (const bar of bars) {
      const key = bar.task.workTypeName;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(bar);
    }
    return Array.from(map.entries()).map(([name, groupBars]) => ({
      workTypeId: groupBars[0]!.task.workTypeId,
      workTypeName: name,
      bars: groupBars,
    }));
  });

  layoutRows = computed((): LayoutRow[] => {
    const rows: LayoutRow[] = [];
    for (const group of this.ganttGroups()) {
      rows.push({ type: 'group', groupName: group.workTypeName, groupId: group.workTypeId, barCount: group.bars.length });
      for (const bar of group.bars) {
        rows.push({ type: 'bar', bar });
      }
    }
    return rows;
  });

  groupColor(workTypeId: string): string {
    const colors = ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#06b6d4', '#a855f7', '#ec4899', '#14b8a6'];
    let hash = 0;
    for (let i = 0; i < workTypeId.length; i++) hash = workTypeId.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  groupIcon(workTypeId: string): string {
    const icons: Record<string, string> = {
      'wt-1': '🔩', 'wt-2': '🔩', 'wt-3': '⚡', 'wt-4': '🔧',
      'wt-5': '🎨', 'wt-6': '🎨', 'wt-7': '📐', 'wt-8': '🔗', 'wt-9': '🔧',
    };
    return icons[workTypeId] || '⚙️';
  }

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
    this.dragOrigStart = task.plannedStartDate || '';
    this.dragOrigEnd = task.plannedEndDate || '';
  }

  onResizeMouseDown(event: MouseEvent, task: OrderTask) {
    event.preventDefault();
    event.stopPropagation();
    this.resizingTaskId.set(task.id);
    this.dragStartX = event.clientX;
    this.resizeOrigEnd = task.plannedEndDate || '';
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
      // При drag/resize часы НЕ пересчитываем — меняем только даты
      const updated = { ...task, plannedStartDate: newStart, plannedEndDate: newEnd };
      this.tasks.update(arr => arr.map(t => t.id === id ? updated : t));
    }
    if (this.resizingTaskId()) {
      const dx = event.clientX - this.dragStartX;
      const colShift = Math.round(dx / cw);
      if (colShift === 0) return;
      const id = this.resizingTaskId();
      const task = this.tasks().find(t => t.id === id);
      if (!task || !task.plannedStartDate || !this.resizeOrigEnd) return;
      const origEi = this.colIndex(this.resizeOrigEnd);
      const newEi = origEi + colShift;
      const cols = this.timelineColumns();
      if (newEi >= cols.length || newEi < this.colIndex(task.plannedStartDate)) return;
      const newEnd = this.colDate(newEi); if (!newEnd) return;
      // При resize часы НЕ пересчитываем — меняем только даты
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
    this.resizeOrigEnd = '';
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
    const y = this.refYear;
    if (z === 'day') return `${y}-${label}`;
    if (z === 'week') {
      const parts = label.split('\n');
      const [sm, sd] = parts[0]!.split('.');
      return `${y}-${sm}-${sd}`;
    }
    const m = GanttChartComponent.RU_MONTHS[label];
    const monthStr = String(m !== undefined ? m + 1 : 1).padStart(2, '0');
    return `${y}-${monthStr}-01`;
  }

  // ─── Форма создания заказа ───
  dialogVisible = signal(false);
  formProductId = signal<string | null>(null);
  formOrgId = signal<string | null>(null);
  formQuantity = signal<number>(1);
  formStartDate = signal<Date | null>(new Date());
  formEndDate = signal<Date | null>(new Date(Date.now() + 7 * 86400000));
  formNotes = signal('');
  formSubmitting = signal(false);

  productOptions = computed(() => this.cachedProducts()
    .filter(p => p.productType === 'manufactured' && p.isActive)
    .map(p => ({ label: `${p.sku} — ${p.name}`, value: p.id })));

  orgOptions = computed(() => this.cachedOrganizations()
    .filter(o => o.isActive)
    .map(o => ({ label: o.shortName || o.name, value: o.id })));

  openCreateDialog() { this.dialogVisible.set(true); }

  closeCreateDialog() { this.dialogVisible.set(false); this.resetForm(); }

  private resetForm() {
    this.formProductId.set(null);
    this.formOrgId.set(null);
    this.formQuantity.set(1);
    const today = new Date();
    this.formStartDate.set(today);
    const end = new Date(today); end.setDate(end.getDate() + 7);
    this.formEndDate.set(end);
    this.formNotes.set('');
  }

  async createOrder() {
    const productId = this.formProductId();
    const orgId = this.formOrgId();
    const qty = this.formQuantity();
    if (!productId || !orgId || qty < 1) return;
    this.formSubmitting.set(true);
    try {
      const product = this.cachedProducts().find(p => p.id === productId);
      const org = this.cachedOrganizations().find(o => o.id === orgId);
      if (!product || !org) return;
      const sd = this.formStartDate() || new Date();
      const ed = this.formEndDate() || new Date(new Date().getTime() + 7 * 86400000);
      const data = {
        contractId: '',
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity: qty,
        status: 'accepted' as const,
        plannedStartDate: sd.toISOString().substring(0, 10),
        plannedEndDate: ed.toISOString().substring(0, 10),
        notes: this.formNotes(),
      };
      const res = await firstValueFrom(this.orderSvc.createOrder(data));
      if (res.success) {
        this.closeCreateDialog();
        // Обновить список заказов и выбрать новый
        const ordersRes = await firstValueFrom(this.orderSvc.getAll());
        this.orders.set(ordersRes.data);
        this.selectedOrderId.set(res.data.id);
        this.loadTasks();
      }
    } finally {
      this.formSubmitting.set(false);
    }
  }

  ngOnInit() { this.load(); this.loadCachedData(); }

  private async loadCachedData() {
    const [prodRes, orgRes, workerRes] = await Promise.all([
      firstValueFrom(this.productSvc.getAll()),
      firstValueFrom(this.orgSvc.getAll()),
      firstValueFrom(this.workerSvc.getAll()),
    ]);
    if (prodRes.success) this.cachedProducts.set(prodRes.data);
    if (orgRes.success) this.cachedOrganizations.set(orgRes.data);
    if (workerRes.success) this.cachedWorkers.set(workerRes.data);
  }

  async load() {
    const [tasks, orders] = await Promise.all([firstValueFrom(this.taskSvc.getTasks()), firstValueFrom(this.orderSvc.getAll())]);
    this.allTasks.set(tasks.data); this.orders.set(orders.data);
    this.selectedOrderId.set('');
    this.loadTasks();
  }

  loadTasks() {
    const oid = this.selectedOrderId();
    this.tasks.set(oid
      ? this.allTasks().filter(t => t.productionOrderId === oid).sort((a, b) => a.sortOrder - b.sortOrder)
      : this.allTasks().sort((a, b) => a.sortOrder - b.sortOrder));
  }
}
