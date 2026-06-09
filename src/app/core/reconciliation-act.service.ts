import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, ReconciliationAct } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class ReconciliationActService {
  private api = inject(ApiService);
  private basePath = '/reconciliation-acts';

  getAll(): Observable<ApiResponse<ReconciliationAct[]>> {
    return this.api.get<ReconciliationAct[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<ReconciliationAct | undefined>> {
    return this.api.getById<ReconciliationAct>(this.basePath, id);
  }

  create(data: Omit<ReconciliationAct, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<ReconciliationAct>> {
    return this.api.post<ReconciliationAct>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<ReconciliationAct, 'id' | 'createdAt'>>): Observable<ApiResponse<ReconciliationAct>> {
    return this.api.put<ReconciliationAct>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
