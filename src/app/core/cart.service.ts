import { Injectable, signal, computed, effect } from '@angular/core';
import { generateId } from './crud-factory.js';
import type { CartItem, Product } from '../../../shared/types/index.js';

/** Ключ localStorage для сохранения корзины между сессиями */
const CART_STORAGE_KEY = 'kppdf_cart_items';

/**
 * Сервис корзины — временное хранение товаров перед созданием КП.
 * Состояние автоматически сохраняется в localStorage при каждом изменении
 * и восстанавливается при загрузке страницы.
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

  constructor() {
    // Восстанавливаем корзину из localStorage
    this.loadFromStorage();

    // Автосохранение при каждом изменении
    effect(() => {
      const currentItems = this.items();
      this.saveToStorage(currentItems);
    });
  }

  /** Загрузить корзину из localStorage */
  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed: CartItem[] = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      // Проверяем, что это массив CartItem (базовая валидация)
      const valid = parsed.filter(
        (item): item is CartItem =>
          typeof item.id === 'string' &&
          typeof item.productId === 'string' &&
          typeof item.quantity === 'number' &&
          typeof item.price === 'number'
      );
      if (valid.length > 0) {
        this.items.set(valid);
      }
    } catch {
      // Игнорируем битые данные — корзина останется пустой
    }
  }

  /** Сохранить корзину в localStorage */
  private saveToStorage(items: CartItem[]): void {
    try {
      if (items.length === 0) {
        localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      }
    } catch {
      // localStorage может быть недоступен (квота, приватный режим)
    }
  }

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
        markupPercent: product.defaultMarkupPercent ?? 0,
        weightKg: product.weightKg,
        dimensions: product.dimensions,
        material: product.material,
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

  /** Изменить цену позиции */
  updatePrice(itemId: string, price: number): void {
    this.items.update(list =>
      list.map(i => i.id === itemId ? { ...i, price } : i)
    );
  }

  /** Изменить наценку позиции */
  updateMarkup(itemId: string, markupPercent: number): void {
    this.items.update(list =>
      list.map(i => i.id === itemId ? { ...i, markupPercent } : i)
    );
  }

  /** Полностью заменить позицию (для редактирования name/sku/price/qty/markup) */
  replaceItem(itemId: string, newItem: CartItem): void {
    this.items.update(list => list.map(i => i.id === itemId ? newItem : i));
  }

  /** Добавить копию позиции и удалить оригинал (Save as copy — замена с новым id) */
  replaceWithCopy(itemId: string, newItem: CartItem): void {
    this.items.update(list => {
      const idx = list.findIndex(i => i.id === itemId);
      if (idx === -1) return list;
      const updated = [...list];
      updated.splice(idx, 1, newItem); // заменяем оригинал на копию
      return updated;
    });
  }

  /** Очистить корзину полностью */
  clearCart(): void {
    this.items.set([]);
  }
}
