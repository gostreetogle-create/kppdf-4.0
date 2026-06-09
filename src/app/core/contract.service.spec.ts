import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ContractService } from './contract.service';
import { API_URL } from './api-url.token';
import type { Contract, CommercialProposal } from '../../../shared/types/index.js';

const MOCK_CONTRACT: Contract = {
  id: 'c-1', number: 'Д-0001', organizationId: 'org-1', clientId: 'cli-1',
  status: 'draft', items: [{ id: 'ci-1', sourceProductId: 'p1', productSku: 'SP0001', productName: 'Стойка', productUnit: 'шт', quantity: 2 }],
  notes: '', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
};

function makeProposal(): CommercialProposal {
  return {
    id: 'cp-1', number: 'КП-0001', status: 'approved',
    organizationId: 'org-1', clientId: 'cli-1',
    items: [{ id: 'pi-1', sourceProductId: 'p1', productSku: 'SP0001', productName: 'Стойка', productUnit: 'шт', quantity: 2, unitPrice: 85000, markupPercent: 5, total: 178500 }],
    totalAmount: 178500,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('ContractService', () => {
  let service: ContractService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(ContractService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('createContract создаёт договор с авто-номером Д-NNNN', async () => {
    const p = firstValueFrom(service.createContract({ organizationId: 'org-1', status: 'draft', items: [MOCK_CONTRACT.items[0]] }));
    const req = httpMock.expectOne('/api/v1/contracts');
    expect(req.request.body.number).toMatch(/^Д-\d{4}$/);
    expect(req.request.body.status).toBe('draft');
    req.flush({ success: true, data: MOCK_CONTRACT });
    expect((await p).data!.items.length).toBe(1);
  });

  it('createFromProposal создаёт договор из КП (snapshot без цен)', async () => {
    const p = firstValueFrom(service.createFromProposal({ organizationId: 'org-1', status: 'draft', proposalId: 'cp-1' }, makeProposal()));
    const req = httpMock.expectOne('/api/v1/contracts');
    expect(req.request.body.items.length).toBe(1);
    expect(req.request.body.items[0].productName).toBe('Стойка');
    expect((req.request.body.items[0] as Record<string, unknown>).unitPrice).toBeUndefined();
    req.flush({ success: true, data: { ...MOCK_CONTRACT, proposalId: 'cp-1' } });
    expect((await p).data!.proposalId).toBe('cp-1');
  });

  it('авто-нумерация уникальна', async () => {
    const p1 = firstValueFrom(service.createContract({ organizationId: 'org-1', status: 'draft' }));
    const r1 = httpMock.expectOne('/api/v1/contracts');
    r1.flush({ success: true, data: { ...MOCK_CONTRACT, number: 'Д-0001' } });

    const p2 = firstValueFrom(service.createContract({ organizationId: 'org-2', status: 'draft' }));
    const r2 = httpMock.expectOne('/api/v1/contracts');
    r2.flush({ success: true, data: { ...MOCK_CONTRACT, number: 'Д-0002' } });

    const [res1, res2] = await Promise.all([p1, p2]);
    expect(res1.data!.number).not.toBe(res2.data!.number);
  });

  it('getContracts возвращает все', async () => {
    const p = firstValueFrom(service.getContracts());
    httpMock.expectOne('/api/v1/contracts').flush({ success: true, data: [MOCK_CONTRACT] });
    expect((await p).data!.length).toBe(1);
  });

  it('getContract возвращает по id', async () => {
    const p = firstValueFrom(service.getContract('c-1'));
    httpMock.expectOne('/api/v1/contracts/c-1').flush({ success: true, data: MOCK_CONTRACT });
    expect((await p).data!.id).toBe('c-1');
  });

  it('updateContract обновляет через PUT', async () => {
    const p = firstValueFrom(service.updateContract('c-1', { notes: 'после' }));
    const req = httpMock.expectOne('/api/v1/contracts/c-1');
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true, data: { ...MOCK_CONTRACT, notes: 'после' } });
    expect((await p).data!.notes).toBe('после');
  });

  it('deleteContract удаляет через DELETE', async () => {
    const p = firstValueFrom(service.deleteContract('c-1'));
    httpMock.expectOne('/api/v1/contracts/c-1').flush({ success: true, data: null });
    expect((await p).success).toBe(true);
  });

  it('changeStatus: draft → active → completed → terminated', async () => {
    const p1 = firstValueFrom(service.changeStatus('c-1', 'active'));
    httpMock.expectOne('/api/v1/contracts/c-1').flush({ success: true, data: { ...MOCK_CONTRACT, status: 'active' } });
    expect((await p1).data!.status).toBe('active');

    const p2 = firstValueFrom(service.changeStatus('c-1', 'completed'));
    httpMock.expectOne('/api/v1/contracts/c-1').flush({ success: true, data: { ...MOCK_CONTRACT, status: 'completed' } });
    expect((await p2).data!.status).toBe('completed');

    const p3 = firstValueFrom(service.changeStatus('c-1', 'terminated'));
    httpMock.expectOne('/api/v1/contracts/c-1').flush({ success: true, data: { ...MOCK_CONTRACT, status: 'terminated' } });
    expect((await p3).data!.status).toBe('terminated');
  });

  it('changeStatus ошибка для невалидного статуса', async () => {
    const p = firstValueFrom(service.changeStatus('c-1', 'invalid' as unknown as 'draft'));
    expect((await p).success).toBe(false);
  });
});
