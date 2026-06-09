import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, OrderClosing } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class OrderClosingService {
  private api = inject(ApiService);
  private basePath = '/order-closings';

  getAll(): Observable<ApiResponse<OrderClosing[]>> {
    return this.api.get<OrderClosing[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<OrderClosing | undefined>> {
    return this.api.getById<OrderClosing>(this.basePath, id);
  }

  create(data: Omit<OrderClosing, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<OrderClosing>> {
    return this.api.post<OrderClosing>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<OrderClosing, 'id' | 'createdAt'>>): Observable<ApiResponse<OrderClosing>> {
    return this.api.put<OrderClosing>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
