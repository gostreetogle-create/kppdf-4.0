import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, RppEntry } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class RppService {
  private api = inject(ApiService);
  private basePath = '/rpp';

  getAll(): Observable<ApiResponse<RppEntry[]>> {
    return this.api.get<RppEntry[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<RppEntry | undefined>> {
    return this.api.getById<RppEntry>(this.basePath, id);
  }

  create(data: Omit<RppEntry, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<RppEntry>> {
    return this.api.post<RppEntry>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<RppEntry, 'id' | 'createdAt'>>): Observable<ApiResponse<RppEntry>> {
    return this.api.put<RppEntry>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
