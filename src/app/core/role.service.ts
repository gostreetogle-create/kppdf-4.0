import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { RoleDef } from '../../../shared/types/index.js';

const SEED_ROLES: RoleDef[] = [
  { id: 'role-admin', name: 'Администратор', description: 'Полный доступ ко всем разделам', sectionIds: ['sales', 'production', 'warehouse', 'finance', 'references', 'admin'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'role-sales', name: 'Менеджер по продажам', description: 'Продажи, справочники', sectionIds: ['sales', 'references'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'role-production', name: 'Руководитель производства', description: 'Производство, справочники', sectionIds: ['production', 'references'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'role-foreman', name: 'Мастер цеха', description: 'Производство (без настроек)', sectionIds: ['production'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'role-worker', name: 'Рабочий', description: 'Только свои задачи', sectionIds: ['production'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'role-storekeeper', name: 'Кладовщик', description: 'Склад, закупки', sectionIds: ['warehouse'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'role-accountant', name: 'Бухгалтер', description: 'Бухгалтерия, отчёты', sectionIds: ['finance'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'role-director', name: 'Директор', description: 'Все разделы, дашборд', sectionIds: ['sales', 'production', 'warehouse', 'finance', 'references', 'admin'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class RoleService extends BaseCrudService<RoleDef> {
  constructor() { super(); this.items = SEED_ROLES.map(r => ({ ...r, sectionIds: [...r.sectionIds] })); }
}
