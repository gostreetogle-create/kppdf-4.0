import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import type { TableMeta, TableField } from '../../../shared/types/index.js';

const MOCK_TABLES: TableMeta[] = [
  {
    name: 'products',
    label: 'Товары',
    collection: 'products',
    fields: [
      { name: 'name', label: 'Наименование', type: 'string' },
      { name: 'article', label: 'Артикул', type: 'string' },
      { name: 'price', label: 'Цена', type: 'number' },
      { name: 'category', label: 'Категория', type: 'string' },
      { name: 'unit', label: 'Ед. измерения', type: 'string' },
      { name: 'description', label: 'Описание', type: 'string' },
      { name: 'isActive', label: 'Активен', type: 'boolean' },
    ],
  },
  {
    name: 'clients',
    label: 'Клиенты',
    collection: 'clients',
    fields: [
      { name: 'name', label: 'Наименование / ФИО', type: 'string' },
      { name: 'type', label: 'Тип (физ/юрлицо)', type: 'string' },
      { name: 'phone', label: 'Телефон', type: 'string' },
      { name: 'email', label: 'Email', type: 'string' },
      { name: 'address', label: 'Адрес', type: 'string' },
      { name: 'inn', label: 'ИНН', type: 'string' },
      { name: 'contactPerson', label: 'Контактное лицо', type: 'string' },
      { name: 'isActive', label: 'Активен', type: 'boolean' },
    ],
  },
];

/**
 * Реестр таблиц — централизованный источник метаданных
 * о всех справочниках/коллекциях в системе.
 *
 * На старте работает с фейковыми данными. При появлении
 * бэкенда — меняем источник на HTTP через ApiService.
 */
@Injectable({ providedIn: 'root' })
export class TableRegistryService {
  /** Получить список всех таблиц */
  getTables(): Observable<TableMeta[]> {
    return of(MOCK_TABLES);
  }

  /** Получить одну таблицу по системному имени */
  getTable(name: string): Observable<TableMeta | undefined> {
    const table = MOCK_TABLES.find(t => t.name === name);
    return of(table);
  }

  /** Получить поля конкретной таблицы */
  getFields(tableName: string): Observable<TableField[]> {
    const table = MOCK_TABLES.find(t => t.name === tableName);
    return of(table?.fields ?? []);
  }
}
