import { Injectable, inject, signal } from '@angular/core';
import { Observable, first } from 'rxjs';
import type { ApiResponse, CounterpartyRoleDef } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class CounterpartyRoleService {
  private api = inject(ApiService);
  private basePath = '/counterparty-roles';

  /** Локальный кеш для синхронных методов */
  private cachedRoles = signal<CounterpartyRoleDef[] | null>(null);
  private loadAttempted = false;

  getRoles(): Observable<ApiResponse<CounterpartyRoleDef[]>> {
    return this.api.get<CounterpartyRoleDef[]>(this.basePath);
  }

  getRole(id: string): Observable<ApiResponse<CounterpartyRoleDef | undefined>> {
    return this.api.getById<CounterpartyRoleDef>(this.basePath, id);
  }

  /** Создать новый вид (slug генерирует бэкенд) */
  createRole(data: Omit<CounterpartyRoleDef, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<CounterpartyRoleDef>> {
    return this.api.post<CounterpartyRoleDef>(this.basePath, data);
  }

  updateRole(id: string, data: Partial<Omit<CounterpartyRoleDef, 'id' | 'slug' | 'createdAt'>>): Observable<ApiResponse<CounterpartyRoleDef>> {
    return this.api.put<CounterpartyRoleDef>(this.basePath, id, data);
  }

  deleteRole(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }

  // ─── Синхронные методы (с подгрузкой кеша при первом вызове) ───

  /** Получить роль по slug */
  getRoleBySlug(slug: string): CounterpartyRoleDef | undefined {
    return this.getCachedRoles().find(r => r.slug === slug);
  }

  /** Получить ID роли по slug */
  getRoleIdBySlug(slug: string): string | undefined {
    return this.getCachedRoles().find(r => r.slug === slug)?.id;
  }

  /** Принудительно обновить кеш */
  refreshCache(): void {
    this.loadAttempted = false;
    this.cachedRoles.set(null);
    this.ensureLoaded();
  }

  private getCachedRoles(): CounterpartyRoleDef[] {
    this.ensureLoaded();
    return this.cachedRoles() ?? [];
  }

  private ensureLoaded(): void {
    if (this.loadAttempted) return;
    this.loadAttempted = true;

    this.api.get<CounterpartyRoleDef[]>(this.basePath).pipe(first()).subscribe({
      next: res => { if (res.success) this.cachedRoles.set(res.data); },
      error: () => { this.cachedRoles.set([]); },
    });
  }
}
