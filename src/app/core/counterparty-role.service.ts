import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type { ApiResponse, CounterpartyRoleDef } from '../../../shared/types/index.js';

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

function nowISO(): string {
  return new Date().toISOString();
}

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
export class CounterpartyRoleService {
  private roles: CounterpartyRoleDef[] = [...SEED_ROLES];

  /** Получить все виды контрагентов */
  getRoles(): Observable<ApiResponse<CounterpartyRoleDef[]>> {
    return of({ success: true, data: [...this.roles] }).pipe(delay(100));
  }

  /** Получить один вид по ID */
  getRole(id: string): Observable<ApiResponse<CounterpartyRoleDef | undefined>> {
    const role = this.roles.find(r => r.id === id);
    return of({ success: !!role, data: role ? { ...role } : undefined }).pipe(delay(100));
  }

  /** Создать новый вид */
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
    this.roles.push(role);
    return of({ success: true, data: { ...role } }).pipe(delay(100));
  }

  /** Обновить вид */
  updateRole(id: string, data: Partial<Omit<CounterpartyRoleDef, 'id' | 'slug' | 'createdAt'>>): Observable<ApiResponse<CounterpartyRoleDef>> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index === -1) {
      return of({ success: false, data: undefined as unknown as CounterpartyRoleDef, message: 'Вид контрагента не найден' }).pipe(delay(100));
    }
    this.roles[index] = { ...this.roles[index], ...data, id, updatedAt: nowISO() };
    return of({ success: true, data: { ...this.roles[index] } }).pipe(delay(100));
  }

  /** Удалить вид */
  deleteRole(id: string): Observable<ApiResponse<void>> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index === -1) {
      return of({ success: false, data: undefined, message: 'Вид контрагента не найден' }).pipe(delay(100));
    }
    this.roles.splice(index, 1);
    return of({ success: true, data: undefined }).pipe(delay(100));
  }

  /** Получить роль по slug (для быстрой фильтрации) */
  getRoleBySlug(slug: string): CounterpartyRoleDef | undefined {
    return this.roles.find(r => r.slug === slug);
  }

  /** Получить ID роли по slug */
  getRoleIdBySlug(slug: string): string | undefined {
    return this.roles.find(r => r.slug === slug)?.id;
  }
}
