import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, WorkCenter } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class WorkCenterService {
  private api = inject(ApiService);
  private basePath = '/work-centers';

  getAll(): Observable<ApiResponse<WorkCenter[]>> {
    return this.api.get<WorkCenter[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<WorkCenter | undefined>> {
    return this.api.getById<WorkCenter>(this.basePath, id);
  }

  create(data: Omit<WorkCenter, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<WorkCenter>> {
    return this.api.post<WorkCenter>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<WorkCenter, 'id' | 'createdAt'>>): Observable<ApiResponse<WorkCenter>> {
    return this.api.put<WorkCenter>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
