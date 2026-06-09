import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, ProductionOrder, ProductionOrderStatus } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class ProductionOrderService {
  private api = inject(ApiService);
  private basePath = '/production-orders';

  getAll(): Observable<ApiResponse<ProductionOrder[]>> {
    return this.api.get<ProductionOrder[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<ProductionOrder | undefined>> {
    return this.api.getById<ProductionOrder>(this.basePath, id);
  }

  create(data: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<ProductionOrder>> {
    return this.api.post<ProductionOrder>(this.basePath, data);
  }

  /** Создать заказ (номер генерирует бэкенд) */
  createOrder(data: Omit<ProductionOrder, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<ProductionOrder>> {
    return this.api.post<ProductionOrder>(this.basePath, data);
  }

  /** Изменить статус заказа */
  changeStatus(id: string, newStatus: ProductionOrderStatus): Observable<ApiResponse<ProductionOrder>> {
    return this.api.put<ProductionOrder>(this.basePath, id, { status: newStatus });
  }

  update(id: string, data: Partial<Omit<ProductionOrder, 'id' | 'createdAt'>>): Observable<ApiResponse<ProductionOrder>> {
    return this.api.put<ProductionOrder>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
