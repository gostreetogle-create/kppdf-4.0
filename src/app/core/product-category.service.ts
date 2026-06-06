import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { ProductCategory } from '../../../shared/types/index.js';

const SEED_CATEGORIES: ProductCategory[] = [
  { id: 'cat-sp', name: 'Спортивное оборудование', prefix: 'SP', description: 'Спортивное оборудование и тренажёры', sortOrder: 1, isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-mf', name: 'Малые архитектурные формы', prefix: 'MF', description: 'МАФ: урны, скамейки, перголы, велопарковки', sortOrder: 2, isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-og', name: 'Ограждения', prefix: 'OG', description: 'Заборы, перила, ограждения', sortOrder: 3, isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-os', name: 'Освещение', prefix: 'OS', description: 'Осветительное оборудование', sortOrder: 4, isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-mb', name: 'Мебель', prefix: 'MB', description: 'Уличная и офисная мебель', sortOrder: 5, isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-nv', name: 'Спортивный инвентарь', prefix: 'NV', description: 'Мячи, сетки, аксессуары', sortOrder: 6, isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-pr', name: 'Прочее', prefix: 'PR', description: 'Прочие товары и услуги', sortOrder: 7, isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class ProductCategoryService extends BaseCrudService<ProductCategory> {
  constructor() {
    super();
    this.items = SEED_CATEGORIES.map(c => ({ ...c }));
  }

  /** Получить все активные категории (для выпадающих списков) */
  getActiveCategories(): ProductCategory[] {
    return this.items.filter(c => c.isActive);
  }

  /** Получить префикс категории по ID */
  getCategoryPrefix(categoryId: string): string | undefined {
    return this.items.find(c => c.id === categoryId)?.prefix;
  }
}
