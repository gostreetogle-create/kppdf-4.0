import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';
import type { ApiResponse, DocTypeDef } from '../../../shared/types/index.js';
import { SEED_DOC_TYPES } from '../../../shared/types/index.js';

@Injectable({ providedIn: 'root' })
export class DocTypeService extends BaseCrudService<DocTypeDef> {
  constructor() {
    super();
    this.items = SEED_DOC_TYPES.map(t => ({ ...t }));
  }

  getDocTypes(): Observable<ApiResponse<DocTypeDef[]>> {
    return this.getAll();
  }

  getDocType(id: string): Observable<ApiResponse<DocTypeDef | undefined>> {
    return this.getById(id);
  }

  createDocType(data: Omit<DocTypeDef, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<DocTypeDef>> {
    const now = nowISO();
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '_').replace(/^_|_$/g, '');
    const docType: DocTypeDef = { ...data, id: generateId(), slug, createdAt: now, updatedAt: now };
    this.items.push(docType);
    return of({ success: true, data: { ...docType } }).pipe(delay(this.delayMs));
  }

  updateDocType(id: string, data: Partial<Omit<DocTypeDef, 'id' | 'createdAt'>>): Observable<ApiResponse<DocTypeDef>> {
    return this.update(id, data);
  }

  deleteDocType(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }
}
