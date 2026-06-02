import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import type { ApiResponse, TableTemplate } from '../../../shared/types/index.js';

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

function nowISO(): string {
  return new Date().toISOString();
}

/**
 * Сервис шаблонов таблиц — CRUD с хранением в памяти.
 *
 * Позже заменяется на HTTP-сервис через ApiService,
 * интерфейс остаётся неизменным (Observable<ApiResponse<T>>).
 */
@Injectable({ providedIn: 'root' })
export class TableTemplateService {
  private templates: TableTemplate[] = [];

  /** Получить все шаблоны */
  getTemplates(): Observable<ApiResponse<TableTemplate[]>> {
    return of({
      success: true,
      data: [...this.templates],
    }).pipe(delay(100));
  }

  /** Получить шаблон по id */
  getTemplate(id: string): Observable<ApiResponse<TableTemplate | undefined>> {
    const template = this.templates.find(t => t.id === id);
    return of({
      success: !!template,
      data: template ? { ...template } : undefined,
    }).pipe(delay(100));
  }

  /** Создать новый шаблон */
  createTemplate(data: Omit<TableTemplate, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<TableTemplate>> {
    const now = nowISO();
    const template: TableTemplate = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.templates.push(template);
    return of({ success: true, data: { ...template } }).pipe(delay(100));
  }

  /** Обновить существующий шаблон */
  updateTemplate(id: string, data: Partial<Omit<TableTemplate, 'id' | 'createdAt'>>): Observable<ApiResponse<TableTemplate>> {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) {
      return of({ success: false, data: undefined as unknown as TableTemplate, message: 'Шаблон не найден' }).pipe(delay(100));
    }
    this.templates[index] = { ...this.templates[index], ...data, id, updatedAt: nowISO() };
    return of({ success: true, data: { ...this.templates[index] } }).pipe(delay(100));
  }

  /** Удалить шаблон */
  deleteTemplate(id: string): Observable<ApiResponse<void>> {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) {
      return of({ success: false, data: undefined, message: 'Шаблон не найден' }).pipe(delay(100));
    }
    this.templates.splice(index, 1);
    return of({ success: true, data: undefined }).pipe(delay(100));
  }

  /** Клонировать шаблон */
  cloneTemplate(id: string): Observable<ApiResponse<TableTemplate>> {
    const original = this.templates.find(t => t.id === id);
    if (!original) {
      return of({ success: false, data: undefined as unknown as TableTemplate, message: 'Шаблон не найден' }).pipe(delay(100));
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
    this.templates.push(clone);
    return of({ success: true, data: { ...clone } }).pipe(delay(100));
  }
}
