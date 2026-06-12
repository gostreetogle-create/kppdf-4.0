/** Типы для обмена данными с 1С:Предприятие */

/** Настройки подключения к 1С */
export interface OneCSettings {
  /** Включена ли интеграция */
  enabled: boolean;
  /** URL HTTP-сервиса 1С (например http://1c-server/base/hs/exchange) */
  baseUrl: string;
  /** Логин для Basic Auth */
  username: string;
  /** Пароль для Basic Auth (не возвращается при GET) */
  password?: string;
  /** Режим обмена: http-сервис / odata / file */
  mode: 'http' | 'odata' | 'file';
  /** Интервал автообмена в минутах (0 = отключено) */
  syncIntervalMinutes: number;
  /** Последняя успешная синхронизация */
  lastSyncAt?: string;
  /** Статус последней синхронизации */
  lastSyncStatus?: 'ok' | 'error';
  /** Сообщение последней синхронизации */
  lastSyncMessage?: string;
}

/** Контрагент (из 1С) */
export interface OneCCounterparty {
  /** ИНН */
  inn: string;
  /** КПП */
  kpp?: string;
  /** Наименование */
  name: string;
  /** Полное наименование */
  fullName?: string;
  /** Юридический адрес */
  legalAddress?: string;
  /** Фактический адрес */
  actualAddress?: string;
  /** GUID из 1С */
  oneCGuid: string;
}

/** Номенклатура (товар/услуга из 1С) */
export interface OneCNomenclature {
  /** Артикул */
  article: string;
  /** Наименование */
  name: string;
  /** Полное наименование */
  fullName?: string;
  /** Единица измерения */
  unit?: string;
  /** Ставка НДС */
  vatRate?: number;
  /** Цена */
  price?: number;
  /** GUID из 1С */
  oneCGuid: string;
}

/** Документ поступления (из 1С) */
export interface OneCIncomingDocument {
  /** Тип документа: поступление, счёт-фактура, etc. */
  type: 'receipt' | 'invoice' | 'payment' | 'shipment';
  /** Номер документа */
  number: string;
  /** Дата */
  date: string;
  /** Сумма */
  amount: number;
  /** Контрагент */
  counterparty: OneCCounterparty;
  /** Строки документа */
  items?: OneCDocumentItem[];
  /** GUID из 1С */
  oneCGuid: string;
}

/** Строка документа (из 1С) */
export interface OneCDocumentItem {
  /** Номенклатура */
  nomenclature: OneCNomenclature;
  /** Количество */
  quantity: number;
  /** Цена */
  price: number;
  /** Сумма */
  amount: number;
  /** Ставка НДС */
  vatRate?: number;
  /** Сумма НДС */
  vatAmount?: number;
}

/** Запрос на обмен с 1С */
export interface OneCExchangeRequest {
  /** Тип обмена: import / export */
  direction: 'import' | 'export';
  /** Какие сущности обменивать */
  entities: ('counterparties' | 'nomenclature' | 'documents' | 'orders')[];
  /** Фильтр по дате (документы с этой даты) */
  dateFrom?: string;
  /** Фильтр по дате (документы по эту дату) */
  dateTo?: string;
}

/** Результат обмена с 1С */
export interface OneCExchangeResult {
  success: boolean;
  direction: 'import' | 'export';
  entities: string[];
  processed: number;
  errors: number;
  messages: string[];
  timestamp: string;
}
