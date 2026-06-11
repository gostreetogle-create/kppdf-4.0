import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import type { Product } from '../../../shared/types/index.js';

function makeProduct(overrides?: Partial<Product>): Product {
  return {
    id: 'prod-1',
    sku: 'SP0001',
    name: 'Стойка баскетбольная',
    categoryId: 'cat-sp',
    productType: 'manufactured',
    description: '',
    basePrice: 85000,
    defaultMarkupPercent: 25,
    unit: 'шт',
    weightKg: 120,
    dimensions: '',
    material: '',
    hasPassport: false,
    hasDrawing: false,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    ...overrides,
  };
}

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [CartService] });
    service = TestBed.inject(CartService);
  });

  // ─────── addItem ───────

  it('addItem добавляет товар с markupPercent из defaultMarkupPercent товара', () => {
    service.addItem(makeProduct({ defaultMarkupPercent: 30 }));
    expect(service.items().length).toBe(1);
    expect(service.items()[0].markupPercent).toBe(30);
    expect(service.items()[0].price).toBe(85000);
  });

  it('addItem ставит markupPercent = 0 если у товара нет defaultMarkupPercent', () => {
    service.addItem(makeProduct({ defaultMarkupPercent: undefined }));
    expect(service.items()[0].markupPercent).toBe(0);
  });

  it('addItem ставит price = 0 если у товара нет basePrice', () => {
    service.addItem(makeProduct({ basePrice: undefined }));
    expect(service.items()[0].price).toBe(0);
  });

  it('addItem увеличивает количество если товар уже в корзине', () => {
    service.addItem(makeProduct({ id: 'prod-1' }));
    service.addItem(makeProduct({ id: 'prod-1' }));
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
  });

  // ─────── updateMarkup ───────

  it('updateMarkup изменяет markupPercent для существующей позиции', () => {
    service.addItem(makeProduct());
    expect(service.items()[0].markupPercent).toBe(25);

    service.updateMarkup(service.items()[0].id, 15);
    expect(service.items()[0].markupPercent).toBe(15);
  });

  it('updateMarkup не затрагивает другие позиции', () => {
    service.addItem(makeProduct({ id: 'prod-1' }));
    service.addItem(makeProduct({ id: 'prod-2', sku: 'SP0002', name: 'Турник', defaultMarkupPercent: 30 }));

    service.updateMarkup(service.items()[0].id, 10);
    expect(service.items()[0].markupPercent).toBe(10);
    expect(service.items()[1].markupPercent).toBe(30);
  });

  it('updateMarkup безопасен для несуществующего itemId (ничего не меняется)', () => {
    service.addItem(makeProduct());
    const itemsBefore = service.items();
    service.updateMarkup('nonexistent-id', 50);
    expect(service.items()).toEqual(itemsBefore);
  });

  // ─────── updateQuantity ───────

  it('updateQuantity обновляет количество', () => {
    service.addItem(makeProduct());
    service.updateQuantity(service.items()[0].id, 5);
    expect(service.items()[0].quantity).toBe(5);
  });

  it('updateQuantity удаляет позицию если quantity <= 0', () => {
    service.addItem(makeProduct());
    service.updateQuantity(service.items()[0].id, 0);
    expect(service.items().length).toBe(0);
  });

  // ─────── removeItem ───────

  it('removeItem удаляет позицию', () => {
    service.addItem(makeProduct());
    service.removeItem(service.items()[0].id);
    expect(service.items().length).toBe(0);
  });

  // ─────── clearCart ───────

  it('clearCart очищает все позиции', () => {
    service.addItem(makeProduct({ id: 'prod-1' }));
    service.addItem(makeProduct({ id: 'prod-2' }));
    expect(service.items().length).toBe(2);
    service.clearCart();
    expect(service.items().length).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });

  // ─────── computed ───────

  it('itemCount отражает количество позиций', () => {
    expect(service.itemCount()).toBe(0);
    service.addItem(makeProduct());
    expect(service.itemCount()).toBe(1);
  });

  it('totalUnits суммирует количества', () => {
    service.addItem(makeProduct());
    service.updateQuantity(service.items()[0].id, 3);
    expect(service.totalUnits()).toBe(3);
  });

  it('totalSum суммирует price * quantity', () => {
    service.addItem(makeProduct({ basePrice: 100 }));
    service.updateQuantity(service.items()[0].id, 3);
    expect(service.totalSum()).toBe(300);
  });

  it('isEmpty = true для пустой корзины', () => {
    expect(service.isEmpty()).toBe(true);
    service.addItem(makeProduct());
    expect(service.isEmpty()).toBe(false);
  });
});
