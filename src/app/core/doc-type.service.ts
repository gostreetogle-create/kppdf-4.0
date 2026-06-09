import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, DocTypeDef } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class DocTypeService {
  private api = inject(ApiService);
  private basePath = '/doc-types';

  getDocTypes(): Observable<ApiResponse<DocTypeDef[]>> {
    return this.api.get<DocTypeDef[]>(this.basePath);
  }

  getDocType(id: string): Observable<ApiResponse<DocTypeDef | undefined>> {
    return this.api.getById<DocTypeDef>(this.basePath, id);
  }

  /** Создать тип документа (slug генерирует бэкенд) */
  createDocType(data: Omit<DocTypeDef, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<DocTypeDef>> {
    return this.api.post<DocTypeDef>(this.basePath, data);
  }

  updateDocType(id: string, data: Partial<Omit<DocTypeDef, 'id' | 'createdAt'>>): Observable<ApiResponse<DocTypeDef>> {
    return this.api.put<DocTypeDef>(this.basePath, id, data);
  }

  deleteDocType(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
