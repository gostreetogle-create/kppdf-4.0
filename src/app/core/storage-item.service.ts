import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, StorageItem } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class StorageItemService {
  private api = inject(ApiService);
  private basePath = '/storage-items';

  getStorageItems(): Observable<ApiResponse<StorageItem[]>> {
    return this.api.get<StorageItem[]>(this.basePath);
  }

  getStorageItem(id: string): Observable<ApiResponse<StorageItem | undefined>> {
    return this.api.getById<StorageItem>(this.basePath, id);
  }

  createStorageItem(data: Omit<StorageItem, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<StorageItem>> {
    return this.api.post<StorageItem>(this.basePath, data);
  }

  updateStorageItem(id: string, data: Partial<Omit<StorageItem, 'id' | 'createdAt'>>): Observable<ApiResponse<StorageItem>> {
    return this.api.put<StorageItem>(this.basePath, id, data);
  }

  deleteStorageItem(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
