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

/** Организация — юр.лицо / ИП */
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
