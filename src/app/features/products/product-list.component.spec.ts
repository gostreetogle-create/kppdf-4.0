import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../core/product.service';
import { ProductCategoryService } from '../../core/product-category.service';
import { ProductPhotoService } from '../../core/product-photo.service';
import { CartService } from '../../core/cart.service';
import { NotificationService } from '../../core/notification.service';
import { API_URL } from '../../core/api-url.token';

const SEED_PRODUCTS = [
  { id: 'prod-1', sku: 'SP0001', name: 'Стойка баскетбольная БСФП-120', categoryId: 'cat-sp', productType: 'manufactured', unit: 'шт', weightKg: 120, hasPassport: true, hasDrawing: true, isActive: true, basePrice: 85000, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'prod-2', sku: 'SP0002', name: 'Турник уличный ТУ-2', categoryId: 'cat-sp', productType: 'manufactured', unit: 'шт', weightKg: 80, hasPassport: true, hasDrawing: true, isActive: true, basePrice: 45000, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'prod-3', sku: 'MF0001', name: 'Скамейка парковая СК-180', categoryId: 'cat-mf', productType: 'manufactured', unit: 'шт', weightKg: 30, hasPassport: true, hasDrawing: true, isActive: true, basePrice: 28000, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'prod-4', sku: 'MF0002', name: 'Урна уличная У-50', categoryId: 'cat-mf', productType: 'manufactured', unit: 'шт', weightKg: 15, hasPassport: false, hasDrawing: false, isActive: true, basePrice: 12000, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'prod-5', sku: 'MF0003', name: 'Ограждение сварное ОС-200', categoryId: 'cat-mf', productType: 'manufactured', unit: 'м', weightKg: 25, hasPassport: false, hasDrawing: false, isActive: true, basePrice: 8500, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'prod-6', sku: 'PU0001', name: 'Лист стальной 2мм 1250x2500', categoryId: 'cat-metal', productType: 'purchased', unit: 'шт', weightKg: 49, hasPassport: false, hasDrawing: false, isActive: true, basePrice: 3500, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'prod-7', sku: 'PU0002', name: 'Труба профильная 40x40x2', categoryId: 'cat-metal', productType: 'purchased', unit: 'м', weightKg: 2.4, hasPassport: false, hasDrawing: false, isActive: true, basePrice: 280, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'prod-8', sku: 'PU0003', name: 'Краска порошковая RAL 7016', categoryId: 'cat-paint', productType: 'purchased', unit: 'кг', weightKg: 1, hasPassport: false, hasDrawing: false, isActive: true, basePrice: 1200, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'prod-9', sku: 'PU0004', name: 'Болт М10х30 оцинкованный', categoryId: 'cat-hardware', productType: 'purchased', unit: 'шт', weightKg: 0.03, hasPassport: false, hasDrawing: false, isActive: true, basePrice: 12, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'prod-10', sku: 'PU0005', name: 'Саморез 4.2х16', categoryId: 'cat-hardware', productType: 'purchased', unit: 'шт', weightKg: 0.005, hasPassport: false, hasDrawing: false, isActive: true, basePrice: 1.5, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

const SEED_CATEGORIES = [
  { id: 'cat-sp', name: 'Спортивное оборудование', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-mf', name: 'Малые формы', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-metal', name: 'Металлопрокат', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-paint', name: 'ЛКМ', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-hardware', name: 'Метизы', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-pack', name: 'Упаковка', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-other', name: 'Прочее', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

function flushConstructor(httpMock: HttpTestingController) {
  httpMock.expectOne('/api/v1/products').flush({ success: true, data: SEED_PRODUCTS });
  httpMock.expectOne('/api/v1/product-categories').flush({ success: true, data: SEED_CATEGORIES });
}

describe('ProductListComponent', () => {
  let notification: NotificationService;
  let cartService: CartService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'sales/products', component: ProductListComponent },
          { path: 'sales/products/new', component: ProductListComponent },
          { path: 'sales/products/:id/edit', component: ProductListComponent },
        ]),
        provideNoopAnimations(),
        provideHttpClient(), provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api/v1' },
        MessageService, ConfirmationService, NotificationService,
        ProductService, ProductCategoryService, ProductPhotoService, CartService,
      ],
    });
    await TestBed.compileComponents();
    notification = TestBed.inject(NotificationService);
    cartService = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { TestBed.resetTestingModule(); cartService.clearCart(); httpMock.verify(); });

  async function createComponent(): Promise<ProductListComponent> {
    let c!: ProductListComponent;
    TestBed.runInInjectionContext(() => { c = new ProductListComponent(); });
    flushConstructor(httpMock);
    await Promise.resolve();
    return c;
  }

  it('создаётся', async () => { expect(await createComponent()).toBeTruthy(); });

  it('значения по умолчанию', async () => {
    const c = await createComponent();
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

  it('load загружает товары и категории', async () => {
    const c = await createComponent();
    expect(c.products().length).toBe(10);
    expect(c.products()[0].sku).toBe('SP0001');
    expect(c.products()[0].name).toBe('Стойка баскетбольная БСФП-120');
    expect(c.categories().length).toBe(7);
  });

  it('filteredRows возвращает все товары без фильтров', async () => {
    const c = await createComponent();
    expect(c.filteredRows().length).toBe(10);
  });

  it('filteredRows фильтрует по поисковому запросу', async () => {
    const c = await createComponent();
    c.searchQuery.set('Стойка');
    expect(c.filteredRows().length).toBe(1);
    expect(c.filteredRows()[0].sku).toBe('SP0001');
  });

  it('filteredRows фильтрует по артикулу', async () => {
    const c = await createComponent();
    c.searchQuery.set('SP0002');
    expect(c.filteredRows().length).toBe(1);
    expect(c.filteredRows()[0].name).toBe('Турник уличный ТУ-2');
  });

  it('filteredRows фильтрует по категории', async () => {
    const c = await createComponent();
    c.filterCategoryId.set('cat-sp');
    const filtered = c.filteredRows();
    expect(filtered.length).toBe(2);
    expect(filtered.every(p => p.categoryId === 'cat-sp')).toBe(true);
  });

  it('filteredRows фильтрует по типу товара', async () => {
    const c = await createComponent();
    c.filterType.set('purchased');
    const filtered = c.filteredRows();
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(p => p.productType === 'purchased')).toBe(true);
  });

  it('filteredRows добавляет categoryName и typeLabel', async () => {
    const c = await createComponent();
    const row = c.filteredRows()[0];
    expect(row.categoryName).toBeDefined();
    expect(row.categoryName).not.toBe('—');
    expect(row.typeLabel).toBeDefined();
    expect(row.statusLabel).toBeDefined();
  });

  it('onAddToCart добавляет товар в корзину', async () => {
    const c = await createComponent();
    const notifySpy = vi.spyOn(notification, 'success');
    const product = c.filteredRows()[0];
    c.onAddToCart(product);
    expect(cartService.itemCount()).toBe(1);
    expect(cartService.items()[0].sku).toBe('SP0001');
    expect(notifySpy).toHaveBeenCalledWith('«Стойка баскетбольная БСФП-120» добавлен в корзину');
  });

  it('typeOptions содержит все типы', async () => {
    const c = await createComponent();
    expect(c.typeOptions).toEqual([
      { label: 'Все типы', value: '' },
      { label: '🛒 Покупной', value: 'purchased' },
      { label: '🔧 Изготавливаемый', value: 'manufactured' },
    ]);
  });

  it('categoryOptions содержит «Все категории» + активные категории', async () => {
    const c = await createComponent();
    const opts = c.categoryOptions();
    expect(opts[0]).toEqual({ label: 'Все категории', value: '' });
    expect(opts.length).toBeGreaterThan(1);
  });
});
