import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, RoleDef } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private api = inject(ApiService);
  private basePath = '/roles';

  getAll(): Observable<ApiResponse<RoleDef[]>> {
    return this.api.get<RoleDef[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<RoleDef | undefined>> {
    return this.api.getById<RoleDef>(this.basePath, id);
  }

  create(data: Omit<RoleDef, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<RoleDef>> {
    return this.api.post<RoleDef>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<RoleDef, 'id' | 'createdAt'>>): Observable<ApiResponse<RoleDef>> {
    return this.api.put<RoleDef>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
