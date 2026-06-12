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
  phone?: string;
  role: 'admin' | 'manager' | 'production' | 'storekeeper' | 'accountant' | 'viewer';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

/** Тип документа — соответствует slug из справочника DocTypeDef */
export type DocType = string;

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
  /** Внутренние данные (не сохраняются в шаблон БД). Строки для table-блока в режиме preview. */
  _inlineRows?: Record<string, unknown>[];

  /**
   * Итоговые суммы по колонкам (key = fieldName, value = сумма).
   * Заполняется proposal-showcase или cart service перед передачей блоков.
   */
  _columnSummaries?: Record<string, number>;

  /**
   * Дополнительные строки подвала: { label, value } пары.
   * Например: ["Итого", "125 000 ₽"], ["Скидка", "12 500 ₽"], ["НДС", "20 000 ₽"]
   */
  _footerRows?: { label: string; value: string }[];
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
  /** Ставка НДС (%) — по умолчанию 20% */
  vatRate?: number;
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
  /** Массив фоновых изображений для разных страниц */
  backgroundImages?: string[];
  /** ID организации, которая выставляет документ */
  organizationId?: string;
  /** Флажок «по умолчанию» — автоматически подставлять при создании */
  isDefault?: boolean;
  /** Прозрачность фоновых изображений (0..1, по умолчанию 1) */
  backgroundOpacity?: number;
  blocks: DocBlock[];
  createdAt: string;
  updatedAt: string;
}

// ========================================
// Справочник типов документов
// ========================================

/** Тип документа (из справочника) */
export interface DocTypeDef {
  id: string;
  name: string;
  /** Системный ключ */
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Начальные типы документов */
export const SEED_DOC_TYPES: DocTypeDef[] = [
  { id: 'dt-quotation', name: 'Коммерческое предложение', slug: 'quotation', description: 'Стандартное коммерческое предложение', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'dt-contract', name: 'Договор', slug: 'contract', description: 'Договор поставки/оказания услуг', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'dt-invoice', name: 'Счёт', slug: 'invoice', description: 'Счёт на оплату', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'dt-shipping', name: 'Отгрузка', slug: 'shipping', description: 'Отгрузочные документы', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

// ========================================
// Модуль «Товары и категории» (Products)
// ========================================

/** Тип товара */
export type ProductType = 'purchased' | 'manufactured';

/** Категория товара */
export interface ProductCategory {
  id: string;
  name: string;
  /** Префикс для артикула (SP, MF, OG, OS, MB, NV, PR) */
  prefix: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Фотография товара */
export interface ProductPhoto {
  id: string;
  productId: string;
  url: string;
  /** Опционально: подпись к фото */
  caption?: string;
  isMain: boolean;
  sortOrder: number;
  createdAt: string;
}

/** Товар */
export interface Product {
  id: string;
  /** Артикул (SKU): 2 буквы категории + 4 цифры */
  sku: string;
  /** Наименование */
  name: string;
  /** Категория */
  categoryId: string;
  /** Тип: покупной / изготавливаемый */
  productType: ProductType;
  /** Описание, характеристики */
  description?: string;
  /** Базовая цена (из прайс-листа) */
  basePrice?: number;
  /** Наценка по умолчанию в % */
  defaultMarkupPercent?: number;
  /** Единица измерения: шт / комплект / кв.м / м.п / кг */
  unit: string;
  /** Вес в кг */
  weightKg?: number;
  /** Габариты: Д×Ш×В мм */
  dimensions?: string;
  /** Основной материал */
  material?: string;
  /** Есть паспорт качества */
  hasPassport: boolean;
  /** Есть чертёж (DWG) */
  hasDrawing: boolean;
  /** Фотографии */
  photos?: ProductPhoto[];
  /** Активен (показывать в витрине) */
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========================================
// Модуль «Клиенты» (физ.лица)
// ========================================

/**
 * Клиент — физическое лицо (контактное лицо организации или конечный клиент).
 */
export interface Client {
  id: string;
  /** Фамилия */
  lastName: string;
  /** Имя */
  firstName: string;
  /** Отчество */
  patronymic?: string;
  /** Телефон */
  phone: string;
  /** Email */
  email?: string;
  /** ИНН физического лица */
  inn?: string;
  /** Адрес */
  address?: string;
  /** ID организации (контрагента), к которой прикреплён клиент */
  organizationId?: string;
  /** Индивидуальная наценка в % */
  personalMarkupPercent?: number;
  /** Комментарий */
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Seed-клиенты для инициализации */
export const SEED_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    lastName: 'Иванов',
    firstName: 'Иван',
    patronymic: 'Иванович',
    phone: '+7 (918) 555-01-01',
    email: 'ivanov@example.ru',
    address: 'г. Краснодар, ул. Ленина, д. 10',
    isActive: true,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'cli-2',
    lastName: 'Петров',
    firstName: 'Пётр',
    patronymic: 'Сергеевич',
    phone: '+7 (918) 555-02-02',
    email: 'petrov@example.ru',
    inn: '123456789012',
    organizationId: 'org-1',
    address: 'г. Краснодар, ул. Красная, д. 50',
    isActive: true,
    createdAt: '2026-02-15T10:00:00.000Z',
    updatedAt: '2026-02-15T10:00:00.000Z',
  },
  {
    id: 'cli-3',
    lastName: 'Сидорова',
    firstName: 'Анна',
    patronymic: 'Викторовна',
    phone: '+7 (918) 555-03-03',
    email: 'sidorova@example.ru',
    personalMarkupPercent: 5,
    notes: 'Постоянный клиент, скидка 5%',
    isActive: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-04-10T10:00:00.000Z',
  },
  {
    id: 'cli-4',
    lastName: 'Кузнецов',
    firstName: 'Андрей',
    patronymic: 'Викторович',
    phone: '+7 (961) 555-04-04',
    inn: '987654321098',
    organizationId: 'sup-1',
    notes: 'Контактное лицо — ООО «МеталлПродукт»',
    isActive: true,
    createdAt: '2026-03-20T10:00:00.000Z',
    updatedAt: '2026-03-20T10:00:00.000Z',
  },
  {
    id: 'cli-5',
    lastName: 'Смирнова',
    firstName: 'Елена',
    patronymic: 'Игоревна',
    phone: '+7 (495) 777-88-99',
    email: 'info@chemreactive.ru',
    organizationId: 'sup-2',
    notes: 'Контактное лицо — АО «ХимРеактив»',
    isActive: true,
    createdAt: '2026-04-05T10:00:00.000Z',
    updatedAt: '2026-04-05T10:00:00.000Z',
  },
];

// ========================================
// Модуль «Корзина» (Cart)
// ========================================

/**
 * Позиция в корзине — snapshot товара на момент добавления.
 * Цена фиксируется, чтобы не менялась при изменении прайса.
 */
export interface CartItem {
  id: string;
  /** ID товара из справочника */
  productId: string;
  /** Артикул (копия на момент добавления) */
  sku: string;
  /** Наименование (копия) */
  name: string;
  /** Единица измерения */
  unit: string;
  /** Количество */
  quantity: number;
  /** Цена за единицу на момент добавления (без наценки) */
  price: number;
  /** Процент наценки (копия из Product.defaultMarkupPercent на момент добавления) */
  markupPercent?: number;
  /** Вес, кг (копия из Product) */
  weightKg?: number;
  /** Габариты (копия из Product) */
  dimensions?: string;
  /** Основной материал (копия из Product) */
  material?: string;
}

// ========================================
// Модуль «Коммерческие предложения» (Phase 1.3)
// ========================================

// Реэкспорт из отдельного файла для чистоты
export type { ProposalStatus, ProposalItem, CommercialProposal } from './proposal.js';

export type { ContractStatus, ContractItem, Contract } from './contract.js';

export type {
  ProductComponent, ComponentMaterial, ComponentWorkType,
} from './product-component.js';

export type {
  StorageItem, Warehouse, InventoryItem, InventoryMovement,
  InventoryEntityType, MovementType,
  PurchaseRequest, PurchaseRequestStatus,
  SupplierOrder, SupplierOrderItem, SupplierOrderStatus,
  IncomingInvoice, InvoiceStatus,
} from './warehouse.js';

export type {
  WorkType, WorkCenter, Worker,
  ProductionOrder, ProductionOrderStatus,
  OrderTask, TaskStatus,
  MissingDataType, MissingDataIssue,
} from './production.js';

export type {
  Tender, TenderDocument, TenderType, TenderStatus,
  StatusWorkflow, StatusTransition,
  RoleDef, Section,
  RppEntry, RppStatus,
  Certificate, CertStatus,
  InventorFile, CadFileType,
} from './administration.js';

export type {
  OrderClosing, ClosingType,
  ReconciliationAct,
  FinancialReport, ReportType,
} from './finance.js';

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
