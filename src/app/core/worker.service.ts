import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, Worker } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class WorkerService {
  private api = inject(ApiService);
  private basePath = '/workers';

  getAll(): Observable<ApiResponse<Worker[]>> {
    return this.api.get<Worker[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<Worker | undefined>> {
    return this.api.getById<Worker>(this.basePath, id);
  }

  create(data: Omit<Worker, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Worker>> {
    return this.api.post<Worker>(this.basePath, data as any);
  }

  update(id: string, data: Partial<Omit<Worker, 'id' | 'createdAt'>>): Observable<ApiResponse<Worker>> {
    return this.api.put<Worker>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
