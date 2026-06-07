// ========================================
// Модуль «Тендеры / Администрирование» (Фаза 5)
// ========================================

// ─── Тендеры ───

/** Тип тендера */
export type TenderType = '44fz' | '223fz' | 'commercial';

/** Статус тендера */
export type TenderStatus = 'draft' | 'published' | 'submission' | 'evaluation' | 'won' | 'lost' | 'cancelled';

/** Тендер */
export interface Tender {
  id: string;
  number: string;
  title: string;
  type: TenderType;
  status: TenderStatus;
  customerOrgId: string;
  customerName: string;
  /** Номер извещения на площадке */
  noticeNumber?: string;
  /** URL на ЭТП */
  platformUrl?: string;
  startPrice?: number;
  ourPrice?: number;
  publishDate?: string;
  submissionDeadline?: string;
  resultDate?: string;
  notes?: string;
  documents: TenderDocument[];
  createdAt: string;
  updatedAt: string;
}

/** Документ тендера */
export interface TenderDocument {
  id: string;
  tenderId: string;
  name: string;
  type: 'request' | 'clarification' | 'protocol' | 'contract' | 'other';
  url?: string;
  createdAt: string;
}

// ─── Статусная модель ───

/** Переход статуса */
export interface StatusTransition {
  from: string;
  to: string;
  label: string;
  /** Какие роли могут выполнить переход */
  allowedRoleIds: string[];
}

/** Статусная модель (для любой сущности) */
export interface StatusWorkflow {
  id: string;
  /** К какой сущности привязан: 'proposal', 'contract', 'production_order', 'purchase_request', etc. */
  entityType: string;
  name: string;
  statuses: string[];
  transitions: StatusTransition[];
  createdAt: string;
  updatedAt: string;
}

// ─── Роли пользователей ───

/** Раздел системы */
export interface Section {
  id: string;
  label: string;
  icon?: string;
  routerLink?: string;
}

/** Роль пользователя */
export interface RoleDef {
  id: string;
  name: string;
  description?: string;
  /** ID разделов, к которым есть доступ */
  sectionIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Реестр РПП (Минпромторг) ───

export type RppStatus = 'draft' | 'submitted' | 'registered' | 'expired';

/** Запись реестра РПП */
export interface RppEntry {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  /** Реестровый номер */
  registryNumber?: string;
  status: RppStatus;
  submissionDate?: string;
  registrationDate?: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Сертификаты ЕАЭС ───

export type CertStatus = 'valid' | 'expiring' | 'expired' | 'revoked';

/** Сертификат */
export interface Certificate {
  id: string;
  productIds: string[];
  productNames: string;
  /** Номер сертификата */
  number: string;
  /** Тип: декларация / сертификат */
  certType: 'declaration' | 'certificate';
  status: CertStatus;
  issuedBy?: string;
  issueDate?: string;
  expiryDate?: string;
  fileUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Реестр CAD-файлов ───

export type CadFileType = 'dwg' | 'idw' | 'step' | 'stl' | 'pdf';

/** Запись реестра CAD-файлов (только метаданные) */
export interface InventorFile {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  fileName: string;
  fileType: CadFileType;
  /** Размер в КБ */
  sizeKb?: number;
  version?: string;
  /** Кто создал / изменил */
  author?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
