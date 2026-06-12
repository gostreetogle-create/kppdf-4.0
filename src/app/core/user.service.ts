import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, User } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);
  private basePath = '/users';

  readonly roleOptions = [
    { value: 'admin', label: '👑 Администратор' },
    { value: 'manager', label: '💰 Менеджер продаж' },
    { value: 'production', label: '🏭 Рук. производства' },
    { value: 'storekeeper', label: '📦 Кладовщик' },
    { value: 'accountant', label: '🧾 Бухгалтер' },
    { value: 'viewer', label: '👁️ Наблюдатель' },
  ];

  getAll(): Observable<ApiResponse<User[]>> {
    return this.api.get<User[]>(this.basePath);
  }

  getById(id: string): Observable<ApiResponse<User | undefined>> {
    return this.api.getById<User>(this.basePath, id);
  }

  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<User>> {
    return this.api.post<User>(this.basePath, data);
  }

  update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Observable<ApiResponse<User>> {
    return this.api.put<User>(this.basePath, id, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }

}
