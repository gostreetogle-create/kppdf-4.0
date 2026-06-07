import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../core/product.service';
import { ProductCategoryService } from '../../core/product-category.service';
import { ProductPhotoService } from '../../core/product-photo.service';
import { CartService } from '../../core/cart.service';
import { NotificationService } from '../../core/notification.service';

describe('ProductListComponent', () => {
  let notification: NotificationService;
  let cartService: CartService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'sales/products', component: ProductListComponent },
          { path: 'sales/products/new', component: ProductListComponent },
          { path: 'sales/products/:id/edit', component: ProductListComponent },
        ]),
        provideNoopAnimations(),
        MessageService,
        ConfirmationService,
        NotificationService,
        ProductService,
        ProductCategoryService,
        ProductPhotoService,
        CartService,
      ],
    });
    await TestBed.compileComponents();
    notification = TestBed.inject(NotificationService);
    cartService = TestBed.inject(CartService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    cartService.clearCart();
  });

  function createComponent(): ProductListComponent {
    let component!: ProductListComponent;
    TestBed.runInInjectionContext(() => {
      component = new ProductListComponent();
    });
    return component;
  }

  // ─────── Создание и значения по умолчанию ───────

  it('создаётся', () => {
    expect(createComponent()).toBeTruthy();
  });

  it('значения по умолчанию', () => {
    const c = createComponent();
    expect(c.searchQuery()).toBe('');
    expect(c.filterCategoryId()).toBe('');
    expect(c.filterType()).toBe('');
    expect(c.typeOptions.length).toBe(3);
    expect(c.breadcrumbs.length).toBe(2);
    expect(c.breadcrumbs[0].label).toBe('Продажи');
    expect(c.breadcrumbs[1].label).toBe('Товары и услуги');
    expect(c.tableColumns.length).toBe(8);
    expect(c.tableColumns[1].field).toBe('sku');
  });

  // ─────── Загрузка seed-данных ───────

  it('load загружает товары и категории', async () => {
    const c = createComponent();
    await c.load();
    expect(c.products().length).toBe(10); // 10 seed-товаров
    expect(c.products()[0].sku).toBe('SP0001');
    expect(c.products()[0].name).toBe('Стойка баскетбольная БСФП-120');
    expect(c.categories().length).toBe(7); // 7 seed-категорий
  });

  // ─────── filteredRows ───────

  it('filteredRows возвращает все товары без фильтров', async () => {
    const c = createComponent();
    await c.load();
    expect(c.filteredRows().length).toBe(10);
  });

  it('filteredRows фильтрует по поисковому запросу', async () => {
    const c = createComponent();
    await c.load();
    c.searchQuery.set('Стойка');
    expect(c.filteredRows().length).toBe(1);
    expect(c.filteredRows()[0].sku).toBe('SP0001');
  });

  it('filteredRows фильтрует по артикулу', async () => {
    const c = createComponent();
    await c.load();
    c.searchQuery.set('SP0002');
    expect(c.filteredRows().length).toBe(1);
    expect(c.filteredRows()[0].name).toBe('Турник уличный ТУ-2');
  });

  it('filteredRows фильтрует по категории', async () => {
    const c = createComponent();
    await c.load();
    c.filterCategoryId.set('cat-sp');
    const filtered = c.filteredRows();
    expect(filtered.length).toBe(2); // SP0001 + SP0002
    expect(filtered.every(p => p.categoryId === 'cat-sp')).toBe(true);
  });

  it('filteredRows фильтрует по типу товара', async () => {
    const c = createComponent();
    await c.load();
    c.filterType.set('purchased');
    const filtered = c.filteredRows();
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(p => p.productType === 'purchased')).toBe(true);
  });

  it('filteredRows добавляет categoryName и typeLabel', async () => {
    const c = createComponent();
    await c.load();
    const row = c.filteredRows()[0];
    expect(row.categoryName).toBeDefined();
    expect(row.categoryName).not.toBe('—');
    expect(row.typeLabel).toBeDefined();
    expect(row.statusLabel).toBeDefined();
  });

  // ─────── Добавление в корзину ───────

  it('onAddToCart добавляет товар в корзину', async () => {
    const c = createComponent();
    await c.load();
    const notifySpy = vi.spyOn(notification, 'success');
    const product = c.filteredRows()[0];
    c.onAddToCart(product);
    expect(cartService.itemCount()).toBe(1);
    expect(cartService.items()[0].sku).toBe('SP0001');
    expect(notifySpy).toHaveBeenCalledWith('«Стойка баскетбольная БСФП-120» добавлен в корзину');
  });

  // ─────── Опции фильтров ───────

  it('typeOptions содержит все типы', () => {
    const c = createComponent();
    expect(c.typeOptions).toEqual([
      { label: 'Все типы', value: '' },
      { label: '🛒 Покупной', value: 'purchased' },
      { label: '🔧 Изготавливаемый', value: 'manufactured' },
    ]);
  });

  it('categoryOptions содержит «Все категории» + активные категории', async () => {
    const c = createComponent();
    await c.load();
    const opts = c.categoryOptions();
    expect(opts[0]).toEqual({ label: 'Все категории', value: '' });
    expect(opts.length).toBeGreaterThan(1);
  });
});
