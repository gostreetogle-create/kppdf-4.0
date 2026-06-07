import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';
import type { ApiResponse, PurchaseRequest, PurchaseRequestStatus } from '../../../shared/types/index.js';

let prCounter = 4;
function generatePrNumber(): string {
  prCounter++;
  return `ПЗ-${String(prCounter).padStart(4, '0')}`;
}

const SEED_REQUESTS: PurchaseRequest[] = [
  {
    id: 'pr-1', number: 'ПЗ-0001',
    sourceType: 'manual',
    entityType: 'product', entityId: 'prod-5',
    entityName: 'Комплект крепежа М10 (100 шт)', entitySku: 'MB0001',
    entityUnit: 'комплект', quantity: 50,
    warehouseId: 'wh-1', zoneName: 'Склад метизов',
    status: 'approved',
    notes: 'Пополнение запаса крепежа — расход вырос в 2 раза',
    createdAt: '2026-05-10T09:00:00.000Z', updatedAt: '2026-05-11T11:00:00.000Z',
  },
  {
    id: 'pr-2', number: 'ПЗ-0002',
    sourceType: 'manual',
    entityType: 'product', entityId: 'prod-8',
    entityName: 'Прожектор светодиодный 100Вт', entitySku: 'OS0001',
    entityUnit: 'шт', quantity: 15,
    warehouseId: 'wh-1', zoneName: 'Склад осветительных приборов',
    status: 'ordered',
    notes: 'Для нового проекта — освещение 3 спортплощадок',
    createdAt: '2026-05-12T10:00:00.000Z', updatedAt: '2026-05-14T14:00:00.000Z',
  },
  {
    id: 'pr-3', number: 'ПЗ-0003',
    sourceType: 'manual',
    entityType: 'product', entityId: 'prod-9',
    entityName: 'Мяч баскетбольный Club 500', entitySku: 'NV0001',
    entityUnit: 'шт', quantity: 30,
    warehouseId: 'wh-1', zoneName: 'Склад навесного оборудования',
    status: 'pending',
    notes: 'Сезонная закупка — к началу учебного года',
    createdAt: '2026-06-01T08:00:00.000Z', updatedAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'pr-4', number: 'ПЗ-0004',
    sourceType: 'manual',
    entityType: 'product', entityId: 'prod-10',
    entityName: 'Сетка волейбольная ВС-9', entitySku: 'NV0002',
    entityUnit: 'шт', quantity: 10,
    warehouseId: 'wh-1', zoneName: 'Склад навесного оборудования',
    status: 'draft',
    notes: 'Замена изношенных сеток на действующих площадках',
    createdAt: '2026-06-05T09:30:00.000Z', updatedAt: '2026-06-05T09:30:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class PurchaseRequestService extends BaseCrudService<PurchaseRequest> {
  constructor() {
    super();
    this.items = SEED_REQUESTS.map(r => ({ ...r }));
  }

  getRequests(): Observable<ApiResponse<PurchaseRequest[]>> {
    return this.getAll();
  }

  getRequest(id: string): Observable<ApiResponse<PurchaseRequest | undefined>> {
    return this.getById(id);
  }

  createRequest(data: Omit<PurchaseRequest, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<PurchaseRequest>> {
    const now = nowISO();
    const pr: PurchaseRequest = {
      ...(data as PurchaseRequest),
      id: generateId(),
      number: generatePrNumber(),
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(pr);
    return of({ success: true, data: this.cloneItem(pr) }).pipe(delay(this.delayMs));
  }

  updateRequest(id: string, data: Partial<Omit<PurchaseRequest, 'id' | 'number' | 'createdAt'>>): Observable<ApiResponse<PurchaseRequest>> {
    return this.update(id, data);
  }

  deleteRequest(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }

  changeStatus(id: string, newStatus: PurchaseRequestStatus): Observable<ApiResponse<PurchaseRequest>> {
    const pr = this.items.find(r => r.id === id);
    if (!pr) return of({ success: false, data: undefined as unknown as PurchaseRequest, message: 'Заявка не найдена' }).pipe(delay(this.delayMs));
    const updated = { ...pr, status: newStatus, updatedAt: nowISO() };
    this.items = this.items.map(r => r.id === id ? updated : r);
    return of({ success: true, data: this.cloneItem(updated) }).pipe(delay(this.delayMs));
  }
}
