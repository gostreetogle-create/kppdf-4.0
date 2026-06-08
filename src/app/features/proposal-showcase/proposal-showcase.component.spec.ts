import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ProposalShowcaseComponent } from './proposal-showcase.component';
import { CartService } from '../../core/cart.service';
import { NotificationService } from '../../core/notification.service';
import { ProductService } from '../../core/product.service';
import { ProductCategoryService } from '../../core/product-category.service';
import { OrganizationService } from '../../core/organization.service';
import { ClientService } from '../../core/client.service';
import { DocumentTemplateService } from '../../core/document-template.service';
import { CommercialProposalService } from '../../core/commercial-proposal.service';
import type { CartItem, Client } from '../../../../shared/types/index.js';

const MOCK_CLIENT_WITH_MARKUP: Client = {
  id: 'cli-3', lastName: 'Сидорова', firstName: 'Анна',
  phone: '+7 (918) 555-03-03', personalMarkupPercent: 5,
  isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
};

const MOCK_CLIENT_NO_MARKUP: Client = {
  id: 'cli-1', lastName: 'Иванов', firstName: 'Иван',
  phone: '+7 (918) 555-01-01',
  isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
};

function makeCartItem(overrides?: Partial<CartItem>): CartItem {
  return {
    id: 'ci-1',
    productId: 'prod-1',
    sku: 'SP0001',
    name: 'Стойка баскетбольная',
    unit: 'шт',
    quantity: 2,
    price: 85000,
    markupPercent: 25,
    ...overrides,
  };
}

describe('ProposalShowcaseComponent', () => {
  let cartService: CartService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        MessageService,
        NotificationService,
        CartService,
        ProductService,
        ProductCategoryService,
        OrganizationService,
        ClientService,
        DocumentTemplateService,
        CommercialProposalService,
      ],
    });
    await TestBed.compileComponents();
    cartService = TestBed.inject(CartService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    cartService.clearCart();
  });

  function createComponent(): ProposalShowcaseComponent {
    return TestBed.runInInjectionContext(() => new ProposalShowcaseComponent());
  }

  // ─────── effectiveMarkup ───────

  describe('effectiveMarkup', () => {
    it('возвращает markupPercent из товара если клиент не выбран', () => {
      const c = createComponent();
      const item = makeCartItem({ markupPercent: 25 });
      expect(c.effectiveMarkup(item)).toBe(25);
    });

    it('возвращает 0 если у товара нет markupPercent и клиент не выбран', () => {
      const c = createComponent();
      const item = makeCartItem({ markupPercent: undefined });
      expect(c.effectiveMarkup(item)).toBe(0);
    });

    it('возвращает personalMarkupPercent клиента если клиент выбран', () => {
      const c = createComponent();
      c.clients.set([MOCK_CLIENT_WITH_MARKUP]);
      c.selectedClientId.set('cli-3');
      const item = makeCartItem({ markupPercent: 25 });
      expect(c.effectiveMarkup(item)).toBe(5);
    });

    it('игнорирует markupPercent товара если клиент имеет наценку', () => {
      const c = createComponent();
      c.clients.set([MOCK_CLIENT_WITH_MARKUP]);
      c.selectedClientId.set('cli-3');
      // Даже если у товара другая наценка, клиентская имеет приоритет
      const item = makeCartItem({ markupPercent: 50 });
      expect(c.effectiveMarkup(item)).toBe(5);
    });

    it('возвращает markupPercent товара если у клиента нет personalMarkupPercent', () => {
      const c = createComponent();
      c.clients.set([MOCK_CLIENT_NO_MARKUP]);
      c.selectedClientId.set('cli-1');
      const item = makeCartItem({ markupPercent: 20 });
      expect(c.effectiveMarkup(item)).toBe(20);
    });

    it('возвращает 0 если клиент не имеет наценки и у товара нет markupPercent', () => {
      const c = createComponent();
      c.clients.set([MOCK_CLIENT_NO_MARKUP]);
      c.selectedClientId.set('cli-1');
      const item = makeCartItem({ markupPercent: undefined });
      expect(c.effectiveMarkup(item)).toBe(0);
    });
  });

  // ─────── itemTotal ───────

  describe('itemTotal', () => {
    it('рассчитывает total с наценкой: price * (1 + markup/100) * quantity', () => {
      const c = createComponent();
      // price=1000, markup=25%, quantity=3 → 1000 * 1.25 * 3 = 3750
      const item = makeCartItem({ price: 1000, markupPercent: 25, quantity: 3 });
      expect(c.itemTotal(item)).toBe(3750);
    });

    it('рассчитывает total без наценки (markup=0)', () => {
      const c = createComponent();
      const item = makeCartItem({ price: 85000, markupPercent: 0, quantity: 2 });
      expect(c.itemTotal(item)).toBe(170000);
    });

    it('округляет до 2 знаков после запятой', () => {
      const c = createComponent();
      // price=100, markup=33.33%, quantity=3 → 100 * 1.3333 * 3 = 399.99
      const item = makeCartItem({ price: 100, markupPercent: 33.33, quantity: 3 });
      expect(c.itemTotal(item)).toBe(399.99);
    });

    it('использует наценку клиента если она задана', () => {
      const c = createComponent();
      c.clients.set([MOCK_CLIENT_WITH_MARKUP]);
      c.selectedClientId.set('cli-3');
      // price=1000, client markup=5%, quantity=2 → 1000 * 1.05 * 2 = 2100
      const item = makeCartItem({ price: 1000, markupPercent: 25, quantity: 2 });
      expect(c.itemTotal(item)).toBe(2100);
    });

    it('работает с quantity=1', () => {
      const c = createComponent();
      const item = makeCartItem({ price: 500, markupPercent: 10, quantity: 1 });
      expect(c.itemTotal(item)).toBe(550);
    });
  });

  // ─────── clientMarkupPercent ───────

  describe('clientMarkupPercent', () => {
    it('возвращает 0 если клиент не выбран', () => {
      const c = createComponent();
      expect(c.clientMarkupPercent()).toBe(0);
    });

    it('возвращает personalMarkupPercent выбранного клиента', () => {
      const c = createComponent();
      c.clients.set([MOCK_CLIENT_WITH_MARKUP]);
      c.selectedClientId.set('cli-3');
      expect(c.clientMarkupPercent()).toBe(5);
    });

    it('возвращает 0 если у выбранного клиента нет personalMarkupPercent', () => {
      const c = createComponent();
      c.clients.set([MOCK_CLIENT_NO_MARKUP]);
      c.selectedClientId.set('cli-1');
      expect(c.clientMarkupPercent()).toBe(0);
    });
  });
});
