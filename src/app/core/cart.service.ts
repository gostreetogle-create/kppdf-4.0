import { Injectable, signal, computed } from '@angular/core';
import { generateId } from './crud-factory.js';
import type { CartItem, Product } from '../../../shared/types/index.js';

/**
 * Сервис корзины — временное хранение товаров перед созданием КП.
 * Состояние хранится в памяти (signals), не сохраняется между сессиями.
 * Позже может быть расширен localStorage для сохранения между перезагрузками.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  /** Позиции в корзине */
  readonly items = signal<CartItem[]>([]);

  /** Общее количество позиций */
  readonly itemCount = computed(() => this.items().length);

  /** Общее количество единиц товара */
  readonly totalUnits = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  /** Общая сумма корзины */
  readonly totalSum = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  /** Корзина пуста */
  readonly isEmpty = computed(() => this.items().length === 0);

  /** Добавить товар в корзину (или увеличить количество, если уже есть) */
  addItem(product: Product, quantity: number = 1): void {
    const existing = this.items().find(i => i.productId === product.id);
    if (existing) {
      this.updateQuantity(existing.id, existing.quantity + quantity);
    } else {
      const newItem: CartItem = {
        id: generateId(),
        productId: product.id,
        sku: product.sku,
        name: product.name,
        unit: product.unit,
        quantity,
        price: product.basePrice ?? 0,
        /** Фиксируем наценку по умолчанию из товара */
        markupPercent: product.defaultMarkupPercent ?? 0,
      };
      this.items.update(list => [...list, newItem]);
    }
  }

  /** Изменить количество позиции */
  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    this.items.update(list =>
      list.map(i => i.id === itemId ? { ...i, quantity } : i)
    );
  }

  /** Удалить позицию из корзины */
  removeItem(itemId: string): void {
    this.items.update(list => list.filter(i => i.id !== itemId));
  }

  /** Изменить наценку позиции */
  updateMarkup(itemId: string, markupPercent: number): void {
    this.items.update(list =>
      list.map(i => i.id === itemId ? { ...i, markupPercent } : i)
    );
  }

  /** Очистить корзину полностью */
  clearCart(): void {
    this.items.set([]);
  }
}
