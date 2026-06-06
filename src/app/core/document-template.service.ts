import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type { ApiResponse, DocumentTemplate, DocBlock } from '../../../shared/types/index.js';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';

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

@Injectable({ providedIn: 'root' })
export class DocumentTemplateService extends BaseCrudService<DocumentTemplate> {
  constructor() {
    super();
    this.items = MOCK_TEMPLATES.map(t => this.cloneItem(t));
  }

  // ─── Совместимые методы (тонкие обёртки) ───

  /** Получить все шаблоны */
  getTemplates(): Observable<ApiResponse<DocumentTemplate[]>> {
    return this.getAll();
  }

  /** Получить шаблон по id */
  getTemplate(id: string): Observable<ApiResponse<DocumentTemplate | undefined>> {
    return this.getById(id);
  }

  /** Создать новый шаблон */
  createTemplate(data: Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<DocumentTemplate>> {
    return this.create(data);
  }

  /** Обновить существующий шаблон */
  updateTemplate(id: string, data: Partial<Omit<DocumentTemplate, 'id' | 'createdAt'>>): Observable<ApiResponse<DocumentTemplate>> {
    return this.update(id, data);
  }

  /** Удалить шаблон */
  deleteTemplate(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }

  /** Клонировать шаблон */
  cloneTemplate(id: string): Observable<ApiResponse<DocumentTemplate>> {
    const original = this.items.find(t => t.id === id);
    if (!original) {
      return of({ success: false, data: undefined as unknown as DocumentTemplate, message: 'Шаблон не найден' }).pipe(delay(this.delayMs));
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
    this.items.push(clone);
    return of({ success: true, data: { ...clone } }).pipe(delay(this.delayMs));
  }

  /** Переопределяем cloneItem для глубокого клонирования блоков */
  protected override cloneItem(t: DocumentTemplate): DocumentTemplate {
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
