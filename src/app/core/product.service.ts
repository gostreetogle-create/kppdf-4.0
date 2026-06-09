import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, Product } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = inject(ApiService);
  private basePath = '/products';

  /** Получить все товары */
  getAll(): Observable<ApiResponse<Product[]>> {
    return this.api.get<Product[]>(this.basePath);
  }

  /** Получить товар по ID */
  getById(id: string): Observable<ApiResponse<Product | undefined>> {
    return this.api.getById<Product>(this.basePath, id);
  }

  /** Создать товар (артикул генерирует бэкенд) */
  create(data: Omit<Product, 'id' | 'sku' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Product>> {
    return this.api.post<Product>(this.basePath, data);
  }

  /** Обновить товар */
  update(id: string, data: Partial<Omit<Product, 'id' | 'sku' | 'createdAt'>>): Observable<ApiResponse<Product>> {
    return this.api.put<Product>(this.basePath, id, data);
  }

  /** Удалить товар */
  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }

  // ─── Совместимые алиасы (для кода, использующего старые названия) ───

  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.getAll();
  }

  getProduct(id: string): Observable<ApiResponse<Product | undefined>> {
    return this.getById(id);
  }

  createProduct(data: Omit<Product, 'id' | 'sku' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Product>> {
    return this.create(data);
  }

  updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'sku' | 'createdAt'>>): Observable<ApiResponse<Product>> {
    return this.update(id, data);
  }

  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }

  /** Получить превью артикула для категории (бэкенд отдаст следующий) */
  previewSku(_categoryId: string): string {
    // Пока заглушка — при реальной необходимости вызовем API
    return '***';
  }
}
