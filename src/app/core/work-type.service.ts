import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { WorkType } from '../../../shared/types/index.js';

const SEED_WORK_TYPES: WorkType[] = [
  { id: 'wt-1', name: 'Лазерная резка', department: 'Изготовление', defaultDurationHours: 1.0, workCenterId: 'wc-1', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wt-2', name: 'Труборез', department: 'Изготовление', defaultDurationHours: 0.5, workCenterId: 'wc-2', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wt-3', name: 'Полуавтоматическая сварка', department: 'Изготовление', defaultDurationHours: 2.0, workCenterId: 'wc-3', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wt-4', name: 'Деревообработка', department: 'Изготовление', defaultDurationHours: 2.0, workCenterId: 'wc-4', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wt-5', name: 'Порошковая покраска', department: 'Изготовление', defaultDurationHours: 1.5, workCenterId: 'wc-5', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wt-6', name: 'Пескоструйная мойка труб', department: 'Подготовка', defaultDurationHours: 0.8, workCenterId: 'wc-6', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wt-7', name: 'Лазерная сварка', department: 'Изготовление', defaultDurationHours: 1.0, isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wt-8', name: 'Обычная сварка', department: 'Изготовление', defaultDurationHours: 2.5, isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wt-9', name: 'Слесарные работы', department: 'Сборка', defaultDurationHours: 3.0, isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class WorkTypeService extends BaseCrudService<WorkType> {
  constructor() { super(); this.items = SEED_WORK_TYPES.map(w => ({ ...w })); }
}
