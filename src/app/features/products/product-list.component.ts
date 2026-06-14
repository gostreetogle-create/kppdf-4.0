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
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';

import { NotificationService } from '../../core/notification.service';
import { ProductService } from '../../core/product.service';
import { ProductCategoryService } from '../../core/product-category.service';
import { ProductPhotoService } from '../../core/product-photo.service';
import { CartService } from '../../core/cart.service';
import { ConfirmationService } from 'primeng/api';
import type { Product, ProductCategory } from '../../../../shared/types/index.js';

interface ProductRow extends Product {
  categoryName: string;
  typeLabel: string;
  statusLabel: string;
  mainPhotoUrl?: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpSelectComponent,
    KpInputComponent, KpToastComponent,
  ],
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
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(ProductCategoryService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  private cartService = inject(CartService);
  private photoService = inject(ProductPhotoService);

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
    { field: 'mainPhotoUrl', header: 'Фото', width: '70px', type: 'image' },
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
    return items.map(p => {
      const photos = p.photos || [];
      const mainPhoto = photos.find(ph => ph.isMain) || photos[0];
      return {
        ...p,
        categoryName: catMap.get(p.categoryId) || '—',
        typeLabel: p.productType === 'purchased' ? '🛒 Покупной' : '🔧 Изготавливаемый',
        statusLabel: p.isActive ? 'Активен' : 'Неактивен',
        mainPhotoUrl: mainPhoto?.url,
      };
    });
  });

  constructor() {
    this.photoService.seedPhotos();
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
