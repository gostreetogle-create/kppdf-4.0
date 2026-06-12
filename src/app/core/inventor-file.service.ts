import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, InventorFile } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class InventorFileService {
  private api = inject(ApiService);
  private basePath = '/inventor-files';

  getAll(): Observable<ApiResponse<InventorFile[]>> {
    return this.api.get<InventorFile[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<InventorFile | undefined>> {
    return this.api.getById<InventorFile>(this.basePath, id);
  }

  create(data: Omit<InventorFile, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<InventorFile>> {
    return this.api.post<InventorFile>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<InventorFile, 'id' | 'createdAt'>>): Observable<ApiResponse<InventorFile>> {
    return this.api.put<InventorFile>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
