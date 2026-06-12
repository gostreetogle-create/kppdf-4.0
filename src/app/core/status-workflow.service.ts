import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, StatusWorkflow } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class StatusWorkflowService {
  private api = inject(ApiService);
  private basePath = '/status-workflows';

  getAll(): Observable<ApiResponse<StatusWorkflow[]>> {
    return this.api.get<StatusWorkflow[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<StatusWorkflow | undefined>> {
    return this.api.getById<StatusWorkflow>(this.basePath, id);
  }

  create(data: Omit<StatusWorkflow, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<StatusWorkflow>> {
    return this.api.post<StatusWorkflow>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<StatusWorkflow, 'id' | 'createdAt'>>): Observable<ApiResponse<StatusWorkflow>> {
    return this.api.put<StatusWorkflow>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
