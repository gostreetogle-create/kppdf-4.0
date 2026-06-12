import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, Certificate } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private api = inject(ApiService);
  private basePath = '/certificates';

  getAll(): Observable<ApiResponse<Certificate[]>> {
    return this.api.get<Certificate[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<Certificate | undefined>> {
    return this.api.getById<Certificate>(this.basePath, id);
  }

  create(data: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Certificate>> {
    return this.api.post<Certificate>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<Certificate, 'id' | 'createdAt'>>): Observable<ApiResponse<Certificate>> {
    return this.api.put<Certificate>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
