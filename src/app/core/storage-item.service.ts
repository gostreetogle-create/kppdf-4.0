import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './crud-factory.js';
import type { ApiResponse, StorageItem } from '../../../shared/types/index.js';

@Injectable({ providedIn: 'root' })
export class StorageItemService extends BaseCrudService<StorageItem> {
  constructor() {
    super();
    this.items = [
      {
        id: 'si-1',
        name: 'Сварочный аппарат TIG-200',
        description: 'Аргонодуговая сварка, 200А',
        weightKg: 15,
        dimensions: '450×200×300',
        notes: 'Цех №1, пост сварки',
        isActive: true,
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z',
      },
      {
        id: 'si-2',
        name: 'Токарный станок ТВ-4',
        description: 'Настольный токарный станок по металлу',
        weightKg: 45,
        dimensions: '600×300×300',
        notes: 'Серийный № TS-2024-001',
        isActive: true,
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z',
      },
      {
        id: 'si-3',
        name: 'Компрессор воздушный К-24',
        description: 'Поршневой компрессор 24 л, 1.5 кВт',
        weightKg: 28,
        dimensions: '550×280×540',
        isActive: true,
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z',
      },
    ];
  }

  getStorageItems(): Observable<ApiResponse<StorageItem[]>> {
    return this.getAll();
  }

  getStorageItem(id: string): Observable<ApiResponse<StorageItem | undefined>> {
    return this.getById(id);
  }

  createStorageItem(data: Omit<StorageItem, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<StorageItem>> {
    return this.create(data as StorageItem);
  }

  updateStorageItem(id: string, data: Partial<Omit<StorageItem, 'id' | 'createdAt'>>): Observable<ApiResponse<StorageItem>> {
    return this.update(id, data);
  }

  deleteStorageItem(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }
}
