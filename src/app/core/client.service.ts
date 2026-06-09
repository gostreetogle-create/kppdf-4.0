import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse, Client } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private api = inject(ApiService);
  private basePath = '/clients';

  getAll(): Observable<ApiResponse<Client[]>> {
    return this.getClients();
  }

  getClients(): Observable<ApiResponse<Client[]>> {
    return this.api.get<Client[]>(this.basePath);
  }

  getClient(id: string): Observable<ApiResponse<Client | undefined>> {
    return this.api.getById<Client>(this.basePath, id);
  }

  createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Client>> {
    return this.api.post<Client>(this.basePath, data);
  }

  updateClient(id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>): Observable<ApiResponse<Client>> {
    return this.api.put<Client>(this.basePath, id, data);
  }

  deleteClient(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }
}
