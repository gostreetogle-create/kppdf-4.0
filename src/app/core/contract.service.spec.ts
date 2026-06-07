import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { ContractService } from './contract.service';
import type { CommercialProposal } from '../../../shared/types/index.js';

function makeProposal(): CommercialProposal {
  return {
    id: 'cp-1', number: 'КП-0001', status: 'approved',
    organizationId: 'org-1', clientId: 'cli-1',
    items: [{
      id: 'pi-1', sourceProductId: 'p1', productSku: 'SP0001',
      productName: 'Стойка', productUnit: 'шт',
      quantity: 2, unitPrice: 85000, markupPercent: 5, total: 178500,
    }],
    totalAmount: 178500,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('ContractService', () => {
  let service: ContractService;

  beforeEach(() => {
    service = new ContractService();
  });

  it('createContract создаёт договор с авто-номером', async () => {
    const res = await firstValueFrom(service.createContract({
      organizationId: 'org-1', status: 'draft',
      items: [{ id: 'ci-1', sourceProductId: 'p1', productSku: 'SP0001', productName: 'Стойка', productUnit: 'шт', quantity: 2 }],
    }));
    expect(res.success).toBe(true);
    expect(res.data!.number).toMatch(/^Д-\d{4}$/);
    expect(res.data!.status).toBe('draft');
    expect(res.data!.items.length).toBe(1);
  });

  it('createFromProposal создаёт договор из КП (snapshot без цен)', async () => {
    const res = await firstValueFrom(service.createFromProposal(
      { organizationId: 'org-1', status: 'draft', proposalId: 'cp-1' },
      makeProposal(),
    ));
    expect(res.success).toBe(true);
    expect(res.data!.proposalId).toBe('cp-1');
    expect(res.data!.items.length).toBe(1);
    expect(res.data!.items[0].productName).toBe('Стойка');
    expect(res.data!.items[0].quantity).toBe(2);
    expect((res.data!.items[0] as Record<string, unknown>).unitPrice).toBeUndefined();
  });

  it('авто-нумерация: Д-0001, Д-0002', async () => {
    const r1 = await firstValueFrom(service.createContract({ organizationId: 'org-1', status: 'draft' }));
    const r2 = await firstValueFrom(service.createContract({ organizationId: 'org-2', status: 'draft' }));
    expect(r1.data!.number).toMatch(/^Д-\d{4}$/);
    expect(r2.data!.number).toMatch(/^Д-\d{4}$/);
    expect(r1.data!.number).not.toBe(r2.data!.number);
  });

  it('getContracts возвращает все договоры', async () => {
    await firstValueFrom(service.createContract({ organizationId: 'org-1', status: 'draft' }));
    const res = await firstValueFrom(service.getContracts());
    expect(res.data!.length).toBe(1);
  });

  it('getContract возвращает по id', async () => {
    const c = await firstValueFrom(service.createContract({ organizationId: 'org-1', status: 'draft' }));
    const res = await firstValueFrom(service.getContract(c.data!.id));
    expect(res.success).toBe(true);
    expect(res.data!.id).toBe(c.data!.id);
  });

  it('updateContract обновляет поля', async () => {
    const c = await firstValueFrom(service.createContract({ organizationId: 'org-1', status: 'draft', notes: 'до' }));
    const res = await firstValueFrom(service.updateContract(c.data!.id, { notes: 'после' }));
    expect(res.data!.notes).toBe('после');
  });

  it('deleteContract удаляет', async () => {
    const c = await firstValueFrom(service.createContract({ organizationId: 'org-1', status: 'draft' }));
    await firstValueFrom(service.deleteContract(c.data!.id));
    const all = await firstValueFrom(service.getContracts());
    expect(all.data!.length).toBe(0);
  });

  it('changeStatus: draft → active → completed → terminated', async () => {
    const c = await firstValueFrom(service.createContract({ organizationId: 'org-1', status: 'draft' }));
    await firstValueFrom(service.changeStatus(c.data!.id, 'active'));
    let ct = await firstValueFrom(service.getContract(c.data!.id));
    expect(ct.data!.status).toBe('active');

    await firstValueFrom(service.changeStatus(c.data!.id, 'completed'));
    ct = await firstValueFrom(service.getContract(c.data!.id));
    expect(ct.data!.status).toBe('completed');

    await firstValueFrom(service.changeStatus(c.data!.id, 'terminated'));
    ct = await firstValueFrom(service.getContract(c.data!.id));
    expect(ct.data!.status).toBe('terminated');
  });

  it('changeStatus для несуществующего возвращает ошибку', async () => {
    const res = await firstValueFrom(service.changeStatus('nonexistent', 'active'));
    expect(res.success).toBe(false);
  });
});
