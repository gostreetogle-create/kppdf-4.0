import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, FinancialReport } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class FinancialReportService {
  private api = inject(ApiService);
  private basePath = '/financial-reports';

  getAll(): Observable<ApiResponse<FinancialReport[]>> {
    return this.api.get<FinancialReport[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<FinancialReport | undefined>> {
    return this.api.getById<FinancialReport>(this.basePath, id);
  }

  create(data: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<FinancialReport>> {
    return this.api.post<FinancialReport>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<FinancialReport, 'id' | 'createdAt'>>): Observable<ApiResponse<FinancialReport>> {
    return this.api.put<FinancialReport>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
