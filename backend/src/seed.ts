#!/usr/bin/env tsx
/**
 * seed.ts — Заполняет MongoDB тестовыми данными для разработки.
 *
 * Использование:
 *   npm run seed                  # сухой прогон (dry-run)
 *   npm run seed -- --force       # реальная запись в БД
 *   npm run seed -- --force --clear  # очистить коллекции перед записью
 *
 * Порядок сидирования (FK-зависимости):
 *   1. CounterpartyRole
 *   2. DocTypeDef
 *   3. ProductCategory
 *   4. Product
 *   5. Client
 */

import { connectDB, disconnectDB } from './config/db.js';
import { logger } from './utils/logger.js';
import { ProductCategory } from './modules/product-category.model.js';
import { Product } from './modules/product.model.js';
import { Client } from './modules/client.model.js';
import { DocTypeDef } from './modules/doc-type.model.js';
import { CounterpartyRole } from './modules/counterparty-role.model.js';
import { TableTemplate } from './modules/table-template.model.js';
import { DocumentTemplate } from './modules/document-template.model.js';
import { Organization } from './modules/organization.model.js';
import { Worker } from './modules/worker.model.js';
import { WorkCenter } from './modules/work-center.model.js';
import { User } from './modules/user.model.js';

const log = logger.child({ module: 'seed' });

// ── Флаги ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--force');
const CLEAR = args.includes('--clear');

// ═════════════════════════════════════════════════════════════════════════════
// Seed data (из frontend-моков и shared/types)
// ═════════════════════════════════════════════════════════════════════════════
// Типизируем через Record — Mongoose insertMany принимает Partial<T>, а не Omit<T, Document>

const SEED_COUNTERPARTY_ROLES: Record<string, unknown>[] = [
  { name: 'Поставщик', description: 'Поставщик товаров/услуг', slug: 'supplier', isActive: true },
  { name: 'Покупатель', description: 'Покупатель / заказчик', slug: 'buyer', isActive: true },
  { name: 'Подрядчик', description: 'Подрядная организация', slug: 'contractor', isActive: true },
  { name: 'Перевозчик', description: 'Транспортная компания', slug: 'carrier', isActive: true },
];

const SEED_DOC_TYPES: Record<string, unknown>[] = [
  { name: 'Коммерческое предложение', slug: 'quotation', description: 'Стандартное коммерческое предложение', isActive: true },
  { name: 'Договор', slug: 'contract', description: 'Договор поставки/оказания услуг', isActive: true },
  { name: 'Счёт', slug: 'invoice', description: 'Счёт на оплату', isActive: true },
  { name: 'Отгрузка', slug: 'shipping', description: 'Отгрузочные документы', isActive: true },
];

const SEED_PRODUCT_CATEGORIES: Record<string, unknown>[] = [
  { name: 'Спортивное оборудование', prefix: 'SP', description: 'Спортивное оборудование и тренажёры', sortOrder: 1, isActive: true },
  { name: 'Малые архитектурные формы', prefix: 'MF', description: 'МАФ: урны, скамейки, перголы, велопарковки', sortOrder: 2, isActive: true },
  { name: 'Ограждения', prefix: 'OG', description: 'Заборы, перила, ограждения', sortOrder: 3, isActive: true },
  { name: 'Освещение', prefix: 'OS', description: 'Осветительное оборудование', sortOrder: 4, isActive: true },
  { name: 'Мебель', prefix: 'MB', description: 'Уличная и офисная мебель', sortOrder: 5, isActive: true },
  { name: 'Спортивный инвентарь', prefix: 'NV', description: 'Мячи, сетки, аксессуары', sortOrder: 6, isActive: true },
  { name: 'Прочее', prefix: 'PR', description: 'Прочие товары и услуги', sortOrder: 7, isActive: true },
];

const SEED_PRODUCTS: Record<string, unknown>[] = [
  { sku: 'SP0001', name: 'Стойка баскетбольная БСФП-120', categoryId: '', productType: 'manufactured', description: 'Профессиональная баскетбольная стойка с кольцом и щитом', basePrice: 85000, defaultMarkupPercent: 25, unit: 'шт', weightKg: 120, dimensions: '3050×1800×120', material: 'Сталь Ст3, профильная труба 80×80', hasPassport: true, hasDrawing: true, isActive: true },
  { sku: 'SP0002', name: 'Турник уличный ТУ-2', categoryId: '', productType: 'manufactured', description: 'Двухсекционный турник для воркаут-площадок', basePrice: 32000, defaultMarkupPercent: 30, unit: 'шт', weightKg: 45, dimensions: '2500×1200×2200', material: 'Сталь Ст3, труба 48×3', hasPassport: true, hasDrawing: true, isActive: true },
  { sku: 'MF0001', name: 'Скамейка парковая СК-180', categoryId: '', productType: 'manufactured', description: 'Парковая скамейка со спинкой, деревянные рейки', basePrice: 12500, defaultMarkupPercent: 30, unit: 'шт', weightKg: 35, dimensions: '1800×600×800', material: 'Сталь + дерево (лиственница)', hasPassport: false, hasDrawing: true, isActive: true },
  { sku: 'MF0002', name: 'Урна уличная У-50', categoryId: '', productType: 'manufactured', description: 'Металлическая урна для мусора 50л', basePrice: 4500, defaultMarkupPercent: 35, unit: 'шт', weightKg: 8, dimensions: '300×300×600', material: 'Сталь, порошковая покраска', hasPassport: false, hasDrawing: true, isActive: true },
  { sku: 'MB0001', name: 'Комплект крепежа М10 (100 шт)', categoryId: '', productType: 'purchased', description: 'Болт М10 + гайка + шайба, оцинкованные', basePrice: 850, defaultMarkupPercent: 20, unit: 'комплект', weightKg: 2.5, material: 'Сталь оцинкованная', hasPassport: false, hasDrawing: false, isActive: true },
  { sku: 'OG0001', name: 'Забор спортивный ЗС-200 (секция 2м)', categoryId: '', productType: 'manufactured', description: 'Секция ограждения для спортплощадок 2000×1200мм', basePrice: 8500, defaultMarkupPercent: 25, unit: 'шт', weightKg: 25, dimensions: '2000×1200', material: 'Сталь Ст3, сетка сварная', hasPassport: false, hasDrawing: true, isActive: true },
  { sku: 'OG0002', name: 'Калитка К-1000', categoryId: '', productType: 'manufactured', description: 'Металлическая калитка 1000×1500мм', basePrice: 12000, defaultMarkupPercent: 25, unit: 'шт', weightKg: 30, dimensions: '1000×1500', material: 'Сталь профильная 40×20', hasPassport: false, hasDrawing: true, isActive: true },
  { sku: 'OS0001', name: 'Прожектор светодиодный 100Вт', categoryId: '', productType: 'purchased', description: 'Светодиодный прожектор для освещения спортплощадок', basePrice: 4500, defaultMarkupPercent: 20, unit: 'шт', weightKg: 3.2, dimensions: '300×200×150', material: 'Алюминий, стекло', hasPassport: true, hasDrawing: false, isActive: true },
  { sku: 'NV0001', name: 'Мяч баскетбольный Club 500', categoryId: '', productType: 'purchased', description: 'Баскетбольный мяч, размер 7, резина', basePrice: 1500, defaultMarkupPercent: 30, unit: 'шт', weightKg: 0.6, dimensions: 'D=240', material: 'Резина', hasPassport: false, hasDrawing: false, isActive: true },
  { sku: 'NV0002', name: 'Сетка волейбольная ВС-9', categoryId: '', productType: 'purchased', description: 'Волейбольная сетка 9×1м, профессиональная', basePrice: 3200, defaultMarkupPercent: 25, unit: 'шт', weightKg: 1.8, dimensions: '9000×1000', material: 'Полипропилен', hasPassport: false, hasDrawing: false, isActive: true },
];

const SEED_ORGANIZATIONS: Record<string, unknown>[] = [
  {
    name: 'Общество с ограниченной ответственностью «СпортСет»',
    shortName: 'ООО «СпортСет»',
    legalForm: 'ООО',
    inn: '2309123456',
    kpp: '230901001',
    ogrn: '1232301234567',
    phone: '+7 (861) 200-10-20',
    email: 'info@sport-set.ru',
    legalAddress: 'г. Краснодар, ул. Северная, д. 324, оф. 15',
    postalAddress: '350000, г. Краснодар, ул. Северная, д. 324, оф. 15',
    bankName: 'Юго-Западный банк ПАО Сбербанк',
    bankBik: '040349602',
    bankAccount: '4070281090000123456',
    signerName: 'Геннадьев Алексей Викторович',
    signerPosition: 'Генеральный директор',
    counterpartyRoleIds: [],
    contactPerson: 'Геннадьев А.В.',
    paymentTermDays: 30,
    isActive: true,
  },
  {
    name: 'Индивидуальный предприниматель Иванов Иван Иванович',
    shortName: 'ИП Иванов И.И.',
    legalForm: 'ИП',
    inn: '230812345678',
    kpp: '',
    ogrn: '323230800012345',
    phone: '+7 (918) 555-01-01',
    email: 'ivanov@example.ru',
    legalAddress: 'г. Краснодар, ул. Ленина, д. 10',
    postalAddress: 'г. Краснодар, ул. Ленина, д. 10',
    bankName: 'Краснодарское отделение ПАО Сбербанк',
    bankBik: '040349700',
    bankAccount: '4080281090000123456',
    signerName: 'Иванов Иван Иванович',
    signerPosition: 'ИП',
    counterpartyRoleIds: [],
    contactPerson: 'Иванов И.И.',
    paymentTermDays: 0,
    isActive: true,
  },
  {
    name: 'Общество с ограниченной ответственностью «МеталлПродукт»',
    shortName: 'ООО «МеталлПродукт»',
    legalForm: 'ООО',
    inn: '2315987654',
    kpp: '231501001',
    ogrn: '1242300123456',
    phone: '+7 (861) 255-30-40',
    email: 'sales@metalproduct.ru',
    legalAddress: 'г. Краснодар, ул. Индустриальная, д. 5',
    postalAddress: '350000, г. Краснодар, ул. Индустриальная, д. 5',
    bankName: 'Филиал «Южный» ПАО ВТБ',
    bankBik: '040349555',
    bankAccount: '4070281040000789012',
    signerName: 'Металлов Сергей Петрович',
    signerPosition: 'Генеральный директор',
    counterpartyRoleIds: [],
    contactPerson: 'Кузнецов Андрей Викторович',
    paymentTermDays: 45,
    isActive: true,
  },
  {
    name: 'Акционерное общество «ХимРеактив»',
    shortName: 'АО «ХимРеактив»',
    legalForm: 'АО',
    inn: '7715987654',
    kpp: '771501001',
    ogrn: '1187700123456',
    phone: '+7 (495) 777-88-99',
    email: 'info@chemreactive.ru',
    legalAddress: 'г. Москва, ул. Химиков, д. 15, стр. 2',
    postalAddress: '115000, г. Москва, ул. Химиков, д. 15, стр. 2',
    bankName: 'ПАО Сбербанк г. Москва',
    bankBik: '044525225',
    bankAccount: '4070281020000345678',
    signerName: 'Реактивов Дмитрий Николаевич',
    signerPosition: 'Генеральный директор',
    counterpartyRoleIds: [],
    contactPerson: 'Смирнова Елена Игоревна',
    paymentTermDays: 60,
    isActive: true,
  },
];

const SEED_WORKERS: Record<string, unknown>[] = [
  { lastName: 'Петров', firstName: 'Алексей', patronymic: 'Иванович', grade: 5, ratePerHour: 850, workTypeIds: [], isActive: true },
  { lastName: 'Смирнов', firstName: 'Дмитрий', patronymic: 'Сергеевич', grade: 4, ratePerHour: 720, workTypeIds: [], isActive: true },
  { lastName: 'Козлов', firstName: 'Иван', patronymic: 'Петрович', grade: 6, ratePerHour: 950, workTypeIds: [], isActive: true },
  { lastName: 'Зайцев', firstName: 'Андрей', patronymic: 'Викторович', grade: 3, ratePerHour: 580, workTypeIds: [], isActive: true },
  { lastName: 'Соколов', firstName: 'Максим', patronymic: 'Олегович', grade: 4, ratePerHour: 700, workTypeIds: [], isActive: true },
  { lastName: 'Попов', firstName: 'Владимир', patronymic: 'Николаевич', grade: 5, ratePerHour: 850, workTypeIds: [], isActive: true },
];

const SEED_WORK_CENTERS: Record<string, unknown>[] = [
  { name: 'Лазерный станок ЧПУ', type: 'laser_cutter', description: 'Лазерная резка листового металла до 12мм', isActive: true },
  { name: 'Сварочный пост №1', type: 'welding_semiauto', description: 'Полуавтоматическая сварка MIG/MAG', isActive: true },
  { name: 'Сварочный пост №2', type: 'welding_manual', description: 'Ручная дуговая сварка MMA', isActive: true },
  { name: 'Порошковая покраска', type: 'powder_coating', description: 'Камера порошковой покраски с полимеризацией', isActive: true },
  { name: 'Слесарный участок', type: 'assembly', description: 'Сборка, гибка, сверловка', isActive: true },
  { name: 'Участок подготовки', type: 'preparation', description: 'Зачистка, обезжиривание, грунтовка', isActive: true },
];

const SEED_CLIENTS: Record<string, unknown>[] = [
  { lastName: 'Иванов', firstName: 'Иван', patronymic: 'Иванович', phone: '+7 (918) 555-01-01', email: 'ivanov@example.ru', address: 'г. Краснодар, ул. Ленина, д. 10', isActive: true },
  { lastName: 'Петров', firstName: 'Пётр', patronymic: 'Сергеевич', phone: '+7 (918) 555-02-02', email: 'petrov@example.ru', inn: '123456789012', address: 'г. Краснодар, ул. Красная, д. 50', isActive: true },
  { lastName: 'Сидорова', firstName: 'Анна', patronymic: 'Викторовна', phone: '+7 (918) 555-03-03', email: 'sidorova@example.ru', personalMarkupPercent: 5, notes: 'Постоянный клиент, скидка 5%', isActive: true },
  { lastName: 'Кузнецов', firstName: 'Андрей', patronymic: 'Викторович', phone: '+7 (961) 555-04-04', inn: '987654321098', notes: 'Контактное лицо — ООО «МеталлПродукт»', isActive: true },
  { lastName: 'Смирнова', firstName: 'Елена', patronymic: 'Игоревна', phone: '+7 (495) 777-88-99', email: 'info@chemreactive.ru', notes: 'Контактное лицо — АО «ХимРеактив»', isActive: true },
];

// ── TableTemplate (шаблоны таблиц для документов) ────────────────────────────
const SEED_TABLE_TEMPLATES: Record<string, unknown>[] = [
  {
    name: 'Спецификация товаров',
    columns: [
      { tableName: 'products', fieldName: 'sku', label: 'Артикул', width: '100px', order: 0 },
      { tableName: 'products', fieldName: 'name', label: 'Наименование', width: '', order: 1 },
      { tableName: 'products', fieldName: 'unit', label: 'Ед. изм.', width: '80px', order: 2 },
      { tableName: 'products', fieldName: 'basePrice', label: 'Цена, ₽', width: '100px', order: 3 },
      { tableName: 'products', fieldName: 'weightKg', label: 'Вес, кг', width: '80px', order: 4 },
      { tableName: 'products', fieldName: 'dimensions', label: 'Габариты', width: '120px', order: 5 },
    ],
  },
  {
    name: 'Основные характеристики',
    columns: [
      { tableName: 'products', fieldName: 'name', label: 'Наименование', width: '', order: 0 },
      { tableName: 'products', fieldName: 'sku', label: 'Артикул', width: '100px', order: 1 },
      { tableName: 'products', fieldName: 'material', label: 'Материал', width: '', order: 2 },
      { tableName: 'products', fieldName: 'dimensions', label: 'Габариты', width: '120px', order: 3 },
      { tableName: 'products', fieldName: 'weightKg', label: 'Вес, кг', width: '80px', order: 4 },
    ],
  },
];

// Хранилище ID для FK-резолвинга
const createdTableTemplateIds: string[] = [];
const createdOrganizationIds: string[] = [];
const createdCounterpartyRoleIds: string[] = [];

// ── DocumentTemplate (шаблоны документов) ────────────────────────────────────
const SEED_DOCUMENT_TEMPLATES_BASE: Record<string, unknown>[] = [
  {
    name: 'Коммерческое предложение',
    description: 'Стандартный шаблон КП с таблицей товаров и условиями поставки',
    docType: 'quotation',
    pageSize: 'A4',
    isDefault: true,
    blocks: [
      {
        id: 'b-hdr',
        type: 'text',
        order: 0,
        title: 'Заголовок',
        content: 'Коммерческое предложение №{{number}} от {{date}}',
        settings: { fontSize: '18px', align: 'center' },
      },
      {
        id: 'b-client',
        type: 'text',
        order: 1,
        title: 'Клиент',
        content: '',
        columns: [
          { id: 'c1', content: 'Клиент:', width: '30%', fontWeight: 'bold' },
          { id: 'c2', content: '{{client.name}}' },
          { id: 'c3', content: 'ИНН:', width: '15%', fontWeight: 'bold' },
          { id: 'c4', content: '{{client.inn}}' },
        ],
      },
      {
        id: 'b-org',
        type: 'text',
        order: 2,
        title: 'Поставщик',
        columns: [
          { id: 'c5', content: 'Поставщик:', width: '30%', fontWeight: 'bold' },
          { id: 'c6', content: '{{our_company.name}}' },
          { id: 'c7', content: 'ИНН:', width: '15%', fontWeight: 'bold' },
          { id: 'c8', content: '{{our_company.inn}}' },
        ],
      },
      {
        id: 'b-table',
        type: 'table',
        order: 3,
        title: 'Спецификация товаров',
        tableTemplateId: '', // будет заполнено после создания table-template
      },
      {
        id: 'b-sep',
        type: 'separator',
        order: 4,
        height: 20,
        showLine: false,
      },
      {
        id: 'b-terms',
        type: 'text',
        order: 5,
        title: 'Условия поставки',
        content: 'Срок поставки: {{delivery_days}} рабочих дней.\nГарантия: 12 месяцев.\nУсловия оплаты: {{payment_terms}}.',
      },
      {
        id: 'b-footer',
        type: 'text',
        order: 6,
        title: 'Подписи',
        columns: [
          { id: 'c9', content: '_________________ /{{our_company.signerName}}/', width: '50%', textAlign: 'center' },
          { id: 'c10', content: '_________________ /{{client.signerName}}/', width: '50%', textAlign: 'center' },
        ],
      },
    ],
  },
  {
    name: 'Договор поставки',
    description: 'Типовой договор поставки товаров',
    docType: 'contract',
    pageSize: 'A4',
    blocks: [
      {
        id: 'b-ct-hdr',
        type: 'text',
        order: 0,
        title: 'Заголовок',
        content: 'ДОГОВОР ПОСТАВКИ №{{number}}',
        settings: { fontSize: '16px', align: 'center' },
      },
      {
        id: 'b-ct-place',
        type: 'text',
        order: 1,
        content: 'г. {{city}}, {{date}}',
      },
      {
        id: 'b-ct-parties',
        type: 'text',
        order: 2,
        title: 'Стороны',
        columns: [
          { id: 'c11', content: '{{our_company.name}}', width: '50%', fontWeight: 'bold' },
          { id: 'c12', content: '{{client.name}}', width: '50%', fontWeight: 'bold' },
        ],
      },
      {
        id: 'b-ct-sep',
        type: 'separator',
        order: 3,
        height: 10,
        showLine: true,
      },
      {
        id: 'b-ct-subject',
        type: 'text',
        order: 4,
        title: '1. Предмет договора',
        content: 'Поставщик обязуется передать в собственность Покупателя товары согласно спецификации (Приложение №1), а Покупатель обязуется принять и оплатить товары на условиях настоящего договора.',
      },
      {
        id: 'b-ct-price',
        type: 'text',
        order: 5,
        title: '2. Цена и порядок расчётов',
        content: '2.1. Цена товаров указана в Спецификации.\n2.2. Оплата производится в течение {{payment_days}} банковских дней с даты выставления счёта.\n2.3. Цена включает НДС.',
      },
      {
        id: 'b-ct-delivery',
        type: 'text',
        order: 6,
        title: '3. Сроки поставки',
        content: '3.1. Срок поставки: {{delivery_days}} рабочих дней с даты подписания договора.\n3.2. Досрочная поставка допускается.',
      },
      {
        id: 'b-ct-sign',
        type: 'text',
        order: 7,
        title: '10. Подписи сторон',
        columns: [
          { id: 'c13', content: 'Поставщик:\n{{our_company.name}}\n{{our_company.signerName}}\n_________________', width: '50%', textAlign: 'center' },
          { id: 'c14', content: 'Покупатель:\n{{client.name}}\n{{client.signerName}}\n_________________', width: '50%', textAlign: 'center' },
        ],
      },
    ],
  },
];

// ── Карта: префикс → _id категории (заполняется после сидирования категорий)
const prefixToCatId = new Map<string, string>();

// ═════════════════════════════════════════════════════════════════════════════
// Helpers
// ═════════════════════════════════════════════════════════════════════════════

/** Вспомогательный тип для любой Mongoose-модели */
interface AnyModel {
  insertMany(data: Record<string, unknown>[]): Promise<unknown>;
  deleteMany(filter: Record<string, unknown>): Promise<unknown>;
  countDocuments(): Promise<number>;
}

async function seedCollection(
  model: AnyModel,
  name: string,
  data: Record<string, unknown>[],
): Promise<number> {
  if (data.length === 0) return 0;

  if (CLEAR) {
    if (DRY_RUN) {
      log.info(`  [DRY-RUN] Очистка ${name}...`);
    } else {
      await model.deleteMany({});
      log.info(`  Очищено: ${name}`);
    }
  }

  if (DRY_RUN) {
    log.info(`  [DRY-RUN] Будет добавлено: ${name} × ${data.length}`);
    return data.length;
  }

  // Проверяем, есть ли уже записи (повторный запуск без --clear)
  const existing = await model.countDocuments();
  if (existing > 0) {
    log.info(`  Пропущено (уже есть): ${name} × ${existing}`);
    return existing;
  }

  await model.insertMany(data);
  const count = await model.countDocuments();
  log.info(`  Добавлено: ${name} × ${data.length} (всего: ${count})`);
  return data.length;
}

/** Найти _id категории по префиксу (из кеша или БД) */
async function resolveCategoryId(prefix: string): Promise<string> {
  const cached = prefixToCatId.get(prefix);
  if (cached) return cached;
  const cat = await ProductCategory.findOne({ prefix });
  return cat?._id.toString() ?? '';
}

// ═════════════════════════════════════════════════════════════════════════════
// Main
// ═════════════════════════════════════════════════════════════════════════════

async function main() {
  log.info(`Режим: ${DRY_RUN ? '🔍 СУХОЙ ПРОГОН (--force для записи)' : '💾 РЕАЛЬНАЯ ЗАПИСЬ'}`);
  if (CLEAR) log.info('Очистка коллекций включена (--clear)');
  log.info('');

  await connectDB();

  let total = 0;

  // 1. CounterpartyRole (сохраняем _id для FK в организациях)
  log.info('── Роли контрагентов ──');
  if (!DRY_RUN) {
    if (CLEAR) {
      await CounterpartyRole.deleteMany({});
      log.info('  Очищено: CounterpartyRole');
    }
    const existingRoleCount = await CounterpartyRole.countDocuments();
    if (existingRoleCount > 0) {
      const existing = await CounterpartyRole.find({}).lean();
      for (const r of existing) {
        const doc = r as unknown as { _id: { toString(): string }; slug: string };
        createdCounterpartyRoleIds.push(doc._id.toString());
      }
      log.info(`  Найдено существующих: CounterpartyRole × ${existingRoleCount}`);
      total += existingRoleCount;
    } else {
      const roles = (await CounterpartyRole.insertMany(SEED_COUNTERPARTY_ROLES)) as unknown as { _id: { toString(): string } }[];
      for (const r of roles) {
        createdCounterpartyRoleIds.push(r._id.toString());
      }
      log.info(`  Добавлено: CounterpartyRole × ${roles.length}`);
      total += roles.length;
    }
  } else {
    log.info(`  [DRY-RUN] Будет добавлено: CounterpartyRole × ${SEED_COUNTERPARTY_ROLES.length}`);
    total += SEED_COUNTERPARTY_ROLES.length;
  }

  // 2. DocTypeDef
  log.info('── Типы документов ──');
  total += await seedCollection(DocTypeDef, 'DocTypeDef', SEED_DOC_TYPES);

  // 3. ProductCategory (сохраняем _id для FK)
  log.info('── Категории товаров ──');
  if (!DRY_RUN) {
    if (CLEAR) {
      await ProductCategory.deleteMany({});
      log.info('  Очищено: ProductCategory');
    }
    // Проверяем, есть ли уже категории (повторный запуск без --clear)
    const existingCatCount = await ProductCategory.countDocuments();
    if (existingCatCount > 0) {
      const existing = await ProductCategory.find({}).lean();
      for (const cat of existing) {
        const doc = cat as unknown as { _id: { toString(): string }; prefix: string };
        prefixToCatId.set(doc.prefix, doc._id.toString());
      }
      log.info(`  Найдено существующих: ProductCategory × ${existingCatCount}`);
      total += existingCatCount;
    } else {
      const cats = (await ProductCategory.insertMany(SEED_PRODUCT_CATEGORIES)) as unknown as { _id: { toString(): string }; prefix: string }[];
      for (const cat of cats) {
        prefixToCatId.set(cat.prefix, cat._id.toString());
      }
      log.info(`  Добавлено: ProductCategory × ${cats.length}`);
      total += cats.length;
    }
  } else {
    log.info(`  [DRY-RUN] Будет добавлено: ProductCategory × ${SEED_PRODUCT_CATEGORIES.length}`);
    total += SEED_PRODUCT_CATEGORIES.length;
  }

  // 4. Product (подставляем categoryId из созданных категорий по префиксу SKU)
  log.info('── Товары ──');
  if (!DRY_RUN) {
    if (CLEAR) {
      await Product.deleteMany({});
      log.info('  Очищено: Product');
    }
    // Разрешаем categoryId через отдельный цикл (не async .map())
    const productsWithCats: Record<string, unknown>[] = [];
    for (const p of SEED_PRODUCTS) {
      const prefix = String(p.sku).slice(0, 2);
      const categoryId = await resolveCategoryId(prefix);
      productsWithCats.push({ ...p, categoryId });
    }
    await Product.insertMany(productsWithCats);
    const count = await Product.countDocuments();
    log.info(`  Добавлено: Product × ${productsWithCats.length} (всего: ${count})`);
    total += productsWithCats.length;
  } else {
    log.info(`  [DRY-RUN] Будет добавлено: Product × ${SEED_PRODUCTS.length}`);
    total += SEED_PRODUCTS.length;
  }

  // 5. Organization (контрагенты/юрлица)
  log.info('── Организации ──');
  if (!DRY_RUN) {
    if (CLEAR) {
      await Organization.deleteMany({});
      log.info('  Очищено: Organization');
    }
    const existingOrgCount = await Organization.countDocuments();
    if (existingOrgCount > 0) {
      log.info(`  Пропущено (уже есть): Organization × ${existingOrgCount}`);
      total += existingOrgCount;
      const existing = await Organization.find({}).lean();
      for (const o of existing) {
        const doc = o as unknown as { _id: { toString(): string } };
        createdOrganizationIds.push(doc._id.toString());
      }
    } else {
      // Подставляем ID ролей контрагентов
      const supplierRoleId = createdCounterpartyRoleIds[0] ?? '';
      const buyerRoleId = createdCounterpartyRoleIds[1] ?? '';
      const orgs = SEED_ORGANIZATIONS.map((o, i) => ({
        ...o,
        // Наша компания = supplier + buyer; ИП Иванов = buyer; МеталлПродукт = supplier; ХимРеактив = supplier
        counterpartyRoleIds: i === 0 ? [supplierRoleId, buyerRoleId]
          : i === 1 ? [buyerRoleId]
          : [supplierRoleId],
      }));
      const created = (await Organization.insertMany(orgs)) as unknown as { _id: { toString(): string } }[];
      for (const o of created) {
        createdOrganizationIds.push(o._id.toString());
      }
      log.info(`  Добавлено: Organization × ${created.length} (всего: ${created.length})`);
      total += created.length;
    }
  } else {
    log.info(`  [DRY-RUN] Будет добавлено: Organization × ${SEED_ORGANIZATIONS.length}`);
    total += SEED_ORGANIZATIONS.length;
  }

  // 6. WorkCenter (рабочие центры)
  log.info('── Рабочие центры ──');
  total += await seedCollection(WorkCenter, 'WorkCenter', SEED_WORK_CENTERS);

  // 7. Worker (работники)
  log.info('── Работники ──');
  total += await seedCollection(Worker, 'Worker', SEED_WORKERS);

  // 8. Client (FK-ссылки на организации — подставляем реальные ID)
  log.info('── Клиенты ──');
  if (!DRY_RUN) {
    if (CLEAR) {
      await Client.deleteMany({});
      log.info('  Очищено: Client');
    }
    const existingClientCount = await Client.countDocuments();
    if (existingClientCount > 0) {
      log.info(`  Пропущено (уже есть): Client × ${existingClientCount}`);
      total += existingClientCount;
    } else {
      // Подставляем реальные ID организаций: ИП Иванов = orgs[1], МеталлПродукт = orgs[2], ХимРеактив = orgs[3]
      const clientsWithOrg = SEED_CLIENTS.map((c, i) => ({
        ...c,
        // Пётр Петров → ссылка на ИП Иванов; Андрей Кузнецов → МеталлПродукт; Елена Смирнова → ХимРеактив
        organizationId: i === 1 ? createdOrganizationIds[1] ?? ''
          : i === 3 ? createdOrganizationIds[2] ?? ''
          : i === 4 ? createdOrganizationIds[3] ?? ''
          : undefined,
      }));
      await Client.insertMany(clientsWithOrg);
      const count = await Client.countDocuments();
      log.info(`  Добавлено: Client × ${clientsWithOrg.length} (всего: ${count})`);
      total += clientsWithOrg.length;
    }
  } else {
    log.info(`  [DRY-RUN] Будет добавлено: Client × ${SEED_CLIENTS.length}`);
    total += SEED_CLIENTS.length;
  }

  // 9. TableTemplate (шаблоны таблиц для документов)
  log.info('── Шаблоны таблиц ──');
  if (!DRY_RUN) {
    if (CLEAR) {
      await TableTemplate.deleteMany({});
      log.info('  Очищено: TableTemplate');
    }
    const existingTableTmplCount = await TableTemplate.countDocuments();
    if (existingTableTmplCount > 0) {
      log.info(`  Пропущено (уже есть): TableTemplate × ${existingTableTmplCount}`);
      total += existingTableTmplCount;
      // Загружаем существующие ID для FK
      const existing = await TableTemplate.find({}).lean();
      for (const t of existing) {
        const doc = t as unknown as { _id: { toString(): string } };
        createdTableTemplateIds.push(doc._id.toString());
      }
    } else {
      const created = (await TableTemplate.insertMany(SEED_TABLE_TEMPLATES)) as unknown as { _id: { toString(): string } }[];
      for (const t of created) {
        createdTableTemplateIds.push(t._id.toString());
      }
      log.info(`  Добавлено: TableTemplate × ${created.length} (всего: ${created.length})`);
      total += created.length;
    }
  } else {
    log.info(`  [DRY-RUN] Будет добавлено: TableTemplate × ${SEED_TABLE_TEMPLATES.length}`);
    total += SEED_TABLE_TEMPLATES.length;
  }

  // 10. DocumentTemplate (шаблоны документов) — с подстановкой tableTemplateId из созданных
  log.info('── Шаблоны документов ──');
  if (!DRY_RUN) {
    if (CLEAR) {
      await DocumentTemplate.deleteMany({});
      log.info('  Очищено: DocumentTemplate');
    }
    const existingDocTmplCount = await DocumentTemplate.countDocuments();
    if (existingDocTmplCount > 0) {
      log.info(`  Пропущено (уже есть): DocumentTemplate × ${existingDocTmplCount}`);
      total += existingDocTmplCount;
    } else {
      // Подставляем ID первого table-template в table блоки
      const firstTableTmplId = createdTableTemplateIds[0] ?? '';
      const docTemplates = SEED_DOCUMENT_TEMPLATES_BASE.map(tmpl => {
        const blocks = (tmpl.blocks as Record<string, unknown>[]).map(b => {
          if (b.type === 'table' && !b.tableTemplateId) {
            return { ...b, tableTemplateId: firstTableTmplId };
          }
          return b;
        });
        return { ...tmpl, blocks };
      });

      await DocumentTemplate.insertMany(docTemplates);
      const count = await DocumentTemplate.countDocuments();
      log.info(`  Добавлено: DocumentTemplate × ${docTemplates.length} (всего: ${count})`);
      total += docTemplates.length;
    }
  } else {
    log.info(`  [DRY-RUN] Будет добавлено: DocumentTemplate × ${SEED_DOCUMENT_TEMPLATES_BASE.length}`);
    total += SEED_DOCUMENT_TEMPLATES_BASE.length;
  }

  // 11. Admin user (если нет пользователей)
  log.info('── Пользователи ──');
  if (!DRY_RUN) {
    const existingUserCount = await User.countDocuments();
    if (existingUserCount > 0) {
      log.info(`  Пропущено (уже есть): User × ${existingUserCount}`);
      total += existingUserCount;
    } else {
      await User.create({
        username: 'admin',
        password: 'admin123',
        displayName: 'Администратор',
        email: 'admin@kppdf-4.local',
        role: 'admin',
        permissions: ['*'],
        isActive: true,
      });
      log.info('  Добавлен: User × 1 (admin / admin123)');
      total += 1;
    }
  } else {
    log.info('  [DRY-RUN] Будет добавлен: User × 1 (admin / admin123)');
    total += 1;
  }

  // ── Итог ────────────────────────────────────────────────────────────────
  log.info('');
  log.info('═'.repeat(50));
  if (DRY_RUN) {
    log.info(`  🔍 Сухой прогон: будет добавлено ${total} записей`);
    log.info('  Запусти с --force для реальной записи в БД');
  } else {
    log.info(`  ✅ Сидирование завершено: ${total} записей`);
  }
  log.info('═'.repeat(50));

  await disconnectDB();
}

main().catch(async (err: Error) => {
  log.error(err, 'Ошибка сидирования');
  await disconnectDB().catch(() => {});
  process.exit(1);
});
