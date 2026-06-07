import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { User } from '../../../shared/types/index.js';

const SEED_USERS: User[] = [
  { id: 'u-1', username: 'admin', displayName: 'Администратор', email: 'admin@sportin-yug.ru', phone: '+7 (861) 555-00-01', role: 'admin', permissions: ['*'], isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'u-2', username: 'manager', displayName: 'Мария Иванова', email: 'manager@sportin-yug.ru', phone: '+7 (861) 555-00-02', role: 'manager', permissions: ['sales', 'references'], isActive: true, createdAt: '2026-01-15T00:00:00.000Z', updatedAt: '2026-02-01T00:00:00.000Z' },
  { id: 'u-3', username: 'production', displayName: 'Сергей Петров', email: 'production@sportin-yug.ru', phone: '+7 (861) 555-00-03', role: 'production', permissions: ['production', 'references'], isActive: true, createdAt: '2026-02-01T00:00:00.000Z', updatedAt: '2026-02-15T00:00:00.000Z' },
  { id: 'u-4', username: 'storekeeper', displayName: 'Иван Сидоров', email: 'store@sportin-yug.ru', phone: '+7 (861) 555-00-04', role: 'storekeeper', permissions: ['warehouse'], isActive: true, createdAt: '2026-02-10T00:00:00.000Z', updatedAt: '2026-02-10T00:00:00.000Z' },
  { id: 'u-5', username: 'accountant', displayName: 'Елена Козлова', email: 'account@sportin-yug.ru', phone: '+7 (861) 555-00-05', role: 'accountant', permissions: ['finance'], isActive: false, createdAt: '2026-03-01T00:00:00.000Z', updatedAt: '2026-04-01T00:00:00.000Z' },
  { id: 'u-6', username: 'viewer', displayName: 'Наблюдатель', email: 'viewer@sportin-yug.ru', phone: '+7 (861) 555-00-06', role: 'viewer', permissions: [], isActive: true, createdAt: '2026-03-15T00:00:00.000Z', updatedAt: '2026-03-15T00:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class UserService extends BaseCrudService<User> {
  readonly roleOptions = [
    { value: 'admin', label: '👑 Администратор' },
    { value: 'manager', label: '💰 Менеджер продаж' },
    { value: 'production', label: '🏭 Рук. производства' },
    { value: 'storekeeper', label: '📦 Кладовщик' },
    { value: 'accountant', label: '🧾 Бухгалтер' },
    { value: 'viewer', label: '👁️ Наблюдатель' },
  ];

  constructor() {
    super();
    this.items = SEED_USERS.map(u => ({ ...u }));
  }
}
