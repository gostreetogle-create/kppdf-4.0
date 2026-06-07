import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './crud-factory.js';
import type { ApiResponse, Client } from '../../../shared/types/index.js';
import { SEED_CLIENTS } from '../../../shared/types/index.js';

@Injectable({ providedIn: 'root' })
export class ClientService extends BaseCrudService<Client> {
  constructor() {
    super();
    this.items = SEED_CLIENTS.map(c => ({ ...c }));
  }

  getClients(): Observable<ApiResponse<Client[]>> {
    return this.getAll();
  }

  getClient(id: string): Observable<ApiResponse<Client | undefined>> {
    return this.getById(id);
  }

  createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Client>> {
    return this.create(data);
  }

  updateClient(id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>): Observable<ApiResponse<Client>> {
    return this.update(id, data);
  }

  deleteClient(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }
}
