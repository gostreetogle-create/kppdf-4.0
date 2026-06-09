import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import type { ApiResponse, DocumentTemplate } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class DocumentTemplateService {
  private api = inject(ApiService);
  private basePath = '/document-templates';

  /** Получить все шаблоны */
  getTemplates(): Observable<ApiResponse<DocumentTemplate[]>> {
    return this.api.get<DocumentTemplate[]>(this.basePath);
  }

  /** Получить шаблон по id */
  getTemplate(id: string): Observable<ApiResponse<DocumentTemplate | undefined>> {
    return this.api.getById<DocumentTemplate>(this.basePath, id);
  }

  /** Создать новый шаблон */
  createTemplate(data: Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<DocumentTemplate>> {
    return this.api.post<DocumentTemplate>(this.basePath, data);
  }

  /** Обновить существующий шаблон */
  updateTemplate(id: string, data: Partial<Omit<DocumentTemplate, 'id' | 'createdAt'>>): Observable<ApiResponse<DocumentTemplate>> {
    return this.api.put<DocumentTemplate>(this.basePath, id, data);
  }

  /** Удалить шаблон */
  deleteTemplate(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }

  /** Клонировать шаблон (создать копию через бэкенд) */
  cloneTemplate(id: string): Observable<ApiResponse<DocumentTemplate>> {
    return this.api.getById<DocumentTemplate>(this.basePath, id).pipe(
      switchMap(res => {
        if (!res.success || !res.data) {
          return of({ success: false, data: undefined as unknown as DocumentTemplate, message: 'Шаблон не найден' });
        }
        const original = res.data;
        const { id: _id, createdAt: _created, updatedAt: _updated, ...rest } = original;
        const cloneData = {
          ...rest,
          name: `${original.name} (копия)`,
          blocks: original.blocks.map(b => ({
            ...b,
            columns: b.columns?.map(c => ({ ...c })),
            settings: b.settings ? { ...b.settings } : undefined,
          })),
        };
        return this.api.post<DocumentTemplate>(this.basePath, cloneData);
      }),
    );
  }
}
