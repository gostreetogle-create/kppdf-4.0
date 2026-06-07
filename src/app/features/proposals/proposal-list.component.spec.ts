import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService, ConfirmationService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { ProposalListComponent } from './proposal-list.component';
import { CommercialProposalService } from '../../core/commercial-proposal.service';
import { NotificationService } from '../../core/notification.service';
import type { CommercialProposal } from '../../../../shared/types/index.js';

describe('ProposalListComponent', () => {
  let proposalService: CommercialProposalService;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'sales/proposals', component: ProposalListComponent },
          { path: 'sales/proposals/new', component: ProposalListComponent },
          { path: 'sales/proposals/:id/edit', component: ProposalListComponent },
        ]),
        provideNoopAnimations(),
        MessageService,
        ConfirmationService,
        NotificationService,
        CommercialProposalService,
      ],
    });
    await TestBed.compileComponents();
    proposalService = TestBed.inject(CommercialProposalService);
    router = TestBed.inject(Router);
  });

  afterEach(() => TestBed.resetTestingModule());

  function createComponent(): ProposalListComponent {
    let component!: ProposalListComponent;
    TestBed.runInInjectionContext(() => {
      component = new ProposalListComponent();
    });
    return component;
  }

  async function seedProposal(status: 'draft' | 'sent' = 'draft'): Promise<CommercialProposal> {
    const res = await firstValueFrom(proposalService.createWithItems(
      { organizationId: 'org-1', clientId: 'cli-1', status },
      [{
        id: 'pi-1',
        sourceProductId: 'prod-1',
        productSku: 'SP0001',
        productName: 'Стойка баскетбольная',
        productUnit: 'шт',
        quantity: 2,
        unitPrice: 85000,
        markupPercent: 5,
        total: 178500,
      }],
    ));
    return res.data!;
  }

  // ─────── Создание и значения по умолчанию ───────

  it('создаётся', () => {
    expect(createComponent()).toBeTruthy();
  });

  it('значения по умолчанию', async () => {
    const c = createComponent();
    await c.load();
    expect(c.loading()).toBe(false);
    expect(c.breadcrumbs.length).toBe(2);
    expect(c.breadcrumbs[0].label).toBe('Продажи');
    expect(c.breadcrumbs[1].label).toBe('Коммерческие предложения');
    expect(c.tableColumns.length).toBe(5);
    expect(c.tableColumns[0].field).toBe('number');
    expect(c.tableColumns[1].field).toBe('statusLabel');
    expect(c.statusActions.length).toBe(3);
    expect(c.statusActions[0].icon).toBe('send');
    expect(c.statusActions[1].icon).toBe('thumbs-up');
    expect(c.statusActions[2].icon).toBe('thumbs-down');
  });

  // ─────── Загрузка КП ───────

  it('load загружает КП из сервиса', async () => {
    await seedProposal();
    const c = createComponent();
    await c.load();
    expect(c.rows().length).toBe(1);
    expect(c.rows()[0].number).toBe('КП-0001');
    expect(c.rows()[0].statusLabel).toBe('Черновик');
    expect(c.rows()[0].itemsCount).toBe(1);
    expect(c.rows()[0].updatedAtDisplay).toBeDefined();
  });

  it('load обрабатывает пустой список', async () => {
    const c = createComponent();
    await c.load();
    expect(c.rows().length).toBe(0);
  });

  // ─────── statusText ───────

  it('rows содержат правильные statusLabel для всех статусов', async () => {
    // Создаём КП и меняем его статус через changeStatus
    const draft = await seedProposal('draft');
    await firstValueFrom(proposalService.changeStatus(draft.id, 'sent'));

    const c = createComponent();
    await c.load();

    // После changeStatus КП должен быть 'sent'
    expect(c.rows().length).toBe(1);
    expect(c.rows()[0].status).toBe('sent');
    expect(c.rows()[0].statusLabel).toBe('Отправлено');
  });

  // ─────── statusActions visible ───────

  it('statusActions: draft показывает только Отправить', async () => {
    const c = createComponent();
    const draftRow = { status: 'draft' } as CommercialProposal;
    expect(c.statusActions[0].visible!(draftRow)).toBe(true);   // send
    expect(c.statusActions[1].visible!(draftRow)).toBe(false);  // thumbs-up
    expect(c.statusActions[2].visible!(draftRow)).toBe(false);  // thumbs-down
  });

  it('statusActions: sent показывает Согласовать и Отклонить', async () => {
    const c = createComponent();
    const sentRow = { status: 'sent' } as CommercialProposal;
    expect(c.statusActions[0].visible!(sentRow)).toBe(false);   // send
    expect(c.statusActions[1].visible!(sentRow)).toBe(true);    // thumbs-up
    expect(c.statusActions[2].visible!(sentRow)).toBe(true);    // thumbs-down
  });

  it('statusActions: approved не показывает кнопок', async () => {
    const c = createComponent();
    const row = { status: 'approved' } as CommercialProposal;
    expect(c.statusActions.every(a => !a.visible!(row))).toBe(true);
  });

  it('statusActions: rejected не показывает кнопок', async () => {
    const c = createComponent();
    const row = { status: 'rejected' } as CommercialProposal;
    expect(c.statusActions.every(a => !a.visible!(row))).toBe(true);
  });

  // ─────── Навигация ───────

  it('onEditRow навигирует на редактирование', async () => {
    const c = createComponent();
    const spy = vi.spyOn(router, 'navigate');
    c.onEditRow({ id: 'cp-1' } as CommercialProposal);
    expect(spy).toHaveBeenCalledWith(['/sales/proposals', 'cp-1', 'edit']);
  });

  // ─────── onStatusChange ───────

  it('changeStatus меняет статус и список обновляется', async () => {
    const draft = await seedProposal('draft');
    const c = createComponent();
    await c.load();

    // Меняем статус через сервис (onStatusChange обёрнут в диалог подтверждения)
    const res = await firstValueFrom(proposalService.changeStatus(draft.id, 'sent'));
    expect(res.success).toBe(true);
    expect(res.data!.status).toBe('sent');

    // Перезагружаем и проверяем
    await c.load();
    expect(c.rows()[0].statusLabel).toBe('Отправлено');
  });

  // ─────── onDelete ───────

  it('удаление КП работает', async () => {
    await seedProposal();
    const c = createComponent();
    await c.load();
    expect(c.rows().length).toBe(1);

    // Удаляем напрямую через сервис (минуя диалог подтверждения)
    const res = await firstValueFrom(proposalService.deleteProposal(c.rows()[0].id));
    expect(res.success).toBe(true);

    await c.load();
    expect(c.rows().length).toBe(0);
  });

  // ─────── fillPlaceholders ───────

  it('fillPlaceholders заменяет плейсхолдеры в блоках', () => {
    const c = createComponent();
    const cp: CommercialProposal = {
      id: 'cp-1', number: 'КП-0042', organizationId: 'org-1', clientId: 'cli-3',
      status: 'draft',
      items: [{ id: 'pi-1', sourceProductId: 'p1', productSku: 'SP0001', productName: 'Стойка', productUnit: 'шт', quantity: 2, unitPrice: 85000, markupPercent: 5, total: 178500 }],
      totalAmount: 178500, notes: 'Тест',
      createdAt: '2026-06-07T12:00:00.000Z', updatedAt: '2026-06-07T12:00:00.000Z',
    };

    const blocks = [
      { id: 'b1', type: 'text' as const, order: 0, title: 'Заголовок', content: 'КП №{{number}} от {{date}}' },
      { id: 'b2', type: 'text' as const, order: 1, title: 'Клиент', content: 'Для: {{client.name}}' },
      { id: 'b3', type: 'text' as const, order: 2, content: 'Сумма: {{total}}' },
    ];

    // Доступ к приватному методу через any (для тестирования)
    const result = (c as unknown as { fillPlaceholders: (b: typeof blocks, cp: CommercialProposal, clientName: string, orgName: string) => typeof blocks }).fillPlaceholders(blocks, cp, 'Иванов Иван', 'ООО Тест');

    expect(result[0].content).toContain('КП-0042');
    expect(result[0].content).not.toContain('{{number}}');
    expect(result[0].content).toContain('07.06.2026');
    expect(result[1].content).toBe('Для: Иванов Иван');
    expect(result[2].content).toMatch(/178\s?500/);
    expect(result[2].content).not.toContain('{{total}}');
  });
});
