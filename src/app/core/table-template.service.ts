import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type { ApiResponse, TableTemplate } from '../../../shared/types/index.js';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';

@Injectable({ providedIn: 'root' })
export class TableTemplateService extends BaseCrudService<TableTemplate> {
  constructor() {
    super();
    this.items = [];
  }

  // ─── Совместимые методы (тонкие обёртки) ───

  /** Получить все шаблоны */
  getTemplates(): Observable<ApiResponse<TableTemplate[]>> {
    return this.getAll();
  }

  /** Получить шаблон по id */
  getTemplate(id: string): Observable<ApiResponse<TableTemplate | undefined>> {
    return this.getById(id);
  }

  /** Создать новый шаблон */
  createTemplate(data: Omit<TableTemplate, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<TableTemplate>> {
    return this.create(data);
  }

  /** Обновить существующий шаблон */
  updateTemplate(id: string, data: Partial<Omit<TableTemplate, 'id' | 'createdAt'>>): Observable<ApiResponse<TableTemplate>> {
    return this.update(id, data);
  }

  /** Удалить шаблон */
  deleteTemplate(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }

  /** Клонировать шаблон */
  cloneTemplate(id: string): Observable<ApiResponse<TableTemplate>> {
    const original = this.items.find(t => t.id === id);
    if (!original) {
      return of({ success: false, data: undefined as unknown as TableTemplate, message: 'Шаблон не найден' }).pipe(delay(this.delayMs));
    }
    const now = nowISO();
    const clone: TableTemplate = {
      ...original,
      id: generateId(),
      name: `${original.name} (копия)`,
      createdAt: now,
      updatedAt: now,
      columns: original.columns.map(c => ({ ...c })),
    };
    this.items.push(clone);
    return of({ success: true, data: { ...clone } }).pipe(delay(this.delayMs));
  }
}
