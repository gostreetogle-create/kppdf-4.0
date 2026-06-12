import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, Tender } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class TenderService {
  private api = inject(ApiService);
  private basePath = '/tenders';

  getAll(): Observable<ApiResponse<Tender[]>> {
    return this.api.get<Tender[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<Tender | undefined>> {
    return this.api.getById<Tender>(this.basePath, id);
  }

  create(data: Omit<Tender, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Tender>> {
    return this.api.post<Tender>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<Tender, 'id' | 'createdAt'>>): Observable<ApiResponse<Tender>> {
    return this.api.put<Tender>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
