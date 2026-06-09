import { Injectable, inject } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import type { ApiResponse, Warehouse } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class WarehouseService {
  private api = inject(ApiService);
  private basePath = '/warehouses';

  getWarehouses(): Observable<ApiResponse<Warehouse[]>> {
    return this.api.get<Warehouse[]>(this.basePath);
  }

  getWarehouse(id: string): Observable<ApiResponse<Warehouse | undefined>> {
    return this.api.getById<Warehouse>(this.basePath, id);
  }

  /** Получить склады по роли (async, загружает список из API) */
  async getWarehousesByRole(roleId: string): Promise<Warehouse[]> {
    const res = await firstValueFrom(this.getWarehouses());
    const warehouses = res.success ? res.data : [];
    return warehouses.filter(w => w.isActive && (w.roleIds.includes(roleId) || w.roleIds.length === 0));
  }

  createWarehouse(data: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Warehouse>> {
    return this.api.post<Warehouse>(this.basePath, data);
  }

  updateWarehouse(id: string, data: Partial<Omit<Warehouse, 'id' | 'createdAt'>>): Observable<ApiResponse<Warehouse>> {
    return this.api.put<Warehouse>(this.basePath, id, data);
  }

  deleteWarehouse(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
