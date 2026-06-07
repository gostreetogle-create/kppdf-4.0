import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService, ConfirmationService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { ProposalEditorComponent } from './proposal-editor.component';
import { CommercialProposalService } from '../../core/commercial-proposal.service';
import { CartService } from '../../core/cart.service';
import { OrganizationService } from '../../core/organization.service';
import { ClientService } from '../../core/client.service';
import { NotificationService } from '../../core/notification.service';
import type { ProposalItem, Client } from '../../../../shared/types/index.js';

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

function makeItem(overrides?: Partial<ProposalItem>): ProposalItem {
  return {
    id: 'pi-1',
    sourceProductId: 'prod-1',
    productSku: 'SP0001',
    productName: 'Стойка баскетбольная',
    productUnit: 'шт',
    quantity: 2,
    unitPrice: 85000,
    markupPercent: 5,
    total: 178500,
    ...overrides,
  };
}

describe('ProposalEditorComponent', () => {
  let notification: NotificationService;
  let proposalService: CommercialProposalService;
  let cartService: CartService;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'sales/proposals', component: ProposalEditorComponent },
          { path: 'sales/proposals/new', component: ProposalEditorComponent },
          { path: 'sales/proposals/:id/edit', component: ProposalEditorComponent },
        ]),
        provideNoopAnimations(),
        MessageService,
        ConfirmationService,
        NotificationService,
        CommercialProposalService,
        CartService,
        OrganizationService,
        ClientService,
      ],
    });
    await TestBed.compileComponents();
    notification = TestBed.inject(NotificationService);
    proposalService = TestBed.inject(CommercialProposalService);
    cartService = TestBed.inject(CartService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    cartService.clearCart();
  });

  function createComponent(): ProposalEditorComponent {
    let component!: ProposalEditorComponent;
    TestBed.runInInjectionContext(() => {
      component = new ProposalEditorComponent();
    });
    return component;
  }

  // ─────── Создание и значения по умолчанию ───────

  it('создаётся', () => {
    expect(createComponent()).toBeTruthy();
  });

  it('значения по умолчанию (новый КП)', () => {
    const c = createComponent();
    expect(c.isNew()).toBe(true);
    expect(c.proposalId()).toBeNull();
    expect(c.proposalNumber()).toBe('');
    expect(c.loading()).toBe(false);
    expect(c.saving()).toBe(false);
    expect(c.editStatus()).toBe('draft');
    expect(c.editOrganizationId()).toBe('');
    expect(c.editClientId()).toBe('');
    expect(c.editNotes()).toBe('');
    expect(c.items().length).toBe(0);
    expect(c.totalAmount()).toBe(0);
    expect(c.breadcrumbs.length).toBe(3);
    expect(c.breadcrumbs[2].label).toBe('Новое КП');
    expect(c.statusOptions.length).toBe(4);
  });

  // ─────── totalAmount (computed) ───────

  it('totalAmount суммирует позиции', () => {
    const c = createComponent();
    c.items.set([
      makeItem({ total: 100 }),
      makeItem({ id: 'pi-2', total: 200 }),
    ]);
    expect(c.totalAmount()).toBe(300);
  });

  it('totalAmount = 0 для пустого списка', () => {
    const c = createComponent();
    expect(c.totalAmount()).toBe(0);
  });

  // ─────── Загрузка из корзины ───────

  it('loadFromCart загружает позиции из корзины (без клиента — наценка 0)', () => {
    // Добавляем товар в корзину
    cartService.addItem({
      id: 'prod-1',
      sku: 'SP0001',
      name: 'Стойка баскетбольная',
      categoryId: 'cat-sp',
      productType: 'manufactured',
      description: '',
      basePrice: 85000,
      unit: 'шт',
      weightKg: 120,
      dimensions: '',
      material: '',
      hasPassport: false,
      hasDrawing: false,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    });

    const c = createComponent();
    const notifySpy = vi.spyOn(notification, 'success');
    c.loadFromCart();

    expect(c.items().length).toBe(1);
    expect(c.items()[0].productSku).toBe('SP0001');
    expect(c.items()[0].markupPercent).toBe(0);
    expect(c.items()[0].total).toBe(85000);
    expect(notifySpy).toHaveBeenCalledWith('Загружено 1 позиций из корзины');
  });

  it('loadFromCart применяет персональную наценку клиента', () => {
    cartService.addItem({
      id: 'prod-1', sku: 'SP0001', name: 'Стойка',
      categoryId: 'cat-sp', productType: 'manufactured',
      description: '', basePrice: 100000, unit: 'шт',
      weightKg: 120, dimensions: '', material: '',
      hasPassport: false, hasDrawing: false, isActive: true,
      createdAt: '', updatedAt: '',
    });

    const c = createComponent();
    // Регистрируем клиента в сигнале (ngOnInit не вызывается в runInInjectionContext)
    c.clients.set([MOCK_CLIENT_WITH_MARKUP]);
    c.editClientId.set('cli-3'); // Сидорова с personalMarkupPercent: 5
    const notifySpy = vi.spyOn(notification, 'success');
    c.loadFromCart();

    expect(c.items()[0].markupPercent).toBe(5);
    // total = 100000 * (1 + 5/100) * 1 = 105000
    expect(c.items()[0].total).toBe(105000);
    expect(notifySpy).toHaveBeenCalledWith('Загружено 1 позиций (наценка клиента: 5%)');
  });

  it('clientMarkupPercent = 0 если клиент не выбран', () => {
    const c = createComponent();
    expect(c.clientMarkupPercent()).toBe(0);
  });

  it('clientMarkupPercent = 0 если у клиента нет наценки', () => {
    const c = createComponent();
    c.clients.set([MOCK_CLIENT_NO_MARKUP]);
    c.editClientId.set('cli-1'); // Иванов без personalMarkupPercent
    expect(c.clientMarkupPercent()).toBe(0);
  });

  it('loadFromCart показывает предупреждение при пустой корзине', () => {
    const c = createComponent();
    const notifySpy = vi.spyOn(notification, 'warn');
    c.loadFromCart();
    expect(notifySpy).toHaveBeenCalledWith('Корзина пуста');
    expect(c.items().length).toBe(0);
  });

  // ─────── onItemFieldChange ───────

  it('onItemFieldChange обновляет quantity и пересчитывает total', () => {
    const c = createComponent();
    c.items.set([makeItem()]); // quantity=2, unitPrice=85000, markup=5%, total=178500
    c.onItemFieldChange(0, 'quantity', 5);
    expect(c.items()[0].quantity).toBe(5);
    // total = 85000 * 1.05 * 5 = 446250
    expect(c.items()[0].total).toBe(446250);
  });

  it('onItemFieldChange обновляет unitPrice и пересчитывает total', () => {
    const c = createComponent();
    c.items.set([makeItem()]); // quantity=2, unitPrice=85000, markup=5%, total=178500
    c.onItemFieldChange(0, 'unitPrice', 100000);
    expect(c.items()[0].unitPrice).toBe(100000);
    // total = 100000 * 1.05 * 2 = 210000
    expect(c.items()[0].total).toBe(210000);
  });

  it('onItemFieldChange обновляет markupPercent и пересчитывает total', () => {
    const c = createComponent();
    c.items.set([makeItem()]); // quantity=2, unitPrice=85000, markup=5%, total=178500
    c.onItemFieldChange(0, 'markupPercent', 10);
    expect(c.items()[0].markupPercent).toBe(10);
    // total = 85000 * 1.10 * 2 = 187000
    expect(c.items()[0].total).toBe(187000);
  });

  it('onItemFieldChange игнорирует quantity < 1', () => {
    const c = createComponent();
    c.items.set([makeItem()]);
    c.onItemFieldChange(0, 'quantity', 0);
    expect(c.items()[0].quantity).toBe(2); // не изменилось
  });

  it('onItemFieldChange игнорирует NaN', () => {
    const c = createComponent();
    c.items.set([makeItem()]);
    c.onItemFieldChange(0, 'unitPrice', 'abc');
    expect(c.items()[0].unitPrice).toBe(85000); // не изменилось
  });

  // ─────── removeItem ───────

  it('removeItem удаляет позицию по индексу', () => {
    const c = createComponent();
    c.items.set([
      makeItem({ id: 'pi-1' }),
      makeItem({ id: 'pi-2', productName: 'Товар 2' }),
      makeItem({ id: 'pi-3', productName: 'Товар 3' }),
    ]);
    c.removeItem(1);
    expect(c.items().length).toBe(2);
    expect(c.items()[0].id).toBe('pi-1');
    expect(c.items()[1].id).toBe('pi-3');
  });

  // ─────── save: валидация ───────

  it('save показывает ошибку если нет позиций', async () => {
    const c = createComponent();
    const notifySpy = vi.spyOn(notification, 'error');
    await c.save();
    expect(notifySpy).toHaveBeenCalledWith('Добавьте хотя бы одну позицию');
  });

  // ─────── save: создание нового КП ───────

  it('save создаёт новый КП и очищает корзину', async () => {
    const c = createComponent();
    c.items.set([makeItem()]);
    c.editOrganizationId.set('org-1');
    c.editClientId.set('cli-1');
    c.editNotes.set('Тестовое КП');

    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const notifySpy = vi.spyOn(notification, 'success');
    await c.save();

    expect(notifySpy).toHaveBeenCalledWith('Коммерческое предложение создано');
    expect(navigateSpy).toHaveBeenCalledWith(['/sales/proposals']);
    expect(cartService.isEmpty()).toBe(true);

    // Проверяем что КП создано в сервисе
    const all = await firstValueFrom(proposalService.getProposals());
    expect(all.data!.length).toBe(1);
    expect(all.data![0].number).toMatch(/^КП-\d{4}$/);
    expect(all.data![0].items.length).toBe(1);
    expect(all.data![0].notes).toBe('Тестовое КП');
  });

  // ─────── cancel ───────

  // ─────── createVariants ───────

  it('createVariants создаёт 3 КП с разными наценками', async () => {
    const c = createComponent();
    c.items.set([makeItem({ unitPrice: 100000, markupPercent: 0, total: 200000 })]); // quantity=2
    c.editOrganizationId.set('org-1');

    const navSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const notifySpy = vi.spyOn(notification, 'success');
    await c.createVariants();

    expect(notifySpy).toHaveBeenCalledWith('Создано 3 варианта КП (наценка: 0%, 5%, 10%)');
    expect(navSpy).toHaveBeenCalledWith(['/sales/proposals']);

    // Проверяем что 3 КП созданы с разными наценками
    const all = await firstValueFrom(proposalService.getProposals());
    expect(all.data!.length).toBe(3);
    const markups = all.data!.map(cp => cp.items[0].markupPercent).sort((a, b) => a - b);
    expect(markups).toEqual([0, 5, 10]);
  });

  // ─────── cancel ───────

  it('cancel навигирует обратно к списку', () => {
    const c = createComponent();
    const spy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    c.cancel();
    expect(spy).toHaveBeenCalledWith(['/sales/proposals']);
  });
});
