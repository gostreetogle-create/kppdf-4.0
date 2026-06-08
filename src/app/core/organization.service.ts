import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, Organization } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private api = inject(ApiService);
  private basePath = '/organizations';

  /** Получить всех контрагентов (опционально с фильтром по slug роли) */
  getOrganizations(roleSlug?: string): Observable<ApiResponse<Organization[]>> {
    const params: Record<string, string | number | boolean> = {};
    if (roleSlug) {
      params['role'] = roleSlug;
    }
    return this.api.get<Organization[]>(this.basePath, params);
  }

  /** Алиас для обратной совместимости */
  getAll(): Observable<ApiResponse<Organization[]>> {
    return this.getOrganizations();
  }

  /** Получить контрагента по id */
  getOrganization(id: string): Observable<ApiResponse<Organization | undefined>> {
    return this.api.getById<Organization>(this.basePath, id);
  }

  /** Создать нового контрагента */
  createOrganization(data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Organization>> {
    return this.api.post<Organization>(this.basePath, data as any);
  }

  /** Обновить контрагента */
  updateOrganization(id: string, data: Partial<Omit<Organization, 'id' | 'createdAt'>>): Observable<ApiResponse<Organization>> {
    return this.api.put<Organization>(this.basePath, id, data);
  }

  /** Удалить контрагента */
  deleteOrganization(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
