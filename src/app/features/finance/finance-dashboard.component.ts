import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { ProductionOrderService } from '../../core/production-order.service';
import { CommercialProposalService } from '../../core/commercial-proposal.service';
import { ContractService } from '../../core/contract.service';
import { OrderClosingService } from '../../core/order-closing.service';
import { ReconciliationActService } from '../../core/reconciliation-act.service';
import { FinancialReportService } from '../../core/financial-report.service';
import type { ProductionOrder, CommercialProposal, Contract, OrderClosing, ReconciliationAct, FinancialReport } from '../../../../shared/types/index.js';

interface StatusCount { label: string; count: number; color: string; }

const ORDER_STATUS: Record<string, string> = {
  accepted: 'Принят', in_design: 'Проектирование', in_production: 'В производстве',
  ready: 'Готов', shipped: 'Отгружен', closed: 'Закрыт',
};
const ORDER_COLORS: Record<string, string> = {
  accepted: '#3b82f6', in_design: '#8b5cf6', in_production: '#f59e0b',
  ready: '#22c55e', shipped: '#06b6d4', closed: '#6b7280',
};
const CP_STATUS: Record<string, string> = {
  draft: 'Черновик', sent: 'Отправлено', approved: 'Одобрено', rejected: 'Отклонено',
};
const CP_COLORS: Record<string, string> = {
  draft: '#94a3b8', sent: '#3b82f6', approved: '#22c55e', rejected: '#ef4444',
};
const CONTRACT_STATUS: Record<string, string> = {
  draft: 'Черновик', active: 'Действует', completed: 'Завершён', terminated: 'Расторгнут',
};
const CONTRACT_COLORS: Record<string, string> = {
  draft: '#94a3b8', active: '#3b82f6', completed: '#22c55e', terminated: '#ef4444',
};

interface DashboardData {
  orders: ProductionOrder[];
  proposals: CommercialProposal[];
  contracts: Contract[];
  closings: OrderClosing[];
  reconciliation: ReconciliationAct[];
  reports: FinancialReport[];
}

function statusBreakdown<T extends { status: string }>(
  items: T[],
  labels: Record<string, string>,
  colors: Record<string, string>,
): StatusCount[] {
  const map = new Map<string, number>();
  for (const item of items) { map.set(item.status, (map.get(item.status) || 0) + 1); }
  return Object.keys(labels).map(status => ({
    label: labels[status] || status,
    count: map.get(status) || 0,
    color: colors[status] || '#94a3b8',
  }));
}

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, KpCardComponent, KpBreadcrumbComponent],
  template: `
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs()" />
      <h2 class="dash-title">💰 Бухгалтерия — сводка</h2>
      <p class="dash-subtitle">Состояние заказов, КП, договоров, закрытий и сверок</p>

      @if (loaded()) {
        <!-- KPI-карточки -->
        <div class="dash-kpi">
          <div class="dash-kpi__card">
            <span class="dash-kpi__value">{{ data().orders.length }}</span>
            <span class="dash-kpi__label">Производственных заказов</span>
            <span class="dash-kpi__sub">🚧 {{ activeOrderCount() }} в работе</span>
          </div>
          <div class="dash-kpi__card dash-kpi__card--warn">
            <span class="dash-kpi__value">{{ data().proposals.length }}</span>
            <span class="dash-kpi__label">Коммерческих предложений</span>
            <span class="dash-kpi__sub">📄 {{ sentCpCount() }} отправлено</span>
          </div>
          <div class="dash-kpi__card dash-kpi__card--accent">
            <span class="dash-kpi__value">{{ closingsTotal() }}</span>
            <span class="dash-kpi__label">Закрывающих документов</span>
            <span class="dash-kpi__sub">✍️ {{ signedClosingsCount() }} подписано</span>
          </div>
          <div class="dash-kpi__card dash-kpi__card--good">
            <span class="dash-kpi__value">{{ totalClosingAmount() | number:'1.0-0' }} ₽</span>
            <span class="dash-kpi__label">Сумма закрытий</span>
            <span class="dash-kpi__sub">📊 {{ data().reconciliation.length }} актов сверки</span>
          </div>
        </div>

        <!-- Статус-брейкдауны -->
        <div class="dash-grid">
          <!-- Заказы -->
          <div class="dash-block">
            <h3 class="dash-block__title">
              🏭 Производственные заказы
              <a class="dash-block__link" routerLink="/production/orders">→ все</a>
            </h3>
            @for (s of orderBreakdown(); track s.label) {
              <div class="dash-bar">
                <div class="dash-bar__label">
                  <span class="dash-bar__swatch" [style.background]="s.color"></span>
                  {{ s.label }}
                </div>
                <div class="dash-bar__track">
                  <div class="dash-bar__fill" [style.width.%]="barPercent(s.count, orderBreakdownTotal())" [style.background]="s.color"></div>
                </div>
                <span class="dash-bar__count">{{ s.count }}</span>
              </div>
            }
            @if (!data().orders.length) {
              <p class="dash-empty">Нет данных</p>
            }
          </div>

          <!-- КП -->
          <div class="dash-block">
            <h3 class="dash-block__title">
              📄 Коммерческие предложения
              <a class="dash-block__link" routerLink="/sales/proposals">→ все</a>
            </h3>
            @for (s of cpBreakdown(); track s.label) {
              <div class="dash-bar">
                <div class="dash-bar__label">
                  <span class="dash-bar__swatch" [style.background]="s.color"></span>
                  {{ s.label }}
                </div>
                <div class="dash-bar__track">
                  <div class="dash-bar__fill" [style.width.%]="barPercent(s.count, cpBreakdownTotal())" [style.background]="s.color"></div>
                </div>
                <span class="dash-bar__count">{{ s.count }}</span>
              </div>
            }
            @if (!data().proposals.length) {
              <p class="dash-empty">Нет данных — создайте КП в разделе Продажи</p>
            }
          </div>

          <!-- Договоры -->
          <div class="dash-block">
            <h3 class="dash-block__title">
              📑 Договоры
              <a class="dash-block__link" routerLink="/sales/contracts">→ все</a>
            </h3>
            @for (s of contractBreakdown(); track s.label) {
              <div class="dash-bar">
                <div class="dash-bar__label">
                  <span class="dash-bar__swatch" [style.background]="s.color"></span>
                  {{ s.label }}
                </div>
                <div class="dash-bar__track">
                  <div class="dash-bar__fill" [style.width.%]="barPercent(s.count, contractBreakdownTotal())" [style.background]="s.color"></div>
                </div>
                <span class="dash-bar__count">{{ s.count }}</span>
              </div>
            }
            @if (!data().contracts.length) {
              <p class="dash-empty">Нет данных — создайте договор в разделе Продажи</p>
            }
          </div>

          <!-- Закрытие заказов -->
          <div class="dash-block">
            <h3 class="dash-block__title">
              📋 Закрытие заказов
              <a class="dash-block__link" routerLink="/finance/order-closing">→ все</a>
            </h3>
            @for (c of data().closings; track c.id) {
              <div class="dash-row">
                <span class="dash-row__num">{{ c.number }}</span>
                <span class="dash-row__name">{{ c.organizationName || '—' }}</span>
                <span class="dash-row__status" [style.color]="c.status === 'signed' ? '#22c55e' : c.status === 'closed' ? '#6b7280' : '#f59e0b'">
                  {{ c.status === 'draft' ? 'Черновик' : c.status === 'signed' ? 'Подписан' : 'Закрыт' }}
                </span>
                @if (c.amount) {
                  <span class="dash-row__amount">{{ c.amount | number:'1.0-0' }} ₽</span>
                }
              </div>
            }
            @if (!data().closings.length) {
              <p class="dash-empty">Нет данных</p>
            }
          </div>

          <!-- Акты сверки -->
          <div class="dash-block">
            <h3 class="dash-block__title">
              📑 Акты сверки
              <a class="dash-block__link" routerLink="/finance/reconciliation">→ все</a>
            </h3>
            @for (a of data().reconciliation; track a.id) {
              <div class="dash-row">
                <span class="dash-row__num">{{ a.number }}</span>
                <span class="dash-row__name">{{ a.organizationName }}</span>
                <span class="dash-row__status" [style.color]="a.status === 'signed' ? '#22c55e' : a.status === 'disputed' ? '#ef4444' : '#f59e0b'">
                  {{ a.status === 'draft' ? 'Черновик' : a.status === 'sent' ? 'Отправлен' : a.status === 'signed' ? 'Подписан' : 'Оспорен' }}
                </span>
                @if (a.balance !== undefined) {
                  <span class="dash-row__amount" [style.color]="a.balance > 0 ? '#22c55e' : '#ef4444'">
                    {{ a.balance > 0 ? '+' : '' }}{{ a.balance | number:'1.0-0' }} ₽
                  </span>
                }
              </div>
            }
            @if (!data().reconciliation.length) {
              <p class="dash-empty">Нет данных</p>
            }
          </div>

          <!-- Отчёты -->
          <div class="dash-block">
            <h3 class="dash-block__title">
              📊 Финансовые отчёты
              <a class="dash-block__link" routerLink="/finance/reports">→ все</a>
            </h3>
            @for (r of data().reports; track r.id) {
              <div class="dash-row">
                <span class="dash-row__num">{{ r.title }}</span>
                <span class="dash-row__name">{{ r.periodStart }} – {{ r.periodEnd }}</span>
                <span class="dash-row__status" [style.color]="r.status === 'final' ? '#22c55e' : '#94a3b8'">
                  {{ r.status === 'final' ? 'Финальный' : 'Черновик' }}
                </span>
              </div>
            }
            @if (!data().reports.length) {
              <p class="dash-empty">Нет данных</p>
            }
          </div>
        </div>
      } @else {
        <p class="dash-loading">Загрузка данных...</p>
      }
    </kp-card>
  `,
  styles: [`
    :host { display: block; max-width: 1200px; margin: 0 auto; padding: var(--space-6); }
    .dash-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0 var(--space-1); }
    .dash-subtitle { color: var(--color-text-secondary); margin: 0 0 var(--space-6); font-size: var(--font-size-sm); }

    /* KPI cards */
    .dash-kpi { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6); }
    .dash-kpi__card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-4); display: flex; flex-direction: column; gap: 2px; transition: box-shadow var(--transition-fast); }
    .dash-kpi__card:hover { box-shadow: var(--shadow-md); }
    .dash-kpi__card--warn { border-left: 4px solid #f59e0b; }
    .dash-kpi__card--accent { border-left: 4px solid #8b5cf6; }
    .dash-kpi__card--good { border-left: 4px solid #22c55e; }
    .dash-kpi__value { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); }
    .dash-kpi__label { font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
    .dash-kpi__sub { font-size: var(--font-size-xs); color: var(--color-text-muted); }

    /* Grid */
    .dash-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: var(--space-4); }
    .dash-block { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-4); }
    .dash-block__title { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin: 0 0 var(--space-3); display: flex; justify-content: space-between; align-items: center; }
    .dash-block__link { font-size: var(--font-size-xs); color: var(--color-primary); text-decoration: none; font-weight: var(--font-weight-normal); }
    .dash-block__link:hover { text-decoration: underline; }
    .dash-empty { font-size: var(--font-size-xs); color: var(--color-text-muted); font-style: italic; margin: 0; }

    /* Bars */
    .dash-bar { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-1); }
    .dash-bar__label { display: flex; align-items: center; gap: var(--space-1); width: 110px; flex-shrink: 0; font-size: var(--font-size-xs); }
    .dash-bar__swatch { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
    .dash-bar__track { flex: 1; height: 8px; background: var(--color-surface-hover); border-radius: var(--radius-full); overflow: hidden; }
    .dash-bar__fill { height: 100%; border-radius: var(--radius-full); transition: width 0.4s ease; min-width: 2px; }
    .dash-bar__count { font-size: var(--font-size-xs); color: var(--color-text-secondary); width: 24px; text-align: right; font-weight: var(--font-weight-semibold); }

    /* Rows */
    .dash-row { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border-light); font-size: var(--font-size-xs); }
    .dash-row:last-child { border-bottom: none; }
    .dash-row__num { font-weight: var(--font-weight-semibold); min-width: 80px; color: var(--color-text); }
    .dash-row__name { flex: 1; color: var(--color-text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dash-row__status { font-weight: var(--font-weight-medium); min-width: 80px; text-align: right; }
    .dash-row__amount { font-weight: var(--font-weight-semibold); min-width: 80px; text-align: right; }

    .dash-loading { color: var(--color-text-secondary); font-style: italic; padding: var(--space-8); text-align: center; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceDashboardComponent {
  private orderSvc = inject(ProductionOrderService);
  private cpSvc = inject(CommercialProposalService);
  private contractSvc = inject(ContractService);
  private closingSvc = inject(OrderClosingService);
  private raSvc = inject(ReconciliationActService);
  private reportSvc = inject(FinancialReportService);

  loaded = signal(false);
  data = signal<DashboardData>({ orders: [], proposals: [], contracts: [], closings: [], reconciliation: [], reports: [] });
  breadcrumbs = computed((): MenuItem[] => [{ label: '💰 Бухгалтерия' }, { label: 'Сводка' }]);

  orderBreakdown = computed(() => statusBreakdown(this.data().orders, ORDER_STATUS, ORDER_COLORS));
  cpBreakdown = computed(() => statusBreakdown(this.data().proposals, CP_STATUS, CP_COLORS));
  contractBreakdown = computed(() => statusBreakdown(this.data().contracts, CONTRACT_STATUS, CONTRACT_COLORS));

  orderBreakdownTotal = computed(() => this.orderBreakdown().reduce((s, i) => s + i.count, 0));
  cpBreakdownTotal = computed(() => this.cpBreakdown().reduce((s, i) => s + i.count, 0));
  contractBreakdownTotal = computed(() => this.contractBreakdown().reduce((s, i) => s + i.count, 0));

  activeOrderCount = computed(() => {
    const o = this.data().orders;
    return o.filter(x => x.status === 'in_production' || x.status === 'in_design').length;
  });
  sentCpCount = computed(() => this.data().proposals.filter(p => p.status === 'sent').length);
  closingsTotal = computed(() => this.data().closings.length);
  signedClosingsCount = computed(() => this.data().closings.filter(c => c.status === 'signed').length);
  totalClosingAmount = computed(() => this.data().closings.reduce((s, c) => s + (c.amount || 0), 0));

  barPercent(count: number, total: number): number {
    if (!total || !count) return 0;
    return Math.max((count / total) * 100, 2);
  }

  constructor() { this.load(); }

  async load() {
    try {
      const [orders, proposals, contracts, closings, ra, reports] = await Promise.all([
        firstValueFrom(this.orderSvc.getAll()),
        firstValueFrom(this.cpSvc.getAll()),
        firstValueFrom(this.contractSvc.getAll()),
        firstValueFrom(this.closingSvc.getAll()),
        firstValueFrom(this.raSvc.getAll()),
        firstValueFrom(this.reportSvc.getAll()),
      ]);
      this.data.set({
        orders: orders.data,
        proposals: proposals.data,
        contracts: contracts.data,
        closings: closings.data,
        reconciliation: ra.data,
        reports: reports.data,
      });
    } finally {
      this.loaded.set(true);
    }
  }
}
