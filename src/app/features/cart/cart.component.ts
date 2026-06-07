import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';
import { NotificationService } from '../../core/notification.service';
import { CartService } from '../../core/cart.service';
import { ProductService } from '../../core/product.service';
import { ConfirmationService } from 'primeng/api';
import type { CartItem, Product } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    KpButtonComponent, KpBreadcrumbComponent,
    KpDialogComponent, KpInputComponent,
    KpToastComponent, KpConfirmDialogComponent,
  ],
  providers: [ConfirmationService],
  template: `
    <kp-toast />

    <div class="cart__page">
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="cart__header">
        <div class="cart__header-left">
          <h1 class="cart__title">🛒 Корзина</h1>
          @if (!cart.isEmpty()) {
            <span class="cart__subtitle">
              {{ cart.itemCount() }} {{ plural(cart.itemCount(), 'позиция', 'позиции', 'позиций') }} ·
              {{ cart.totalUnits() }} {{ plural(cart.totalUnits(), 'единица', 'единицы', 'единиц') }}
            </span>
          }
        </div>
        <div class="cart__header-actions">
          <kp-button
            label="Добавить товар"
            lucideIcon="plus"
            (buttonClick)="showAddDialog.set(true)"
          />
          @if (!cart.isEmpty()) {
            <kp-button
              label="Очистить"
              lucideIcon="trash"
              [text]="true"
              [severity]="'danger'"
              (buttonClick)="onClearCart()"
            />
          }
        </div>
      </div>

      @if (cart.isEmpty()) {
        <!-- Empty state -->
        <div class="cart__empty">
          <div class="cart__empty-icon">🛒</div>
          <h2 class="cart__empty-title">Корзина пуста</h2>
          <p class="cart__empty-text">
            Добавьте товары из справочника, чтобы сформировать коммерческое предложение
          </p>
          <div class="cart__empty-actions">
            <kp-button label="Перейти к товарам" lucideIcon="box" routerLink="/sales/products" />
            <kp-button
              label="Добавить товар"
              lucideIcon="plus"
              [outlined]="true"
              (buttonClick)="showAddDialog.set(true)"
            />
          </div>
        </div>
      } @else {
        <!-- Cart content -->
        <div class="cart__layout">
          <!-- Items table -->
          <div class="cart__items">
            <div class="cart__table-header">
              <span class="cart__th cart__th--name">Товар</span>
              <span class="cart__th cart__th--sku">Артикул</span>
              <span class="cart__th cart__th--price">Цена</span>
              <span class="cart__th cart__th--qty">Количество</span>
              <span class="cart__th cart__th--total">Сумма</span>
              <span class="cart__th cart__th--action"></span>
            </div>

            @for (item of cart.items(); track item.id) {
              <div class="cart__row" [class.cart__row--removing]="removingId() === item.id">
                <div class="cart__cell cart__cell--name">
                  <div class="cart__product-info">
                    <div class="cart__product-avatar">{{ item.name.charAt(0) }}</div>
                    <div>
                      <span class="cart__product-name">{{ item.name }}</span>
                      <span class="cart__product-unit">{{ item.unit }}</span>
                    </div>
                  </div>
                </div>
                <div class="cart__cell cart__cell--sku">
                  <span class="cart__sku-badge">{{ item.sku }}</span>
                </div>
                <div class="cart__cell cart__cell--price">
                  <span class="cart__price">{{ item.price.toLocaleString('ru-RU') }} ₽</span>
                </div>
                <div class="cart__cell cart__cell--qty">
                  <div class="cart__qty-control">
                    <button
                      class="cart__qty-btn"
                      (click)="cart.updateQuantity(item.id, item.quantity - 1)"
                      [disabled]="item.quantity <= 1"
                    >−</button>
                    <input
                      class="cart__qty-input"
                      type="number"
                      [ngModel]="item.quantity"
                      (ngModelChange)="onQtyChange(item.id, $event)"
                      min="1"
                      max="99999"
                    />
                    <button
                      class="cart__qty-btn"
                      (click)="cart.updateQuantity(item.id, item.quantity + 1)"
                    >+</button>
                  </div>
                </div>
                <div class="cart__cell cart__cell--total">
                  <span class="cart__subtotal">{{ (item.price * item.quantity).toLocaleString('ru-RU') }} ₽</span>
                </div>
                <div class="cart__cell cart__cell--action">
                  <button
                    class="cart__remove-btn"
                    (click)="onRemoveItem(item)"
                    title="Удалить"
                  >✕</button>
                </div>
              </div>
            }
          </div>

          <!-- Summary sidebar -->
          <div class="cart__summary">
            <h3 class="cart__summary-title">Итого</h3>

            <div class="cart__summary-rows">
              <div class="cart__summary-row">
                <span>Позиций</span>
                <span>{{ cart.itemCount() }}</span>
              </div>
              <div class="cart__summary-row">
                <span>Всего единиц</span>
                <span>{{ cart.totalUnits() }}</span>
              </div>
              <div class="cart__summary-row cart__summary-row--divider">
                <span class="cart__summary-label">Общая сумма</span>
                <span class="cart__summary-value">{{ cart.totalSum().toLocaleString('ru-RU') }} ₽</span>
              </div>
            </div>

            <div class="cart__summary-actions">
              <kp-button
                label="Создать КП"
                lucideIcon="file-text"
                [styleClass]="'w-full'"
                (buttonClick)="onCreateCp()"
              />
              <button class="cart__continue-btn" routerLink="/sales/products">
                ← Продолжить выбор товаров
              </button>
            </div>

            <div class="cart__summary-note">
              <span class="cart__note-icon">💡</span>
              <span>Цены зафиксированы при добавлении в корзину. <br>При создании КП будет использована текущая наценка клиента.</span>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Add product dialog -->
    <kp-dialog
      [(visible)]="showAddDialog"
      header="Добавить товар в корзину"
      [style]="{ width: '520px' }"
    >
      <div class="cart__dialog-body">
        <kp-input
          placeholder="Поиск товаров..."
          lucideIcon="search"
          [(ngModel)]="searchQuery"
          styleClass="cart__dialog-search"
        />
        <div class="cart__dialog-list">
          @for (p of filteredProducts(); track p.id) {
            <div class="cart__dialog-item" (click)="onAddToCart(p)">
              <div class="cart__dialog-item-info">
                <span class="cart__dialog-sku">{{ p.sku }}</span>
                <span class="cart__dialog-name">{{ p.name }}</span>
              </div>
              <span class="cart__dialog-price">{{ (p.basePrice ?? 0).toLocaleString('ru-RU') }} ₽</span>
              <span class="cart__dialog-add">+</span>
            </div>
          }
          @if (filteredProducts().length === 0) {
            <div class="cart__dialog-empty">Товары не найдены</div>
          }
        </div>
      </div>
    </kp-dialog>
  `,
  styles: [`
    :host { display: block; }
    .cart__page {
      max-width: 1100px;
      margin: 0 auto;
      padding: var(--space-6);
    }

    /* ── Header ── */
    .cart__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-4);
      margin: var(--space-4) 0 var(--space-6);
    }
    .cart__header-left { display: flex; align-items: baseline; gap: var(--space-3); }
    .cart__title {
      font-size: var(--font-size-2xl, 1.75rem);
      font-weight: 800;
      color: var(--color-text);
      margin: 0;
    }
    .cart__subtitle {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    .cart__header-actions {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    /* ── Empty state ── */
    .cart__empty {
      text-align: center;
      padding: var(--space-12) var(--space-4);
    }
    .cart__empty-icon { font-size: 4rem; margin-bottom: var(--space-4); }
    .cart__empty-title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--color-text);
      margin: 0 0 var(--space-2);
    }
    .cart__empty-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin: 0 0 var(--space-6);
      line-height: 1.6;
    }
    .cart__empty-actions {
      display: flex;
      justify-content: center;
      gap: var(--space-3);
    }

    /* ── Layout: items + summary ── */
    .cart__layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: var(--space-6);
      align-items: start;
    }

    /* ── Items table ── */
    .cart__items {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .cart__table-header {
      display: grid;
      grid-template-columns: 1fr 100px 110px 140px 120px 44px;
      gap: 0;
      padding: var(--space-3) var(--space-4);
      background: var(--color-bg-secondary);
      border-bottom: 1px solid var(--color-border);
    }
    .cart__th {
      font-size: var(--font-size-xs);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-secondary);
    }
    .cart__th--sku { text-align: center; }
    .cart__th--price, .cart__th--total { text-align: right; }
    .cart__th--qty { text-align: center; }

    .cart__row {
      display: grid;
      grid-template-columns: 1fr 100px 110px 140px 120px 44px;
      gap: 0;
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--color-border);
      transition: all 0.2s ease;
    }
    .cart__row:last-child { border-bottom: none; }
    .cart__row:hover { background: var(--color-bg-secondary); }
    .cart__row--removing { opacity: 0.3; pointer-events: none; }

    .cart__cell { display: flex; align-items: center; }
    .cart__cell--sku { justify-content: center; }
    .cart__cell--price, .cart__cell--total { justify-content: flex-end; }
    .cart__cell--qty { justify-content: center; }

    /* Product info */
    .cart__product-info {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    .cart__product-avatar {
      width: 36px; height: 36px;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, var(--color-primary), #818cf8);
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: var(--font-size-sm);
      flex-shrink: 0;
    }
    .cart__product-name {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text);
      line-height: 1.3;
    }
    .cart__product-unit {
      display: block;
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      margin-top: 1px;
    }

    /* SKU badge */
    .cart__sku-badge {
      padding: 2px 8px;
      border-radius: 4px;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      font-family: 'Courier New', monospace;
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      letter-spacing: 0.02em;
    }

    /* Price */
    .cart__price {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text);
    }
    .cart__subtotal {
      font-size: var(--font-size-sm);
      font-weight: 700;
      color: var(--color-text);
    }

    /* Quantity control */
    .cart__qty-control {
      display: flex;
      align-items: center;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--color-bg);
    }
    .cart__qty-btn {
      width: 32px; height: 32px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .cart__qty-btn:hover:not(:disabled) {
      background: var(--color-bg-secondary);
      color: var(--color-primary);
    }
    .cart__qty-btn:disabled { opacity: 0.3; cursor: default; }
    .cart__qty-input {
      width: 48px; height: 32px;
      border: none;
      border-left: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);
      text-align: center;
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text);
      background: transparent;
      -moz-appearance: textfield;
    }
    .cart__qty-input::-webkit-outer-spin-button,
    .cart__qty-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

    /* Remove button */
    .cart__remove-btn {
      width: 32px; height: 32px;
      border: none;
      border-radius: var(--radius-sm);
      background: transparent;
      cursor: pointer;
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .cart__remove-btn:hover {
      background: rgba(239,68,68,0.1);
      color: #ef4444;
    }

    /* ── Summary ── */
    .cart__summary {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      position: sticky;
      top: var(--space-4);
    }
    .cart__summary-title {
      font-size: var(--font-size-base);
      font-weight: 700;
      color: var(--color-text);
      margin: 0 0 var(--space-4);
    }
    .cart__summary-rows {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      margin-bottom: var(--space-4);
    }
    .cart__summary-row {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    .cart__summary-row--divider {
      border-top: 1px solid var(--color-border);
      margin-top: var(--space-2);
      padding-top: var(--space-3);
    }
    .cart__summary-label { font-weight: 600; color: var(--color-text); }
    .cart__summary-value {
      font-size: var(--font-size-lg);
      font-weight: 800;
      color: var(--color-primary);
    }
    .cart__summary-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .cart__continue-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: var(--font-size-sm);
      color: var(--color-primary);
      padding: var(--space-2);
      transition: opacity 0.15s ease;
    }
    .cart__continue-btn:hover { opacity: 0.8; }

    .cart__summary-note {
      display: flex;
      gap: var(--space-2);
      margin-top: var(--space-4);
      padding-top: var(--space-3);
      border-top: 1px solid var(--color-border);
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      line-height: 1.5;
    }
    .cart__note-icon { flex-shrink: 0; }

    /* ── Add dialog ── */
    .cart__dialog-body { display: flex; flex-direction: column; gap: var(--space-3); }
    .cart__dialog-search { width: 100%; }
    .cart__dialog-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      max-height: 360px;
      overflow-y: auto;
    }
    .cart__dialog-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-3);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid transparent;
    }
    .cart__dialog-item:hover {
      background: var(--color-bg-secondary);
      border-color: var(--color-border);
    }
    .cart__dialog-item:active { transform: scale(0.98); }
    .cart__dialog-item-info { flex: 1; min-width: 0; }
    .cart__dialog-sku {
      display: block;
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      font-family: 'Courier New', monospace;
    }
    .cart__dialog-name {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cart__dialog-price {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text);
      white-space: nowrap;
    }
    .cart__dialog-add {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: var(--color-primary);
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; font-weight: 700;
      flex-shrink: 0;
      transition: transform 0.15s ease;
    }
    .cart__dialog-item:hover .cart__dialog-add { transform: scale(1.15); }
    .cart__dialog-empty {
      text-align: center;
      padding: var(--space-6);
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }

    /* ── Responsive ── */
    @media (max-width: 860px) {
      .cart__layout { grid-template-columns: 1fr; }
      .cart__summary { position: static; }

      .cart__table-header,
      .cart__row {
        grid-template-columns: 1fr 80px 90px 120px 100px 40px;
      }
    }
    @media (max-width: 600px) {
      .cart__page { padding: var(--space-4); }
      .cart__header { flex-direction: column; align-items: stretch; }
      .cart__header-actions { justify-content: stretch; }

      .cart__table-header,
      .cart__row {
        grid-template-columns: 1fr 70px;
        gap: var(--space-2);
        padding: var(--space-3);
      }
      .cart__cell--sku { display: none; }
      .cart__cell--price { display: none; }
      .cart__th--sku, .cart__th--price { display: none; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private router = inject(Router);
  private productService = inject(ProductService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  cart = inject(CartService);

  showAddDialog = signal(false);
  searchQuery = signal('');
  removingId = signal<string | null>(null);

  allProducts = signal<Product[]>([]);

  filteredProducts = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const products = this.allProducts();
    if (!q) return products.filter(p => p.isActive).slice(0, 30);
    return products.filter(p =>
      p.isActive && (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      )
    );
  });

  breadcrumbs = [
    { label: 'Продажи' },
    { label: 'Корзина' },
  ];

  constructor() {
    this.loadProducts();
  }

  async loadProducts() {
    const res = await firstValueFrom(this.productService.getAll());
    if (res.success) {
      this.allProducts.set(res.data);
    }
  }

  plural(n: number, one: string, few: string, many: string): string {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
  }

  onAddToCart(product: Product) {
    this.cart.addItem(product);
    this.notification.success(`«${product.name}» добавлен в корзину`);
  }

  onQtyChange(itemId: string, value: string | number) {
    const qty = parseInt(String(value), 10);
    if (isNaN(qty) || qty < 1) return;
    this.cart.updateQuantity(itemId, qty);
  }

  onRemoveItem(item: CartItem) {
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление из корзины',
      message: `Убрать «${item.name}» из корзины?`,
      acceptLabel: 'Убрать',
      rejectLabel: 'Отмена',
      accept: () => {
        this.cart.removeItem(item.id);
        this.notification.success('Товар убран из корзины');
      },
    });
  }

  onClearCart() {
    const count = this.cart.itemCount();
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Очистить корзину',
      message: `Удалить все ${count} ${this.plural(count, 'позицию', 'позиции', 'позиций')} из корзины?`,
      acceptLabel: 'Очистить',
      rejectLabel: 'Отмена',
      accept: () => {
        this.cart.clearCart();
        this.notification.success('Корзина очищена');
      },
    });
  }

  onCreateCp() {
    if (this.cart.isEmpty()) {
      this.notification.warn('Добавьте товары в корзину перед созданием КП');
      return;
    }
    this.router.navigate(['/sales/proposals/new']);
  }
}
