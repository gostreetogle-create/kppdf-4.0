import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type { ApiResponse, CounterpartyRoleDef } from '../../../shared/types/index.js';
import { BaseCrudService, generateId, nowISO, type CreateData } from './crud-factory.js';

function makeSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '_').replace(/^_|_$/g, '');
}

/** Начальные роли, предустановленные в системе */
const SEED_ROLES: CounterpartyRoleDef[] = [
  {
    id: 'role-supplier',
    name: 'Поставщик',
    description: 'Организация, у которой мы закупаем товары/услуги',
    slug: 'supplier',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-06-06T00:00:00.000Z',
  },
  {
    id: 'role-buyer',
    name: 'Покупатель',
    description: 'Организация, которая покупает у нас товары/услуги',
    slug: 'buyer',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-06-06T00:00:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class CounterpartyRoleService extends BaseCrudService<CounterpartyRoleDef> {
  constructor() {
    super();
    this.items = [...SEED_ROLES];
  }

  // ─── Совместимые методы (тонкие обёртки) ───

  /** Получить все виды контрагентов */
  getRoles(): Observable<ApiResponse<CounterpartyRoleDef[]>> {
    return this.getAll();
  }

  /** Получить один вид по ID */
  getRole(id: string): Observable<ApiResponse<CounterpartyRoleDef | undefined>> {
    return this.getById(id);
  }

  /** Создать новый вид (с авто-генерацией slug) */
  createRole(data: Omit<CounterpartyRoleDef, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<CounterpartyRoleDef>> {
    const now = nowISO();
    const slug = makeSlug(data.name);
    const role: CounterpartyRoleDef = {
      ...data,
      id: generateId(),
      slug,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(role);
    return of({ success: true, data: { ...role } }).pipe(delay(this.delayMs));
  }

  /** Обновить вид */
  updateRole(id: string, data: Partial<Omit<CounterpartyRoleDef, 'id' | 'slug' | 'createdAt'>>): Observable<ApiResponse<CounterpartyRoleDef>> {
    return this.update(id, data);
  }

  /** Удалить вид */
  deleteRole(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }

  // ─── Дополнительные методы ───

  /** Получить роль по slug (для быстрой фильтрации) */
  getRoleBySlug(slug: string): CounterpartyRoleDef | undefined {
    return this.items.find(r => r.slug === slug);
  }

  /** Получить ID роли по slug */
  getRoleIdBySlug(slug: string): string | undefined {
    return this.items.find(r => r.slug === slug)?.id;
  }
}
