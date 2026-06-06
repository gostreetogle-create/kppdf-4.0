import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import type { TableMeta, TableField } from '../../../shared/types/index.js';

const MOCK_TABLES: TableMeta[] = [
  {
    name: 'products',
    label: 'Товары',
    collection: 'products',
    fields: [
      { name: 'sku', label: 'Артикул (SKU)', type: 'string' },
      { name: 'name', label: 'Наименование', type: 'string' },
      { name: 'categoryId', label: 'Категория', type: 'string' },
      { name: 'productType', label: 'Тип (покупной/изготавливаемый)', type: 'string' },
      { name: 'basePrice', label: 'Базовая цена', type: 'number' },
      { name: 'defaultMarkupPercent', label: 'Наценка по умолчанию, %', type: 'number' },
      { name: 'unit', label: 'Ед. измерения', type: 'string' },
      { name: 'weightKg', label: 'Вес, кг', type: 'number' },
      { name: 'dimensions', label: 'Габариты (Д×Ш×В)', type: 'string' },
      { name: 'material', label: 'Материал', type: 'string' },
      { name: 'description', label: 'Описание', type: 'string' },
      { name: 'hasPassport', label: 'Паспорт качества', type: 'boolean' },
      { name: 'hasDrawing', label: 'Чертёж (DWG)', type: 'boolean' },
      { name: 'isActive', label: 'Активен', type: 'boolean' },
    ],
  },
  {
    name: 'organizations',
    label: 'Контрагенты',
    collection: 'organizations',
    fields: [
      { name: 'name', label: 'Наименование', type: 'string' },
      { name: 'shortName', label: 'Краткое наименование', type: 'string' },
      { name: 'legalForm', label: 'ОПФ (ООО/ИП/АО)', type: 'string' },
      { name: 'inn', label: 'ИНН', type: 'string' },
      { name: 'kpp', label: 'КПП', type: 'string' },
      { name: 'ogrn', label: 'ОГРН', type: 'string' },
      { name: 'phone', label: 'Телефон', type: 'string' },
      { name: 'email', label: 'Email', type: 'string' },
      { name: 'legalAddress', label: 'Юридический адрес', type: 'string' },
      { name: 'postalAddress', label: 'Почтовый адрес', type: 'string' },
      { name: 'bankName', label: 'Банк', type: 'string' },
      { name: 'bankBik', label: 'БИК', type: 'string' },
      { name: 'bankAccount', label: 'Расчётный счёт', type: 'string' },
      { name: 'signerName', label: 'Подписант (ФИО)', type: 'string' },
      { name: 'signerPosition', label: 'Должность подписанта', type: 'string' },
      { name: 'counterpartyRoles', label: 'Роли контрагента', type: 'string' },
      { name: 'contactPerson', label: 'Контактное лицо', type: 'string' },
      { name: 'paymentTermDays', label: 'Отсрочка платежа (дн.)', type: 'number' },
      { name: 'isActive', label: 'Активен', type: 'boolean' },
    ],
  },
  {
    name: 'clients',
    label: 'Клиенты (физ.лица)',
    collection: 'clients',
    fields: [
      { name: 'lastName', label: 'Фамилия', type: 'string' },
      { name: 'firstName', label: 'Имя', type: 'string' },
      { name: 'patronymic', label: 'Отчество', type: 'string' },
      { name: 'phone', label: 'Телефон', type: 'string' },
      { name: 'email', label: 'Email', type: 'string' },
      { name: 'inn', label: 'ИНН', type: 'string' },
      { name: 'address', label: 'Адрес', type: 'string' },
      { name: 'organizationId', label: 'Организация', type: 'string' },
      { name: 'isActive', label: 'Активен', type: 'boolean' },
    ],
  },
  {
    name: 'counterparties',
    label: 'Контрагенты',
    collection: 'organizations',
    fields: [
      { name: 'name', label: 'Наименование', type: 'string' },
      { name: 'shortName', label: 'Краткое наименование', type: 'string' },
      { name: 'legalForm', label: 'ОПФ (ООО/ИП/АО)', type: 'string' },
      { name: 'inn', label: 'ИНН', type: 'string' },
      { name: 'kpp', label: 'КПП', type: 'string' },
      { name: 'ogrn', label: 'ОГРН', type: 'string' },
      { name: 'phone', label: 'Телефон', type: 'string' },
      { name: 'email', label: 'Email', type: 'string' },
      { name: 'legalAddress', label: 'Юридический адрес', type: 'string' },
      { name: 'postalAddress', label: 'Почтовый адрес', type: 'string' },
      { name: 'bankName', label: 'Банк', type: 'string' },
      { name: 'bankBik', label: 'БИК', type: 'string' },
      { name: 'bankAccount', label: 'Расчётный счёт', type: 'string' },
      { name: 'signerName', label: 'Подписант (ФИО)', type: 'string' },
      { name: 'signerPosition', label: 'Должность подписанта', type: 'string' },
      { name: 'counterpartyRoleIds', label: 'ID ролей', type: 'string' },
      { name: 'contactPerson', label: 'Контактное лицо', type: 'string' },
      { name: 'paymentTermDays', label: 'Отсрочка платежа (дн.)', type: 'number' },
      { name: 'isActive', label: 'Активен', type: 'boolean' },
    ],
  },
  {
    name: 'counterparty-role-types',
    label: 'Виды контрагентов',
    collection: 'counterparty-roles',
    fields: [
      { name: 'name', label: 'Название', type: 'string' },
      { name: 'slug', label: 'Системный ключ', type: 'string' },
      { name: 'description', label: 'Описание', type: 'string' },
      { name: 'isActive', label: 'Активен', type: 'boolean' },
    ],
  },
  {
    name: 'product-categories',
    label: 'Категории товаров',
    collection: 'product-categories',
    fields: [
      { name: 'name', label: 'Название', type: 'string' },
      { name: 'prefix', label: 'Префикс (SP, MF...)', type: 'string' },
      { name: 'description', label: 'Описание', type: 'string' },
      { name: 'sortOrder', label: 'Порядок', type: 'number' },
      { name: 'isActive', label: 'Активна', type: 'boolean' },
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
