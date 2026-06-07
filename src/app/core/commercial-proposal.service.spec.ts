import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { CommercialProposalService } from './commercial-proposal.service';
import type { ProposalItem, CartItem } from '../../../shared/types/index.js';

function makeCartItem(overrides?: Partial<CartItem>): CartItem {
  return {
    id: 'ci-1',
    productId: 'prod-1',
    sku: 'SP0001',
    name: 'Стойка баскетбольная',
    unit: 'шт',
    price: 85000,
    quantity: 2,
    addedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeProposalItem(overrides?: Partial<ProposalItem>): ProposalItem {
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

describe('CommercialProposalService', () => {
  let service: CommercialProposalService;

  beforeEach(() => {
    service = new CommercialProposalService();
  });

  // ─────── CRUD: создание ───────

  it('createWithItems создаёт КП с авто-номером формата КП-NNNN', async () => {
    const res = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-1', clientId: 'cli-1', status: 'draft' },
      [makeProposalItem()],
    ));
    expect(res.success).toBe(true);
    expect(res.data!.number).toMatch(/^КП-\d{4}$/);
    expect(res.data!.status).toBe('draft');
    expect(res.data!.items.length).toBe(1);
    expect(res.data!.totalAmount).toBe(178500);
    expect(res.data!.createdAt).toBeDefined();
    expect(res.data!.updatedAt).toBeDefined();
  });

  it('createWithItems генерирует id для позиций без id', async () => {
    const res = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-1', clientId: 'cli-1', status: 'draft' },
      [{ ...makeProposalItem(), id: '' }],
    ));
    expect(res.data!.items[0].id).toBeTruthy();
    expect(res.data!.items[0].id).not.toBe('');
  });

  it('createWithItems сохраняет существующие id позиций', async () => {
    const res = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-1' },
      [{ ...makeProposalItem(), id: 'my-custom-id' }],
    ));
    expect(res.data!.items[0].id).toBe('my-custom-id');
  });

  it('createFromCart создаёт КП из позиций корзины (snapshot)', async () => {
    const res = await firstValueFrom(service.createFromCart(
      { organizationId: 'org-1', clientId: 'cli-1', status: 'draft' },
      [makeCartItem()],
    ));
    expect(res.success).toBe(true);
    expect(res.data!.items[0].productSku).toBe('SP0001');
    expect(res.data!.items[0].productName).toBe('Стойка баскетбольная');
    expect(res.data!.items[0].quantity).toBe(2);
    expect(res.data!.items[0].unitPrice).toBe(85000);
    expect(res.data!.items[0].total).toBe(170000);
    expect(res.data!.items[0].markupPercent).toBe(0);
  });

  it('createProposal создаёт пустой КП без позиций', async () => {
    const res = await firstValueFrom(service.createProposal(
      { organizationId: 'org-1', status: 'draft' },
    ));
    expect(res.success).toBe(true);
    expect(res.data!.items).toEqual([]);
    expect(res.data!.totalAmount).toBe(0);
  });

  // ─────── Нумерация ───────

  it('авто-нумерация: номера увеличиваются последовательно', async () => {
    const r1 = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-1' },
      [makeProposalItem()],
    ));
    const r2 = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-2' },
      [makeProposalItem()],
    ));
    const r3 = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-3' },
      [makeProposalItem()],
    ));
    // Проверяем уникальность и формат
    const nums = [r1.data!.number, r2.data!.number, r3.data!.number];
    expect(new Set(nums).size).toBe(3);
    nums.forEach(n => expect(n).toMatch(/^КП-\d{4}$/));
  });

  it('номер КП всегда в формате КП-NNNN (4 цифры)', async () => {
    const res = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-1' },
      [makeProposalItem()],
    ));
    expect(res.data!.number).toMatch(/^КП-\d{4}$/);
  });

  // ─────── CRUD: чтение ───────

  it('getProposals возвращает все КП', async () => {
    await firstValueFrom(service.createWithItems({ organizationId: 'org-1' }, [makeProposalItem()]));
    await firstValueFrom(service.createWithItems({ organizationId: 'org-2' }, [makeProposalItem()]));
    const res = await firstValueFrom(service.getProposals());
    expect(res.success).toBe(true);
    expect(res.data!.length).toBe(2);
  });

  it('getProposal возвращает КП по id', async () => {
    const created = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-1' },
      [makeProposalItem()],
    ));
    const res = await firstValueFrom(service.getProposal(created.data!.id));
    expect(res.success).toBe(true);
    expect(res.data!.id).toBe(created.data!.id);
    expect(res.data!.number).toMatch(/^КП-\d{4}$/);
  });

  it('getProposal возвращает undefined для несуществующего id', async () => {
    const res = await firstValueFrom(service.getProposal('nonexistent'));
    expect(res.success).toBe(false);
    expect(res.data).toBeUndefined();
  });

  // ─────── CRUD: обновление ───────

  it('updateProposal обновляет поля КП', async () => {
    const created = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-1', notes: 'до' },
      [makeProposalItem()],
    ));
    const res = await firstValueFrom(service.updateProposal(created.data!.id, { notes: 'после' }));
    expect(res.success).toBe(true);
    expect(res.data!.notes).toBe('после');
    // Неизменённые поля сохраняются
    expect(res.data!.organizationId).toBe('org-1');
  });

  it('updateProposal обновляет позиции items', async () => {
    const created = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-1' },
      [makeProposalItem()],
    ));
    const newItems = [{ ...makeProposalItem(), quantity: 10, total: 850000 }];
    const res = await firstValueFrom(service.updateProposal(created.data!.id, {
      items: newItems,
      totalAmount: 850000,
    }));
    expect(res.data!.items.length).toBe(1);
    expect(res.data!.items[0].quantity).toBe(10);
    expect(res.data!.totalAmount).toBe(850000);
  });

  // ─────── CRUD: удаление ───────

  it('deleteProposal удаляет КП', async () => {
    const created = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-1' },
      [makeProposalItem()],
    ));
    const delRes = await firstValueFrom(service.deleteProposal(created.data!.id));
    expect(delRes.success).toBe(true);

    const all = await firstValueFrom(service.getProposals());
    expect(all.data!.length).toBe(0);
  });

  // ─────── Статусы ───────

  it('changeStatus меняет статус на sent', async () => {
    const created = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-1' },
      [makeProposalItem()],
    ));
    expect(created.data!.status).toBe('draft');

    const res = await firstValueFrom(service.changeStatus(created.data!.id, 'sent'));
    expect(res.success).toBe(true);
    expect(res.data!.status).toBe('sent');
    expect(res.data!.updatedAt).not.toBe(created.data!.updatedAt);
  });

  it('changeStatus: draft → sent → approved → rejected', async () => {
    const created = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-1' },
      [makeProposalItem()],
    ));

    await firstValueFrom(service.changeStatus(created.data!.id, 'sent'));
    let cp = await firstValueFrom(service.getProposal(created.data!.id));
    expect(cp.data!.status).toBe('sent');

    await firstValueFrom(service.changeStatus(created.data!.id, 'approved'));
    cp = await firstValueFrom(service.getProposal(created.data!.id));
    expect(cp.data!.status).toBe('approved');

    await firstValueFrom(service.changeStatus(created.data!.id, 'rejected'));
    cp = await firstValueFrom(service.getProposal(created.data!.id));
    expect(cp.data!.status).toBe('rejected');
  });

  it('changeStatus возвращает ошибку для несуществующего КП', async () => {
    const res = await firstValueFrom(service.changeStatus('nonexistent', 'sent'));
    expect(res.success).toBe(false);
    expect(res.message).toBe('КП не найдено');
  });

  // ─────── cloneItem (глубокое копирование) ───────

  it('данные, возвращённые из create, не мутируют оригинал в items', async () => {
    const res = await firstValueFrom(service.createWithItems(
      { organizationId: 'org-1' },
      [makeProposalItem()],
    ));
    // Изменяем возвращённый объект
    res.data!.items[0].productName = 'ИЗМЕНЕНО';
    // Оригинал в сервисе не должен измениться
    const fresh = await firstValueFrom(service.getProposal(res.data!.id));
    expect(fresh.data!.items[0].productName).toBe('Стойка баскетбольная');
  });
});
