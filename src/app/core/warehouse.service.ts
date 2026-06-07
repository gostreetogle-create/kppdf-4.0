import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './crud-factory.js';
import type { ApiResponse, Warehouse } from '../../../shared/types/index.js';

@Injectable({ providedIn: 'root' })
export class WarehouseService extends BaseCrudService<Warehouse> {
  constructor() {
    super();
    this.items = [
      {
        id: 'wh-1',
        name: 'Основной склад',
        address: 'ул. Заводская, 15',
        zoneNames: ['Трубный', 'Листовой', 'Окрасочный', 'Деревообработка'],
        roleIds: [],
        isActive: true,
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z',
      },
      {
        id: 'wh-2',
        name: 'Склад готовой продукции',
        address: 'ул. Заводская, 15, корпус Б',
        zoneNames: ['Готовая продукция', 'Отгрузка'],
        roleIds: [],
        isActive: true,
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z',
      },
    ];
  }

  getWarehouses(): Observable<ApiResponse<Warehouse[]>> {
    return this.getAll();
  }

  getWarehouse(id: string): Observable<ApiResponse<Warehouse | undefined>> {
    return this.getById(id);
  }

  getWarehousesByRole(roleId: string): Warehouse[] {
    return this.items.filter(w => w.isActive && (w.roleIds.includes(roleId) || w.roleIds.length === 0));
  }

  createWarehouse(data: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Warehouse>> {
    return this.create(data as Warehouse);
  }

  updateWarehouse(id: string, data: Partial<Omit<Warehouse, 'id' | 'createdAt'>>): Observable<ApiResponse<Warehouse>> {
    return this.update(id, data);
  }

  deleteWarehouse(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }
}
