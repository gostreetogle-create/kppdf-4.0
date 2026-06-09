import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import type { ApiResponse, PurchaseRequest, PurchaseRequestStatus } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

let prCounter = 4;

function generatePrNumber(): string {
  prCounter++;
  return `ПЗ-${String(prCounter).padStart(4, '0')}`;
}

@Injectable({ providedIn: 'root' })
export class PurchaseRequestService {
  private api = inject(ApiService);
  private basePath = '/purchase-requests';

  getRequests(): Observable<ApiResponse<PurchaseRequest[]>> {
    return this.api.get<PurchaseRequest[]>(this.basePath);
  }

  getRequest(id: string): Observable<ApiResponse<PurchaseRequest | undefined>> {
    return this.api.getById<PurchaseRequest>(this.basePath, id);
  }

  createRequest(data: Omit<PurchaseRequest, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<PurchaseRequest>> {
    return this.api.post<PurchaseRequest>(this.basePath, {
      ...data,
      number: generatePrNumber(),
    });
  }

  updateRequest(id: string, data: Partial<Omit<PurchaseRequest, 'id' | 'number' | 'createdAt'>>): Observable<ApiResponse<PurchaseRequest>> {
    return this.api.put<PurchaseRequest>(this.basePath, id, data);
  }

  deleteRequest(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }

  changeStatus(id: string, newStatus: PurchaseRequestStatus): Observable<ApiResponse<PurchaseRequest>> {
    const validStatuses: PurchaseRequestStatus[] = ['draft', 'pending', 'approved', 'ordered', 'fulfilled', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return of({
        success: false,
        data: undefined as unknown as PurchaseRequest,
        message: `Недопустимый статус: ${newStatus}`,
      });
    }
    return this.api.put<PurchaseRequest>(this.basePath, id, { status: newStatus });
  }
}
