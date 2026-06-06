// ========================================
// Shared Types — общие для Frontend и Backend
// ========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  role: 'admin' | 'manager' | 'viewer';
  permissions: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

// ========================================
// Таблицы и шаблоны (kppdf-4.0)
// ========================================

/** Метаданные таблицы/справочника */
export interface TableMeta {
  name: string;
  label: string;
  collection: string;
  fields: TableField[];
}

/** Поле таблицы */
export interface TableField {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date';
}

/** Сохранённый шаблон таблицы */
export interface TableTemplate {
  id: string;
  name: string;
  columns: TemplateColumn[];
  createdAt: string;
  updatedAt: string;
}

/** Колонка внутри шаблона */
export interface TemplateColumn {
  tableName: string;
  fieldName: string;
  label: string;
  width?: string;
  order: number;
}

// ========================================
// Шаблоны документов (Document Templates)
// ========================================

/** Тип документа */
export type DocType = 'quotation' | 'contract' | 'invoice' | 'shipping';

/** Тип блока документа */
export type DocBlockType = 'text' | 'table' | 'separator';

/** Настройки блока */
export interface DocBlockSettings {
  padding?: string;
  fontSize?: string;
  align?: 'left' | 'center' | 'right';
}

/** Колонка текстового блока */
export interface DocTextColumn {
  id: string;
  content: string;
  width?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  color?: string;
}

/** Блок документа */
export interface DocBlock {
  id: string;
  type: DocBlockType;
  order: number;
  title?: string;
  content?: string;
  columns?: DocTextColumn[];
  tableTemplateId?: string;
  height?: number;
  showLine?: boolean;
  settings?: DocBlockSettings;
}

// ========================================
// Справочники (CRUD-сущности)
// ========================================

/**
 * Справочник «Виды контрагентов» — настраиваемый список ролей.
 * Можно добавлять, редактировать, удалять через интерфейс.
 */
export interface CounterpartyRoleDef {
  id: string;
  name: string;
  description: string;
  /** Системный ключ для быстрой фильтрации (заполняется автоматически) */
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Контрагент — юр.лицо / ИП, которое может выступать в разных ролях.
 * Объединяет бывшие справочники «Организации» и «Поставщики».
 */
export interface Organization {
  id: string;
  name: string;
  shortName: string;
  legalForm: string;
  inn: string;
  kpp: string;
  ogrn: string;
  phone: string;
  email: string;
  legalAddress: string;
  postalAddress: string;
  bankName: string;
  bankBik: string;
  bankAccount: string;
  signerName: string;
  signerPosition: string;
  /** ID ролей контрагента из справочника "Виды контрагентов" */
  counterpartyRoleIds: string[];
  /** Контактное лицо (для поставщиков) */
  contactPerson: string;
  /** Отсрочка платежа в днях (для поставщиков) */
  paymentTermDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * @deprecated Используйте Organization с counterpartyRoleIds.
 * Supplier удалён. Все поставщики теперь хранятся как Organization.
 */
export type Supplier = Organization;

/** Шаблон документа */
export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  docType: DocType;
  pageSize?: 'A4' | 'A5' | 'letter';
  backgroundImage?: string;
  blocks: DocBlock[];
  createdAt: string;
  updatedAt: string;
}

// ========================================
// Feature Flags (флаги возможностей)
// ========================================

/** Один флаг возможности */
export interface FeatureFlagDef {
  /** Ключ флага (уникальный) */
  key: string;
  /** Название для отображения */
  label: string;
  /** Описание — что делает этот флаг */
  description: string;
  /** Включён по умолчанию */
  enabledByDefault: boolean;
  /** Категория для группировки */
  category: string;
}

/**
 * Все доступные флаги возможностей.
 * Добавляйте сюда новые флаги по мере появления.
 */
export const FEATURE_FLAGS: FeatureFlagDef[] = [
  {
    key: 'placeholders',
    label: 'Заготовки для подстановки',
    description: 'Панель «Вставить заготовку» в редакторе текстовых блоков ({{...}})',
    enabledByDefault: true,
    category: 'Документы',
  },
  {
    key: 'pdfExport',
    label: 'Экспорт PDF',
    description: 'Кнопка «Скачать PDF» в предпросмотре документов',
    enabledByDefault: true,
    category: 'Документы',
  },
  {
    key: 'counterpartyRoles',
    label: 'Динамические роли контрагентов',
    description: 'Справочник «Виды контрагентов» с возможностью добавлять/редактировать роли',
    enabledByDefault: true,
    category: 'Справочники',
  },
  {
    key: 'deferDialogs',
    label: 'Ленивая загрузка диалогов',
    description: 'Диалоги и предпросмотр загружаются только когда браузер свободен',
    enabledByDefault: true,
    category: 'Производительность',
  },
  {
    key: 'advancedSearch',
    label: 'Расширенный поиск',
    description: 'Фильтры и поиск по нескольким полям в таблицах (в разработке)',
    enabledByDefault: false,
    category: 'Экспериментальное',
  },
];
