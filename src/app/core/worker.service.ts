import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { Worker } from '../../../shared/types/index.js';

const SEED_WORKERS: Worker[] = [
  { id: 'wkr-1', lastName: 'Сергеев', firstName: 'Алексей', patronymic: 'Петрович', grade: 5, ratePerHour: 850, workTypeIds: ['wt-1', 'wt-2', 'wt-7'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wkr-2', lastName: 'Морозов', firstName: 'Дмитрий', grade: 4, ratePerHour: 700, workTypeIds: ['wt-3', 'wt-8'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wkr-3', lastName: 'Волков', firstName: 'Игорь', patronymic: 'Сергеевич', grade: 5, ratePerHour: 800, workTypeIds: ['wt-4'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wkr-4', lastName: 'Зайцев', firstName: 'Андрей', grade: 4, ratePerHour: 750, workTypeIds: ['wt-5', 'wt-6'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wkr-5', lastName: 'Фёдоров', firstName: 'Николай', grade: 3, ratePerHour: 600, workTypeIds: ['wt-9'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class WorkerService extends BaseCrudService<Worker> {
  constructor() { super(); this.items = SEED_WORKERS.map(w => ({ ...w, workTypeIds: [...w.workTypeIds] })); }
}
