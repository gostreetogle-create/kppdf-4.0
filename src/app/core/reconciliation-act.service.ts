import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { ReconciliationAct } from '../../../shared/types/index.js';

const SEED_ACTS: ReconciliationAct[] = [
  { id: 'ra-1', organizationId: 'sup-1', organizationName: 'ООО «ПРОММЕТИЗ»', number: 'АС-2026-001', periodStart: '2026-01-01', periodEnd: '2026-06-30', ourDebt: 91000, balance: -91000, status: 'sent', notes: 'Задолженность по заказу ЗП-0001', createdAt: '2026-06-20T10:00:00.000Z', updatedAt: '2026-06-20T10:00:00.000Z' },
  { id: 'ra-2', organizationId: 'sup-2', organizationName: 'АО «ХимРеактив»', number: 'АС-2026-002', periodStart: '2026-01-01', periodEnd: '2026-06-30', ourDebt: 64000, balance: -64000, status: 'draft', notes: 'Сверка по заказу ЗП-0002', createdAt: '2026-06-21T10:00:00.000Z', updatedAt: '2026-06-21T10:00:00.000Z' },
  { id: 'ra-3', organizationId: 'org-1', organizationName: 'Администрация г. Краснодар', number: 'АС-2026-003', periodStart: '2026-03-01', periodEnd: '2026-06-07', theirDebt: 425000, balance: 425000, status: 'signed', signDate: '2026-06-15', notes: 'Задолженность заказчика по ПЗ-0001', createdAt: '2026-06-15T10:00:00.000Z', updatedAt: '2026-06-15T10:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class ReconciliationActService extends BaseCrudService<ReconciliationAct> {
  constructor() { super(); this.items = SEED_ACTS.map(a => ({ ...a })); }
}
