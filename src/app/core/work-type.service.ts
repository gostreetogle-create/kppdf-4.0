import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, WorkType } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class WorkTypeService {
  private api = inject(ApiService);
  private basePath = '/work-types';

  getAll(): Observable<ApiResponse<WorkType[]>> {
    return this.api.get<WorkType[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<WorkType | undefined>> {
    return this.api.getById<WorkType>(this.basePath, id);
  }

  create(data: Omit<WorkType, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<WorkType>> {
    return this.api.post<WorkType>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<WorkType, 'id' | 'createdAt'>>): Observable<ApiResponse<WorkType>> {
    return this.api.put<WorkType>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
