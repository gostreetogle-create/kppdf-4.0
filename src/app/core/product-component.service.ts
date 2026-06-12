import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, ProductComponent } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class ProductComponentService {
  private api = inject(ApiService);
  private basePath = '/product-components';

  /** Получить все компоненты (с опциональной сортировкой) */
  getAll(): Observable<ApiResponse<ProductComponent[]>> {
    return this.api.get<ProductComponent[]>(this.basePath);
  }

  /** Получить компоненты по товару */
  getByProduct(productId: string): Observable<ApiResponse<ProductComponent[]>> {
    return this.api.get<ProductComponent[]>(`${this.basePath}/by-product/${productId}`);
  }

  /** Получить компонент по ID */
  getById(id: string): Observable<ApiResponse<ProductComponent | undefined>> {
    return this.api.getById<ProductComponent>(this.basePath, id);
  }

  /** Создать компонент */
  create(data: Omit<ProductComponent, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<ProductComponent>> {
    return this.api.post<ProductComponent>(this.basePath, data);
  }

  /** Создать компонент (алиас для create, обратная совместимость) */
  createComponent(data: Omit<ProductComponent, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<ProductComponent>> {
    return this.create(data);
  }

  /** Обновить компонент */
  update(id: string, data: Partial<Omit<ProductComponent, 'id' | 'createdAt'>>): Observable<ApiResponse<ProductComponent>> {
    return this.api.put<ProductComponent>(this.basePath, id, data);
  }

  /** Обновить компонент (алиас для update, обратная совместимость) */
  updateComponent(id: string, data: Partial<Omit<ProductComponent, 'id' | 'createdAt'>>): Observable<ApiResponse<ProductComponent>> {
    return this.update(id, data);
  }

  /** Удалить компонент */
  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }

  /** Удалить компонент (алиас для delete, обратная совместимость) */
  deleteComponent(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }

}
