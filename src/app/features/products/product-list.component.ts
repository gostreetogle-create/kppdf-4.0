import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpBadgeComponent } from '../../shared/ui/kp-badge.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';
import { NotificationService } from '../../core/notification.service';
import { ProductService } from '../../core/product.service';
import { ProductCategoryService } from '../../core/product-category.service';
import { CartService } from '../../core/cart.service';
import { ConfirmationService } from 'primeng/api';
import type { Product, ProductCategory } from '../../../../shared/types/index.js';

interface ProductRow extends Product {
  categoryName: string;
  typeLabel: string;
  statusLabel: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpDialogComponent, KpSelectComponent,
    KpInputComponent, KpBadgeComponent, KpToastComponent,
    KpConfirmDialogComponent,
  ],
  providers: [ConfirmationService],
  template: `
    <kp-toast />

    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="prod-list__header">
        <h2 class="prod-list__title">🏪 Товары и услуги</h2>
        <div class="prod-list__header-actions">
          <kp-input
            placeholder="Поиск товаров..."
            lucideIcon="search"
            [(ngModel)]="searchQuery"
            styleClass="prod-list__search"
          />
          <kp-select
            [options]="categoryOptions()"
            [(ngModel)]="filterCategoryId"
            placeholder="Все категории"
            styleClass="prod-list__filter"
          />
          <kp-select
            [options]="typeOptions"
            [(ngModel)]="filterType"
            placeholder="Все типы"
            styleClass="prod-list__filter"
          />
          <kp-button label="+ Добавить товар" lucideIcon="plus" routerLink="/sales/products/new" />
        </div>
      </div>

      <kp-table
        storageKey="products"
        [data]="filteredRows()"
        [columns]="tableColumns"
        [rows]="25"
        [paginator]="true"
        [sortField]="'name'"
        [sortOrder]="1"
        emptyMessage="Товары не найдены"
        [showActions]="true"
        [showAddToCart]="true"
        (rowEdit)="onEditRow($event)"
        (rowDelete)="onDelete($event)"
        (rowAddToCart)="onAddToCart($event)"
      />
    </kp-card>
  `,
  styles: [`
    :host { display: block; max-width: 1200px; margin: 0 auto; padding: var(--space-6); }
    .prod-list__header {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: var(--space-3); margin: var(--space-4) 0;
    }
    .prod-list__title {
      font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);
      color: var(--color-text); margin: 0;
    }
    .prod-list__header-actions {
      display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;
    }
    .prod-list__search { width: 220px; }
    .prod-list__filter { width: 180px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(ProductCategoryService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  private cartService = inject(CartService);

  products = signal<Product[]>([]);
  categories = signal<ProductCategory[]>([]);

  searchQuery = signal('');
  filterCategoryId = signal('');
  filterType = signal('');

  typeOptions = [
    { label: 'Все типы', value: '' },
    { label: '🛒 Покупной', value: 'purchased' },
    { label: '🔧 Изготавливаемый', value: 'manufactured' },
  ];

  categoryOptions = computed(() => {
    const cats = this.categories();
    return [
      { label: 'Все категории', value: '' },
      ...cats.filter(c => c.isActive).map(c => ({ label: `${c.prefix} — ${c.name}`, value: c.id })),
    ];
  });

  breadcrumbs: MenuItem[] = [
    { label: 'Продажи' },
    { label: 'Товары и услуги' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'sku', header: 'Артикул', width: '110px', sortable: true },
    { field: 'name', header: 'Наименование', sortable: true },
    { field: 'categoryName', header: 'Категория', width: '180px', sortable: true },
    { field: 'typeLabel', header: 'Тип', width: '130px' },
    { field: 'basePrice', header: 'Цена', width: '110px', type: 'number' },
    { field: 'unit', header: 'Ед.', width: '80px' },
    { field: 'statusLabel', header: 'Статус', width: '120px', type: 'badge' },
  ];

  filteredRows = computed(() => {
    let items = this.products();
    const q = this.searchQuery().toLowerCase();
    const catId = this.filterCategoryId();
    const type = this.filterType();
    const cats = this.categories();

    if (q) items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
    if (catId) items = items.filter(p => p.categoryId === catId);
    if (type) items = items.filter(p => p.productType === type);

    const catMap = new Map(cats.map(c => [c.id, c.name]));
    return items.map(p => ({
      ...p,
      categoryName: catMap.get(p.categoryId) || '—',
      typeLabel: p.productType === 'purchased' ? '🛒 Покупной' : '🔧 Изготавливаемый',
      statusLabel: p.isActive ? 'Активен' : 'Неактивен',
    }));
  });

  constructor() {
    this.load();
  }

  onAddToCart(row: unknown) {
    const product = row as Product;
    this.cartService.addItem(product);
    this.notification.success(`«${product.name}» добавлен в корзину`);
  }

  async load() {
    const [prodRes, catRes] = await Promise.all([
      firstValueFrom(this.productService.getAll()),
      firstValueFrom(this.categoryService.getAll()),
    ]);
    this.products.set(prodRes.data);
    this.categories.set(catRes.data);
  }

  onEditRow(row: unknown) {
    const item = row as Product;
    this.router.navigate(['/sales/products', item.id, 'edit']);
  }

  onDelete(row: unknown) {
    const item = row as ProductRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление товара',
      message: `Вы уверены, что хотите удалить товар «${item.name}» (${item.sku})?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.productService.delete(item.id));
        if (res.success) {
          this.notification.success('Товар удалён');
          this.load();
        } else {
          this.notification.error(res.message || 'Ошибка удаления');
        }
      },
    });
  }
}
