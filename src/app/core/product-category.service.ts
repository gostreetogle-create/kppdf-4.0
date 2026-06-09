import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, ProductCategory } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class ProductCategoryService {
  private api = inject(ApiService);
  private basePath = '/product-categories';

  getAll(): Observable<ApiResponse<ProductCategory[]>> {
    return this.api.get<ProductCategory[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<ProductCategory | undefined>> {
    return this.api.getById<ProductCategory>(this.basePath, id);
  }

  create(data: Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<ProductCategory>> {
    return this.api.post<ProductCategory>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<ProductCategory, 'id' | 'createdAt'>>): Observable<ApiResponse<ProductCategory>> {
    return this.api.put<ProductCategory>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
