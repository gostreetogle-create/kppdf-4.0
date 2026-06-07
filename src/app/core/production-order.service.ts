import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';
import type { ApiResponse, ProductionOrder, ProductionOrderStatus } from '../../../shared/types/index.js';

let poCounter = 2;
function generatePoNumber(): string { poCounter++; return `ПЗ-${String(poCounter).padStart(4, '0')}`; }

const SEED_ORDERS: ProductionOrder[] = [
  { id: 'po-1', number: 'ПЗ-0001', contractId: 'ctr-1', productId: 'prod-1', productName: 'Стойка баскетбольная БСФП-120', productSku: 'SP0001', quantity: 5, status: 'in_production', plannedStartDate: '2026-06-01', plannedEndDate: '2026-06-25', notes: 'Срочный заказ для школы №42', createdAt: '2026-06-01T09:00:00.000Z', updatedAt: '2026-06-03T14:00:00.000Z' },
  { id: 'po-2', number: 'ПЗ-0002', contractId: 'ctr-2', productId: 'prod-3', productName: 'Скамейка парковая СК-180', productSku: 'MF0001', quantity: 20, status: 'accepted', plannedStartDate: '2026-06-15', plannedEndDate: '2026-07-10', notes: 'Плановая поставка в парк Горького', createdAt: '2026-06-05T10:00:00.000Z', updatedAt: '2026-06-05T10:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class ProductionOrderService extends BaseCrudService<ProductionOrder> {
  constructor() { super(); this.items = SEED_ORDERS.map(o => ({ ...o })); }

  createOrder(data: Omit<ProductionOrder, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<ProductionOrder>> {
    const now = nowISO();
    const order: ProductionOrder = { ...(data as ProductionOrder), id: generateId(), number: generatePoNumber(), createdAt: now, updatedAt: now };
    this.items.push(order);
    return of({ success: true, data: this.cloneItem(order) }).pipe(delay(this.delayMs));
  }

  changeStatus(id: string, newStatus: ProductionOrderStatus): Observable<ApiResponse<ProductionOrder>> {
    const o = this.items.find(x => x.id === id);
    if (!o) return of({ success: false, data: undefined as unknown as ProductionOrder, message: 'Заказ не найден' }).pipe(delay(this.delayMs));
    const updated = { ...o, status: newStatus, updatedAt: nowISO() };
    this.items = this.items.map(x => x.id === id ? updated : x);
    return of({ success: true, data: this.cloneItem(updated) }).pipe(delay(this.delayMs));
  }
}
