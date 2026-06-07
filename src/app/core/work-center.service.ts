import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { WorkCenter } from '../../../shared/types/index.js';

const SEED_WORK_CENTERS: WorkCenter[] = [
  { id: 'wc-1', name: 'Станок лазерной резки', type: 'Станок', description: 'Trumpf TruLaser 3030', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wc-2', name: 'Труборезный станок', type: 'Станок', description: 'Труборез полуавтоматический', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wc-3', name: 'Сварочный полуавтомат', type: 'Станок', description: 'Lincoln Electric Power MIG 350MP', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wc-4', name: 'Деревообрабатывающий станок', type: 'Станок', description: 'Универсальный деревообрабатывающий', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wc-5', name: 'Камера порошковой покраски', type: 'Камера', description: 'Покрасочная камера с печью полимеризации', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wc-6', name: 'Пескоструйная камера', type: 'Камера', description: 'Пескоструйная обработка труб и листов', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class WorkCenterService extends BaseCrudService<WorkCenter> {
  constructor() { super(); this.items = SEED_WORK_CENTERS.map(w => ({ ...w })); }
}
