import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, InventoryItem, InventoryMovement } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private api = inject(ApiService);
  private basePath = '/inventory';

  /** Получить остатки по складу (опционально) */
  getItems(warehouseId?: string): Observable<ApiResponse<InventoryItem[]>> {
    const params: Record<string, string> = {};
    if (warehouseId) params['warehouseId'] = warehouseId;
    return this.api.get<InventoryItem[]>(`${this.basePath}/items`, params);
  }

  /** Получить остаток по ID */
  getItem(id: string): Observable<ApiResponse<InventoryItem | undefined>> {
    return this.api.getById<InventoryItem>(`${this.basePath}/items`, id);
  }

  /** Получить список движений */
  getMovements(warehouseId?: string, limit: number = 50): Observable<ApiResponse<InventoryMovement[]>> {
    const params: Record<string, string | number> = { limit };
    if (warehouseId) params['warehouseId'] = warehouseId;
    return this.api.get<InventoryMovement[]>(`${this.basePath}/movements`, params);
  }

  /** Создать новое движение */
  addMovement(movement: Omit<InventoryMovement, 'id' | 'createdAt'>): Observable<ApiResponse<InventoryMovement>> {
    return this.api.post<InventoryMovement>(`${this.basePath}/movements`, movement);
  }
}
