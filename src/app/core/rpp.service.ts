import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { RppEntry } from '../../../shared/types/index.js';

const SEED_RPP: RppEntry[] = [
  { id: 'rpp-1', productId: 'prod-1', productName: 'Стойка баскетбольная БСФП-120', productSku: 'SP0001', registryNumber: 'РПП-2026/001', status: 'registered', submissionDate: '2026-02-01', registrationDate: '2026-03-15', expiryDate: '2029-03-15', notes: 'Зарегистрировано в реестре Минпромторга', createdAt: '2026-02-01T10:00:00.000Z', updatedAt: '2026-03-15T10:00:00.000Z' },
  { id: 'rpp-2', productId: 'prod-2', productName: 'Турник уличный ТУ-2', productSku: 'SP0002', status: 'draft', notes: 'Готовим документы для подачи', createdAt: '2026-06-01T10:00:00.000Z', updatedAt: '2026-06-01T10:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class RppService extends BaseCrudService<RppEntry> {
  constructor() { super(); this.items = SEED_RPP.map(r => ({ ...r })); }
}
