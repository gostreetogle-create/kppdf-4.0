import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type { ApiResponse, DocumentTemplate } from '../../../shared/types/index.js';

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

function nowISO(): string {
  return new Date().toISOString();
}

/** Мок-данные: 2 примера шаблонов */
const MOCK_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'mock-quotation-001',
    name: 'Коммерческое предложение',
    description: 'Стандартный шаблон КП с таблицей товаров и условиями',
    docType: 'quotation',
    pageSize: 'A4',
    blocks: [
      { id: 'b1', type: 'text', order: 0, title: 'Заголовок', content: 'Коммерческое предложение №{{number}} от {{date}}', settings: { fontSize: '18px', align: 'center' } },
      { id: 'b2', type: 'text', order: 1, title: 'Клиент', content: 'Для: {{client.name}}', columns: [
        { id: 'c1', content: 'Клиент:', width: '30%', fontWeight: 'bold' },
        { id: 'c2', content: '{{client.name}}' },
      ]},
      { id: 'b3', type: 'table', order: 2, title: 'Товары', tableTemplateId: undefined },
      { id: 'b4', type: 'separator', order: 3, height: 20, showLine: false },
      { id: 'b5', type: 'text', order: 4, title: 'Условия', content: 'Срок поставки: {{delivery_days}} рабочих дней.\nГарантия: 12 месяцев.' },
    ],
    createdAt: '2026-06-01T10:00:00.000Z',
    updatedAt: '2026-06-02T15:30:00.000Z',
  },
  {
    id: 'mock-contract-001',
    name: 'Договор поставки',
    description: 'Типовой договор поставки товаров',
    docType: 'contract',
    pageSize: 'A4',
    blocks: [
      { id: 'b6', type: 'text', order: 0, title: 'Заголовок', content: 'ДОГОВОР ПОСТАВКИ №{{number}}', settings: { fontSize: '16px', align: 'center' } },
      { id: 'b7', type: 'text', order: 1, content: 'г. {{city}}, {{date}}' },
      { id: 'b8', type: 'text', order: 2, title: 'Стороны', columns: [
        { id: 'c3', content: '{{our_company.name}}', width: '50%', fontWeight: 'bold' },
        { id: 'c4', content: '{{client.name}}', width: '50%', fontWeight: 'bold' },
      ]},
      { id: 'b9', type: 'separator', order: 3, height: 10, showLine: true },
      { id: 'b10', type: 'text', order: 4, title: 'Предмет договора', content: 'Поставщик обязуется передать в собственность Покупателя товары согласно спецификации (Приложение №1).' },
    ],
    createdAt: '2026-05-20T08:00:00.000Z',
    updatedAt: '2026-06-03T09:00:00.000Z',
  },
];

/**
 * Сервис шаблонов документов — CRUD с хранением в памяти.
 * Позже заменяется на HTTP-сервис через ApiService.
 */
@Injectable({ providedIn: 'root' })
export class DocumentTemplateService {
  private templates: DocumentTemplate[] = [...MOCK_TEMPLATES];

  /** Получить все шаблоны */
  getTemplates(): Observable<ApiResponse<DocumentTemplate[]>> {
    return of({ success: true, data: [...this.templates] }).pipe(delay(100));
  }

  /** Получить шаблон по id */
  getTemplate(id: string): Observable<ApiResponse<DocumentTemplate | undefined>> {
    const template = this.templates.find(t => t.id === id);
    return of({ success: !!template, data: template ? this.deepClone(template) : undefined }).pipe(delay(100));
  }

  /** Создать новый шаблон */
  createTemplate(data: Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<DocumentTemplate>> {
    const now = nowISO();
    const template: DocumentTemplate = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    this.templates.push(template);
    return of({ success: true, data: { ...template } }).pipe(delay(100));
  }

  /** Обновить существующий шаблон */
  updateTemplate(id: string, data: Partial<Omit<DocumentTemplate, 'id' | 'createdAt'>>): Observable<ApiResponse<DocumentTemplate>> {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) {
      return of({ success: false, data: undefined as unknown as DocumentTemplate, message: 'Шаблон не найден' }).pipe(delay(100));
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
  cloneTemplate(id: string): Observable<ApiResponse<DocumentTemplate>> {
    const original = this.templates.find(t => t.id === id);
    if (!original) {
      return of({ success: false, data: undefined as unknown as DocumentTemplate, message: 'Шаблон не найден' }).pipe(delay(100));
    }
    const now = nowISO();
    const clone: DocumentTemplate = {
      ...original,
      id: generateId(),
      name: `${original.name} (копия)`,
      createdAt: now,
      updatedAt: now,
      blocks: original.blocks.map(b => ({
        ...b,
        columns: b.columns?.map(c => ({ ...c })),
        settings: b.settings ? { ...b.settings } : undefined,
      })),
    };
    this.templates.push(clone);
    return of({ success: true, data: { ...clone } }).pipe(delay(100));
  }

  /** Глубокое клонирование шаблона */
  private deepClone(t: DocumentTemplate): DocumentTemplate {
    return {
      ...t,
      blocks: t.blocks.map(b => ({
        ...b,
        columns: b.columns?.map(c => ({ ...c })),
        settings: b.settings ? { ...b.settings } : undefined,
      })),
    };
  }
}
