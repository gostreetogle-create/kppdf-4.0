import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import type { ApiResponse, IncomingInvoice, InvoiceStatus } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

let invCounter = 3;

function generateInvoiceNumber(): string {
  invCounter++;
  return `СФ-${String(invCounter).padStart(4, '0')}`;
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private api = inject(ApiService);
  private basePath = '/incoming-invoices';

  getInvoices(): Observable<ApiResponse<IncomingInvoice[]>> {
    return this.api.get<IncomingInvoice[]>(this.basePath);
  }

  getInvoice(id: string): Observable<ApiResponse<IncomingInvoice | undefined>> {
    return this.api.getById<IncomingInvoice>(this.basePath, id);
  }

  createInvoice(data: Omit<IncomingInvoice, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<IncomingInvoice>> {
    return this.api.post<IncomingInvoice>(this.basePath, {
      ...data,
      number: generateInvoiceNumber(),
    });
  }

  updateInvoice(id: string, data: Partial<Omit<IncomingInvoice, 'id' | 'number' | 'createdAt'>>): Observable<ApiResponse<IncomingInvoice>> {
    return this.api.put<IncomingInvoice>(this.basePath, id, data);
  }

  deleteInvoice(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }

  changeStatus(id: string, newStatus: InvoiceStatus): Observable<ApiResponse<IncomingInvoice>> {
    const validStatuses: InvoiceStatus[] = ['pending', 'paid', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return of({
        success: false,
        data: undefined as unknown as IncomingInvoice,
        message: `Недопустимый статус: ${newStatus}`,
      });
    }
    return this.api.put<IncomingInvoice>(this.basePath, id, { status: newStatus });
  }
}
