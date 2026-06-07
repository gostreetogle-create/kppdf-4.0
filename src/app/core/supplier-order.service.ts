import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';
import type { ApiResponse, SupplierOrder, SupplierOrderStatus } from '../../../shared/types/index.js';

let soCounter = 3;
function generateSoNumber(): string {
  soCounter++;
  return `ЗП-${String(soCounter).padStart(4, '0')}`;
}

const SEED_ORDERS: SupplierOrder[] = [
  {
    id: 'so-1', number: 'ЗП-0001',
    supplierOrgId: 'sup-1',
    status: 'confirmed',
    items: [
      {
        id: 'soi-1-1', entityType: 'product', entityId: 'prod-5',
        entityName: 'Комплект крепежа М10 (100 шт)', entitySku: 'MB0001',
        entityUnit: 'комплект', quantity: 50, price: 680,
      },
      {
        id: 'soi-1-2', entityType: 'product', entityId: 'prod-8',
        entityName: 'Прожектор светодиодный 100Вт', entitySku: 'OS0001',
        entityUnit: 'шт', quantity: 15, price: 3800,
      },
    ],
    totalAmount: 91000,
    expectedDate: '2026-06-20',
    notes: 'ПРОММЕТИЗ — проверенный поставщик, отсрочка 30 дней',
    createdAt: '2026-05-15T10:00:00.000Z', updatedAt: '2026-05-18T14:00:00.000Z',
  },
  {
    id: 'so-2', number: 'ЗП-0002',
    supplierOrgId: 'sup-2',
    status: 'sent',
    items: [
      {
        id: 'soi-2-1', entityType: 'product', entityId: 'prod-9',
        entityName: 'Мяч баскетбольный Club 500', entitySku: 'NV0001',
        entityUnit: 'шт', quantity: 30, price: 1200,
      },
      {
        id: 'soi-2-2', entityType: 'product', entityId: 'prod-10',
        entityName: 'Сетка волейбольная ВС-9', entitySku: 'NV0002',
        entityUnit: 'шт', quantity: 10, price: 2800,
      },
    ],
    totalAmount: 64000,
    expectedDate: '2026-06-25',
    notes: 'ХимРеактив — ожидаем КП до 10.06',
    createdAt: '2026-06-02T09:00:00.000Z', updatedAt: '2026-06-02T09:00:00.000Z',
  },
  {
    id: 'so-3', number: 'ЗП-0003',
    supplierOrgId: 'sup-1',
    status: 'draft',
    items: [
      {
        id: 'soi-3-1', entityType: 'product', entityId: 'prod-1',
        entityName: 'Лист стальной 2 мм (1250×2500)', entitySku: 'PR0001',
        entityUnit: 'шт', quantity: 100, price: 1800,
      },
    ],
    totalAmount: 180000,
    expectedDate: '2026-07-01',
    notes: 'Черновик — уточняется марка стали у заказчика',
    createdAt: '2026-06-07T10:00:00.000Z', updatedAt: '2026-06-07T10:00:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class SupplierOrderService extends BaseCrudService<SupplierOrder> {
  constructor() {
    super();
    this.items = SEED_ORDERS.map(o => ({ ...o, items: o.items.map(i => ({ ...i })) }));
  }

  getOrders(): Observable<ApiResponse<SupplierOrder[]>> {
    return this.getAll();
  }

  getOrder(id: string): Observable<ApiResponse<SupplierOrder | undefined>> {
    return this.getById(id);
  }

  createOrder(data: Omit<SupplierOrder, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<SupplierOrder>> {
    const now = nowISO();
    const order: SupplierOrder = {
      ...(data as SupplierOrder),
      id: generateId(),
      number: generateSoNumber(),
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(order);
    return of({ success: true, data: this.cloneItem(order) }).pipe(delay(this.delayMs));
  }

  updateOrder(id: string, data: Partial<Omit<SupplierOrder, 'id' | 'number' | 'createdAt'>>): Observable<ApiResponse<SupplierOrder>> {
    return this.update(id, data);
  }

  deleteOrder(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }

  changeStatus(id: string, newStatus: SupplierOrderStatus): Observable<ApiResponse<SupplierOrder>> {
    const order = this.items.find(o => o.id === id);
    if (!order) return of({ success: false, data: undefined as unknown as SupplierOrder, message: 'Заказ не найден' }).pipe(delay(this.delayMs));
    const updated = { ...order, status: newStatus, updatedAt: nowISO() };
    this.items = this.items.map(o => o.id === id ? updated : o);
    return of({ success: true, data: this.cloneItem(updated) }).pipe(delay(this.delayMs));
  }

  protected override cloneItem(o: SupplierOrder): SupplierOrder {
    return { ...o, items: o.items.map(i => ({ ...i })) };
  }
}
