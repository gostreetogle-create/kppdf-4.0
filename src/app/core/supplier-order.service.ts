import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import type { ApiResponse, SupplierOrder, SupplierOrderStatus } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

let soCounter = 3;

function generateSoNumber(): string {
  soCounter++;
  return `ЗП-${String(soCounter).padStart(4, '0')}`;
}

@Injectable({ providedIn: 'root' })
export class SupplierOrderService {
  private api = inject(ApiService);
  private basePath = '/supplier-orders';

  getOrders(): Observable<ApiResponse<SupplierOrder[]>> {
    return this.api.get<SupplierOrder[]>(this.basePath);
  }

  getOrder(id: string): Observable<ApiResponse<SupplierOrder | undefined>> {
    return this.api.getById<SupplierOrder>(this.basePath, id);
  }

  createOrder(data: Omit<SupplierOrder, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<SupplierOrder>> {
    return this.api.post<SupplierOrder>(this.basePath, {
      ...data,
      number: generateSoNumber(),
    });
  }

  updateOrder(id: string, data: Partial<Omit<SupplierOrder, 'id' | 'number' | 'createdAt'>>): Observable<ApiResponse<SupplierOrder>> {
    return this.api.put<SupplierOrder>(this.basePath, id, data);
  }

  deleteOrder(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }

  changeStatus(id: string, newStatus: SupplierOrderStatus): Observable<ApiResponse<SupplierOrder>> {
    const validStatuses: SupplierOrderStatus[] = ['draft', 'sent', 'confirmed', 'partial', 'received', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return of({
        success: false,
        data: undefined as unknown as SupplierOrder,
        message: `Недопустимый статус: ${newStatus}`,
      });
    }
    return this.api.put<SupplierOrder>(this.basePath, id, { status: newStatus });
  }
}
