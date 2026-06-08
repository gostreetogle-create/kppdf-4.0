import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import type { ApiResponse, TableTemplate } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

@Injectable({ providedIn: 'root' })
export class TableTemplateService {
  private api = inject(ApiService);
  private basePath = '/table-templates';

  /** Получить все шаблоны таблиц */
  getTemplates(): Observable<ApiResponse<TableTemplate[]>> {
    return this.api.get<TableTemplate[]>(this.basePath);
  }

  /** Получить шаблон по id */
  getTemplate(id: string): Observable<ApiResponse<TableTemplate | undefined>> {
    return this.api.getById<TableTemplate>(this.basePath, id);
  }

  /** Создать новый шаблон */
  createTemplate(data: Omit<TableTemplate, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<TableTemplate>> {
    return this.api.post<TableTemplate>(this.basePath, data as any);
  }

  /** Обновить существующий шаблон */
  updateTemplate(id: string, data: Partial<Omit<TableTemplate, 'id' | 'createdAt'>>): Observable<ApiResponse<TableTemplate>> {
    return this.api.put<TableTemplate>(this.basePath, id, data);
  }

  /** Удалить шаблон */
  deleteTemplate(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }

  /** Клонировать шаблон */
  cloneTemplate(id: string): Observable<ApiResponse<TableTemplate>> {
    return this.api.getById<TableTemplate>(this.basePath, id).pipe(
      switchMap(res => {
        if (!res.success || !res.data) {
          return of({ success: false, data: undefined as unknown as TableTemplate, message: 'Шаблон не найден' });
        }
        const original = res.data;
        const { id: _id, createdAt: _created, updatedAt: _updated, ...rest } = original;
        const cloneData = {
          ...rest,
          name: `${original.name} (копия)`,
          columns: original.columns.map(c => ({ ...c })),
        };
        return this.api.post<TableTemplate>(this.basePath, cloneData);
      }),
    );
  }
}
