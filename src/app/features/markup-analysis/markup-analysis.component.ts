import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';
import { ProductService } from '../../core/product.service';
import { ProductCategoryService } from '../../core/product-category.service';
import type { Product, ProductCategory } from '../../../../shared/types/index.js';

interface MarkupRow {
  id: string;
  categoryId: string;
  sku: string;
  name: string;
  categoryName: string;
  unit: string;
  /** Базовая цена (без наценки) */
  basePrice: number;
  /** Рекомендуемая наценка в % */
  markupPercent: number;
  /** Цена продажи = basePrice * (1 + markupPercent / 100) */
  sellingPrice: number;
  /** Прибыль = sellingPrice - basePrice */
  profit: number;
  /** Маржинальность = profit / sellingPrice * 100 */
  marginPercent: number;
}

@Component({
  selector: 'app-markup-analysis',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpSelectComponent,
    KpInputComponent, KpToastComponent,
  ],
  template: `
    <kp-toast />

    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="ma__header">
        <h2 class="ma__title">📊 Анализ наценок</h2>
        <div class="ma__header-actions">
          <kp-input
            placeholder="Поиск товаров..."
            lucideIcon="search"
            [(ngModel)]="searchQuery"
            styleClass="ma__search"
          />
          <kp-select
            [options]="categoryOptions()"
            [(ngModel)]="filterCategoryId"
            placeholder="Все категории"
            styleClass="ma__filter"
          />
        </div>
      </div>

      <!-- Итого по всем товарам -->
      @let totals = totalsRow();
      <div class="ma__summary">
        <div class="ma__summary-item">
          <span class="ma__summary-label">Товаров</span>
          <span class="ma__summary-value">{{ totals.count }}</span>
        </div>
        <div class="ma__summary-item">
          <span class="ma__summary-label">Средняя наценка</span>
          <span class="ma__summary-value ma__summary-value--markup">{{ totals.avgMarkup }}%</span>
        </div>
        <div class="ma__summary-item">
          <span class="ma__summary-label">Общая базовая цена</span>
          <span class="ma__summary-value">{{ totals.totalBase.toLocaleString('ru-RU') }} ₽</span>
        </div>
        <div class="ma__summary-item">
          <span class="ma__summary-label">Общая цена продажи</span>
          <span class="ma__summary-value ma__summary-value--price">{{ totals.totalSelling.toLocaleString('ru-RU') }} ₽</span>
        </div>
        <div class="ma__summary-item">
          <span class="ma__summary-label">Общая прибыль</span>
          <span class="ma__summary-value ma__summary-value--profit">+{{ totals.totalProfit.toLocaleString('ru-RU') }} ₽</span>
        </div>
      </div>

      <kp-table
        storageKey="markup-analysis"
        [data]="filteredRows()"
        [columns]="tableColumns"
        [rows]="50"
        [paginator]="true"
        [sortField]="'name'"
        [sortOrder]="1"
        emptyMessage="Товары не найдены"
      />
    </kp-card>
  `,
  styles: [`
    :host { display: block; padding: var(--space-6); }
    .ma__header {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: var(--space-3); margin: var(--space-4) 0;
    }
    .ma__title {
      font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);
      color: var(--color-text); margin: 0;
    }
    .ma__header-actions {
      display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;
    }
    .ma__search { width: 220px; }
    .ma__filter { width: 200px; }

    /* Summary bar */
    .ma__summary {
      display: flex;
      gap: var(--space-4);
      flex-wrap: wrap;
      padding: var(--space-4);
      margin-bottom: var(--space-4);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }
    .ma__summary-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 120px;
    }
    .ma__summary-label {
      font-size: var(--font-size-xs);
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .ma__summary-value {
      font-size: var(--font-size-lg);
      font-weight: 800;
      color: var(--color-text);
    }
    .ma__summary-value--markup { color: var(--color-primary); }
    .ma__summary-value--price { color: var(--color-text); }
    .ma__summary-value--profit { color: var(--color-green-600, #16a34a); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkupAnalysisComponent {
  private productService = inject(ProductService);
  private categoryService = inject(ProductCategoryService);
  private notification = inject(NotificationService);

  products = signal<Product[]>([]);
  categories = signal<ProductCategory[]>([]);

  searchQuery = signal('');
  filterCategoryId = signal('');

  breadcrumbs = [
    { label: 'Продажи' },
    { label: 'Анализ наценок' },
  ];

  categoryOptions = computed(() => {
    const cats = this.categories();
    return [
      { label: 'Все категории', value: '' },
      ...cats.filter(c => c.isActive).map(c => ({ label: `${c.prefix} — ${c.name}`, value: c.id })),
    ];
  });

  tableColumns: TableColumn[] = [
    { field: 'sku', header: 'Артикул', width: '110px', sortable: true },
    { field: 'name', header: 'Наименование', sortable: true },
    { field: 'categoryName', header: 'Категория', width: '170px', sortable: true },
    { field: 'unit', header: 'Ед.', width: '70px' },
    { field: 'basePrice', header: 'Базовая цена', width: '130px', type: 'number' },
    { field: 'markupPercent', header: 'Наценка, %', width: '100px', type: 'number' },
    { field: 'sellingPrice', header: 'Цена продажи', width: '130px', type: 'number' },
    { field: 'profit', header: 'Прибыль', width: '120px', type: 'number' },
    { field: 'marginPercent', header: 'Маржа, %', width: '90px', type: 'number' },
  ];

  /** Все строки с расчётом наценок */
  allRows = computed<MarkupRow[]>(() => {
    const cats = this.categories();
    const catMap = new Map(cats.map(c => [c.id, c.name]));
    return this.products()
      .filter(p => p.isActive)
      .map(p => {
        const basePrice = p.basePrice ?? 0;
        const markup = p.defaultMarkupPercent ?? 0;
        const sellingPrice = Math.round(basePrice * (1 + markup / 100) * 100) / 100;
        const profit = Math.round((sellingPrice - basePrice) * 100) / 100;
        const marginPercent = sellingPrice > 0
          ? Math.round((profit / sellingPrice) * 1000) / 10
          : 0;
        return {
          id: p.id,
          categoryId: p.categoryId,
          sku: p.sku,
          name: p.name,
          categoryName: catMap.get(p.categoryId) || '—',
          unit: p.unit,
          basePrice,
          markupPercent: markup,
          sellingPrice,
          profit,
          marginPercent,
        };
      });
  });

  /** Отфильтрованные строки */
  filteredRows = computed(() => {
    let rows = this.allRows();
    const q = this.searchQuery().toLowerCase().trim();
    const catId = this.filterCategoryId();
    if (q) {
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q)
      );
    }
    if (catId) {
      rows = rows.filter(r => r.categoryId === catId);
    }
    return rows;
  });

  /** Итоговая строка (по отфильтрованным товарам) */
  totalsRow = computed(() => {
    const rows = this.filteredRows();
    const count = rows.length;
    const totalBase = rows.reduce((s, r) => s + r.basePrice, 0);
    const totalSelling = rows.reduce((s, r) => s + r.sellingPrice, 0);
    const totalProfit = rows.reduce((s, r) => s + r.profit, 0);
    const avgMarkup = count > 0
      ? Math.round(rows.reduce((s, r) => s + r.markupPercent, 0) / count)
      : 0;
    return { count, totalBase, totalSelling, totalProfit, avgMarkup };
  });

  constructor() {
    this.load();
  }

  async load() {
    try {
      const [prodRes, catRes] = await Promise.all([
        firstValueFrom(this.productService.getAll()),
        firstValueFrom(this.categoryService.getAll()),
      ]);
      if (prodRes.success) this.products.set(prodRes.data);
      if (catRes.success) this.categories.set(catRes.data);
    } catch {
      this.notification.error('Ошибка загрузки данных');
    }
  }
}
