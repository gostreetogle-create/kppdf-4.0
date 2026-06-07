import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { OrderClosing } from '../../../shared/types/index.js';

const SEED_CLOSINGS: OrderClosing[] = [
  { id: 'oc-1', productionOrderId: 'po-1', orderNumber: 'ПЗ-0001', closingType: 'act', number: 'АКТ-001', date: '2026-06-10', amount: 425000, organizationId: 'org-1', organizationName: 'Школа №42', status: 'signed', notes: 'Акт выполненных работ по стойкам баскетбольным', createdAt: '2026-06-10T12:00:00.000Z', updatedAt: '2026-06-10T12:00:00.000Z' },
  { id: 'oc-2', productionOrderId: 'po-1', orderNumber: 'ПЗ-0001', closingType: 'invoice', number: 'СФ-0042', date: '2026-06-10', amount: 425000, organizationId: 'org-1', organizationName: 'Школа №42', status: 'signed', notes: 'Счёт-фактура к акту АКТ-001', createdAt: '2026-06-10T13:00:00.000Z', updatedAt: '2026-06-10T13:00:00.000Z' },
  { id: 'oc-3', productionOrderId: 'po-1', orderNumber: 'ПЗ-0001', closingType: 'waybill', number: 'ТН-0023', date: '2026-06-12', organizationId: 'org-1', organizationName: 'Школа №42', status: 'draft', notes: 'Товарная накладная на отгрузку', createdAt: '2026-06-11T10:00:00.000Z', updatedAt: '2026-06-11T10:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class OrderClosingService extends BaseCrudService<OrderClosing> {
  constructor() { super(); this.items = SEED_CLOSINGS.map(c => ({ ...c })); }
}
