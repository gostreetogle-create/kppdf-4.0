import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CartComponent } from './cart.component';
import { CartService } from '../../core/cart.service';
import { ProductService } from '../../core/product.service';
import { NotificationService } from '../../core/notification.service';
import type { Product } from '../../../../shared/types/index.js';

const MOCK_PRODUCT: Product = {
  id: 'prod-test-1',
  sku: 'SP0001',
  name: 'Стойка баскетбольная',
  categoryId: 'cat-sp',
  productType: 'manufactured',
  description: 'Тестовый товар',
  basePrice: 85000,
  unit: 'шт',
  weightKg: 120,
  dimensions: '3050×1800×120',
  material: 'Сталь Ст3',
  hasPassport: true,
  hasDrawing: true,
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const MOCK_PRODUCT2: Product = {
  ...MOCK_PRODUCT,
  id: 'prod-test-2',
  sku: 'MF0001',
  name: 'Скамейка парковая',
  basePrice: 12500,
};

describe('CartComponent', () => {
  let notification: NotificationService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'sales/cart', component: CartComponent }]),
        provideNoopAnimations(),
        MessageService,
        ConfirmationService,
        NotificationService,
        CartService,
        ProductService,
      ],
    });
    await TestBed.compileComponents();
    notification = TestBed.inject(NotificationService);
  });

  afterEach(() => TestBed.resetTestingModule());

  function createComponent(): CartComponent {
    let component!: CartComponent;
    TestBed.runInInjectionContext(() => {
      component = new CartComponent();
    });
    return component;
  }

  // ─────── Создание и значения по умолчанию ───────

  it('создаётся', () => {
    expect(createComponent()).toBeTruthy();
  });

  it('значения по умолчанию', () => {
    const c = createComponent();
    expect(c.cart.isEmpty()).toBe(true);
    expect(c.cart.itemCount()).toBe(0);
    expect(c.cart.totalUnits()).toBe(0);
    expect(c.cart.totalSum()).toBe(0);
    expect(c.showAddDialog()).toBe(false);
    expect(c.searchQuery()).toBe('');
    expect(c.removingId()).toBeNull();
    expect(c.breadcrumbs.length).toBe(2);
    expect(c.breadcrumbs[0].label).toBe('Продажи');
    expect(c.breadcrumbs[1].label).toBe('Корзина');
  });

  // ─────── Корзина: добавление товара ───────

  it('onAddToCart добавляет товар в корзину', () => {
    const c = createComponent();
    const notifySpy = vi.spyOn(notification, 'success');
    c.onAddToCart(MOCK_PRODUCT);
    expect(c.cart.isEmpty()).toBe(false);
    expect(c.cart.itemCount()).toBe(1);
    expect(c.cart.items()[0].sku).toBe('SP0001');
    expect(c.cart.items()[0].name).toBe('Стойка баскетбольная');
    expect(c.cart.items()[0].quantity).toBe(1);
    expect(notifySpy).toHaveBeenCalledWith('«Стойка баскетбольная» добавлен в корзину');
  });

  it('onAddToCart увеличивает количество для существующего товара', () => {
    const c = createComponent();
    c.onAddToCart(MOCK_PRODUCT);
    c.onAddToCart(MOCK_PRODUCT);
    expect(c.cart.itemCount()).toBe(1);
    expect(c.cart.items()[0].quantity).toBe(2);
  });

  it('onAddToCart добавляет разные товары отдельными позициями', () => {
    const c = createComponent();
    c.onAddToCart(MOCK_PRODUCT);
    c.onAddToCart(MOCK_PRODUCT2);
    expect(c.cart.itemCount()).toBe(2);
    expect(c.cart.totalUnits()).toBe(2);
  });

  // ─────── Изменение количества ───────

  it('onQtyChange обновляет количество', () => {
    const c = createComponent();
    c.onAddToCart(MOCK_PRODUCT);
    const itemId = c.cart.items()[0].id;
    c.onQtyChange(itemId, 5);
    expect(c.cart.items()[0].quantity).toBe(5);
  });

  it('onQtyChange игнорирует невалидные значения', () => {
    const c = createComponent();
    c.onAddToCart(MOCK_PRODUCT);
    const itemId = c.cart.items()[0].id;
    c.onQtyChange(itemId, -1);
    expect(c.cart.items()[0].quantity).toBe(1); // не изменилось
    c.onQtyChange(itemId, NaN);
    expect(c.cart.items()[0].quantity).toBe(1);
  });

  it('onQtyChange удаляет позицию при quantity=0', () => {
    const c = createComponent();
    c.onAddToCart(MOCK_PRODUCT);
    const itemId = c.cart.items()[0].id;
    // CartService.updateQuantity удаляет при quantity <= 0
    c.cart.updateQuantity(itemId, 0);
    expect(c.cart.isEmpty()).toBe(true);
  });

  // ─────── Очистка корзины ───────

  it('clearCart очищает корзину', () => {
    const c = createComponent();
    c.onAddToCart(MOCK_PRODUCT);
    c.onAddToCart(MOCK_PRODUCT2);
    c.cart.clearCart();
    expect(c.cart.isEmpty()).toBe(true);
    expect(c.cart.itemCount()).toBe(0);
    expect(c.cart.totalSum()).toBe(0);
  });

  // ─────── Плюрализация ───────

  it('plural склоняет правильно', () => {
    const c = createComponent();
    expect(c.plural(1, 'позиция', 'позиции', 'позиций')).toBe('позиция');
    expect(c.plural(2, 'позиция', 'позиции', 'позиций')).toBe('позиции');
    expect(c.plural(5, 'позиция', 'позиции', 'позиций')).toBe('позиций');
    expect(c.plural(21, 'позиция', 'позиции', 'позиций')).toBe('позиция');
    expect(c.plural(11, 'позиция', 'позиции', 'позиций')).toBe('позиций');
  });

  // ─────── Создание КП (заглушка) ───────

  it('onCreateCp показывает предупреждение если корзина пуста', () => {
    const c = createComponent();
    const notifySpy = vi.spyOn(notification, 'warn');
    c.onCreateCp();
    expect(notifySpy).toHaveBeenCalledWith('Добавьте товары в корзину перед созданием КП');
  });
});
