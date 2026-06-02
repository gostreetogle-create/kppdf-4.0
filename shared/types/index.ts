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
