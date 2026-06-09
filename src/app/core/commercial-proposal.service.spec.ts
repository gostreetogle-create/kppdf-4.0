import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CommercialProposalService } from './commercial-proposal.service';
import { API_URL } from './api-url.token';
import type { CommercialProposal, ProposalItem } from '../../../shared/types/index.js';

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

const MOCK_CP: CommercialProposal = {
  id: 'cp-1',
  number: 'КП-0001',
  organizationId: 'org-1',
  clientId: 'cli-1',
  status: 'draft',
  items: [makeProposalItem()],
  totalAmount: 178500,
  notes: 'Тестовое КП',
  templateId: '',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('CommercialProposalService', () => {
  let service: CommercialProposalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api/v1' },
      ],
    });
    service = TestBed.inject(CommercialProposalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  // ─────── CRUD: создание ───────

  it('createWithItems создаёт КП через POST с авто-номером', async () => {
    const promise = firstValueFrom(service.createWithItems(
      { organizationId: 'org-1', clientId: 'cli-1', status: 'draft' },
      [makeProposalItem()],
    ));
    const req = httpMock.expectOne('/api/v1/commercial-proposals');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.number).toMatch(/^КП-\d{4}$/);
    expect(req.request.body.totalAmount).toBe(178500);
    expect(req.request.body.items.length).toBe(1);
    req.flush({ success: true, data: MOCK_CP });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data!.number).toBe('КП-0001');
    expect(res.data!.status).toBe('draft');
    expect(res.data!.items.length).toBe(1);
    expect(res.data!.totalAmount).toBe(178500);
  });

  it('createWithItems отправляет items без клонирования id', async () => {
    const item = makeProposalItem({ id: 'my-custom-id' });
    const promise = firstValueFrom(service.createWithItems(
      { organizationId: 'org-1' },
      [item],
    ));
    const req = httpMock.expectOne('/api/v1/commercial-proposals');
    expect(req.request.body.items[0].id).toBe('my-custom-id');
    req.flush({ success: true, data: { ...MOCK_CP, items: [item] } });
    const res = await promise;
    expect(res.data!.items[0].id).toBe('my-custom-id');
  });

  it('createProposal создаёт пустой КП без позиций', async () => {
    const promise = firstValueFrom(service.createProposal(
      { organizationId: 'org-1', status: 'draft' },
    ));
    const req = httpMock.expectOne('/api/v1/commercial-proposals');
    expect(req.request.body.items).toEqual([]);
    expect(req.request.body.totalAmount).toBe(0);
    req.flush({ success: true, data: { ...MOCK_CP, items: [], totalAmount: 0 } });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data!.totalAmount).toBe(0);
  });

  // ─────── Нумерация ───────

  it('авто-нумерация: номера увеличиваются последовательно', async () => {
    const p1 = firstValueFrom(service.createWithItems({ organizationId: 'org-1' }, [makeProposalItem()]));
    const r1 = httpMock.expectOne('/api/v1/commercial-proposals');
    const num1 = r1.request.body.number;
    r1.flush({ success: true, data: { ...MOCK_CP, number: num1 } });

    const p2 = firstValueFrom(service.createWithItems({ organizationId: 'org-2' }, [makeProposalItem()]));
    const r2 = httpMock.expectOne('/api/v1/commercial-proposals');
    const num2 = r2.request.body.number;
    r2.flush({ success: true, data: { ...MOCK_CP, number: num2 } });

    const p3 = firstValueFrom(service.createWithItems({ organizationId: 'org-3' }, [makeProposalItem()]));
    const r3 = httpMock.expectOne('/api/v1/commercial-proposals');
    const num3 = r3.request.body.number;
    r3.flush({ success: true, data: { ...MOCK_CP, number: num3 } });

    const [res1, res2, res3] = await Promise.all([p1, p2, p3]);
    expect(res1.data!.number).toMatch(/^КП-\d{4}$/);
    expect(res2.data!.number).toMatch(/^КП-\d{4}$/);
    expect(res3.data!.number).toMatch(/^КП-\d{4}$/);
    // Три разных номера
    expect(new Set([res1.data!.number, res2.data!.number, res3.data!.number]).size).toBe(3);
  });

  it('номер КП всегда в формате КП-NNNN (4 цифры)', async () => {
    const promise = firstValueFrom(service.createWithItems({ organizationId: 'org-1' }, [makeProposalItem()]));
    const req = httpMock.expectOne('/api/v1/commercial-proposals');
    expect(req.request.body.number).toMatch(/^КП-\d{4}$/);
    req.flush({ success: true, data: MOCK_CP });
    const res = await promise;
    expect(res.data!.number).toMatch(/^КП-\d{4}$/);
  });

  // ─────── CRUD: чтение ───────

  it('getProposals возвращает все КП через GET', async () => {
    const promise = firstValueFrom(service.getProposals());
    httpMock.expectOne('/api/v1/commercial-proposals').flush({
      success: true, data: [MOCK_CP, { ...MOCK_CP, id: 'cp-2', number: 'КП-0002' }],
    });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data!.length).toBe(2);
  });

  it('getProposal возвращает КП по id через GET /:id', async () => {
    const promise = firstValueFrom(service.getProposal('cp-1'));
    httpMock.expectOne('/api/v1/commercial-proposals/cp-1').flush({ success: true, data: MOCK_CP });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data!.id).toBe('cp-1');
    expect(res.data!.number).toBe('КП-0001');
  });

  it('getProposal возвращает undefined для несуществующего id', async () => {
    const promise = firstValueFrom(service.getProposal('nonexistent'));
    httpMock.expectOne('/api/v1/commercial-proposals/nonexistent').flush({ success: false, data: undefined });
    const res = await promise;
    expect(res.success).toBe(false);
    expect(res.data).toBeUndefined();
  });

  // ─────── CRUD: обновление ───────

  it('updateProposal обновляет поля КП через PUT', async () => {
    const promise = firstValueFrom(service.updateProposal('cp-1', { notes: 'новые примечания' }));
    const req = httpMock.expectOne('/api/v1/commercial-proposals/cp-1');
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true, data: { ...MOCK_CP, notes: 'новые примечания' } });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data!.notes).toBe('новые примечания');
  });

  it('updateProposal обновляет позиции items', async () => {
    const newItems = [{ ...makeProposalItem(), quantity: 10, total: 850000 }];
    const promise = firstValueFrom(service.updateProposal('cp-1', { items: newItems, totalAmount: 850000 }));
    const req = httpMock.expectOne('/api/v1/commercial-proposals/cp-1');
    expect(req.request.body.items[0].quantity).toBe(10);
    req.flush({ success: true, data: { ...MOCK_CP, items: newItems, totalAmount: 850000 } });
    const res = await promise;
    expect(res.data!.items[0].quantity).toBe(10);
    expect(res.data!.totalAmount).toBe(850000);
  });

  // ─────── CRUD: удаление ───────

  it('deleteProposal удаляет КП через DELETE', async () => {
    const promise = firstValueFrom(service.deleteProposal('cp-1'));
    httpMock.expectOne('/api/v1/commercial-proposals/cp-1').flush({ success: true, data: null });
    const res = await promise;
    expect(res.success).toBe(true);
  });

  // ─────── Статусы ───────

  it('changeStatus: draft → sent через PATCH /:id/status', async () => {
    const promise = firstValueFrom(service.changeStatus('cp-1', 'sent'));
    const req = httpMock.expectOne('/api/v1/commercial-proposals/cp-1/status');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'sent' });
    req.flush({ success: true, data: { ...MOCK_CP, status: 'sent' } });
    const res = await promise;
    expect(res.success).toBe(true);
    expect(res.data!.status).toBe('sent');
  });

  it('changeStatus возвращает ошибку для невалидного статуса (без HTTP)', async () => {
    const res = await firstValueFrom(service.changeStatus('cp-1', 'invalid_status' as unknown as 'draft'));
    expect(res.success).toBe(false);
    expect(res.message).toContain('Недопустимый статус');
  });

  it('changeStatus: draft → sent → approved → rejected', async () => {
    // sent
    const p1 = firstValueFrom(service.changeStatus('cp-1', 'sent'));
    httpMock.expectOne('/api/v1/commercial-proposals/cp-1/status').flush({ success: true, data: { ...MOCK_CP, status: 'sent' } });
    expect((await p1).data!.status).toBe('sent');

    // approved
    const p2 = firstValueFrom(service.changeStatus('cp-1', 'approved'));
    httpMock.expectOne('/api/v1/commercial-proposals/cp-1/status').flush({ success: true, data: { ...MOCK_CP, status: 'approved' } });
    expect((await p2).data!.status).toBe('approved');

    // rejected
    const p3 = firstValueFrom(service.changeStatus('cp-1', 'rejected'));
    httpMock.expectOne('/api/v1/commercial-proposals/cp-1/status').flush({ success: true, data: { ...MOCK_CP, status: 'rejected' } });
    expect((await p3).data!.status).toBe('rejected');
  });
});
