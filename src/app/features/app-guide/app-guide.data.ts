// ─── Interfaces ────────────────────────────────────────────────────────────

export interface GuideItem {
  label: string;
  description: string;
  icon: string;
  routerLink?: string;
  status: 'done' | 'wip' | 'planned';
}

export interface GuideModule {
  title: string;
  description: string;
  items: GuideItem[];
}

export interface GuidePhase {
  title: string;
  subtitle: string;
  status: 'done' | 'wip' | 'planned';
  gradient: string;
  modules: GuideModule[];
}

export interface DependancyModule {
  icon: string;
  name: string;
  dependsOn: string[];
  enables: string;
  status: 'done' | 'wip' | 'planned';
}

export interface DependancyLevel {
  level: number;
  title: string;
  subtitle: string;
  gradient: string;
  modules: DependancyModule[];
}

// ─── Фазы приложения ─────────────────────────────────────────────────────────

export const APP_PHASES: GuidePhase[] = [
  {
    title: 'ЯДРО',
    subtitle: 'Конструктор документов · UI Kit · Справочники · Инфраструктура',
    status: 'done',
    gradient: 'linear-gradient(135deg, #059669, #10b981)',
    modules: [
      {
        title: '📄 Конструктор документов',
        description: 'Гибкие шаблоны для любых документов — КП, договоры, накладные',
        items: [
          { label: 'Шаблоны таблиц', description: 'Настройка колонок из справочников', icon: '📊', routerLink: '/admin/table-templates', status: 'done' },
          { label: 'Шаблоны документов', description: 'A4-холст с блоками: текст, таблица, разделитель', icon: '📄', routerLink: '/admin/document-templates', status: 'done' },
          { label: 'Плейсхолдеры {{...}}', description: '22 заготовки для подстановки данных', icon: '📝', status: 'done' },
          { label: 'PDF-экспорт', description: 'Скачивание документов в PDF', icon: '⬇️', status: 'done' },
        ],
      },
      {
        title: '📚 Справочники',
        description: 'Базовые справочники системы',
        items: [
          { label: 'Контрагенты', description: 'Юр.лица и ИП с реквизитами', icon: '🏢', routerLink: '/references/organizations', status: 'done' },
          { label: 'Виды контрагентов', description: 'Роли: поставщик, покупатель, подрядчик', icon: '🏷️', routerLink: '/references/counterparty-roles', status: 'done' },
          { label: 'Типы документов', description: 'КП, Договор, Счёт, Отгрузка + свои', icon: '📋', routerLink: '/references/doc-types', status: 'done' },
        ],
      },
      {
        title: '🎨 UI Kit',
        description: 'Дизайн-система: 22 компонента, 2 темы',
        items: [
          { label: 'Базовые компоненты', description: '16 шт: кнопки, поля, таблицы, диалоги', icon: '🎨', routerLink: '/ui-kit', status: 'done' },
          { label: 'Документные блоки', description: '6 шт: холст, текст, таблица, разделитель', icon: '📦', status: 'done' },
          { label: 'Тёмная тема', description: '47 CSS-переменных, 2 полные темы', icon: '🌙', status: 'done' },
        ],
      },
    ],
  },
  {
    title: 'ПРОДАЖИ (CRM-ядро)',
    subtitle: 'Товары → Клиенты → Корзина → КП → Договоры',
    status: 'wip',
    gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    modules: [
      {
        title: '🏪 Товары',
        description: 'Справочник товаров и услуг',
        items: [
          { label: 'Категории товаров', description: 'SP, MF, OG, OS, MB, NV, PR + свои', icon: '🏷️', routerLink: '/references/product-categories', status: 'done' },
          { label: 'Товары и услуги', description: 'Полный справочник с артикулами и ценами', icon: '📦', routerLink: '/sales/products', status: 'done' },
          { label: 'Авто-артикулы (SKU)', description: 'Префикс категории + 4 цифры', icon: '🔤', status: 'done' },
          { label: 'Компоненты товаров', description: 'Для изготавливаемых: состав, материалы, работы', icon: '🧩', status: 'planned' },
          { label: 'Фотографии товаров', description: 'Галерея изображений', icon: '🖼️', status: 'planned' },
        ],
      },
      {
        title: '👤 Клиенты',
        description: 'Физ.лица — контактные лица организаций',
        items: [
          { label: 'Справочник клиентов', description: 'ФИО, телефон, email, ИНН', icon: '👤', routerLink: '/references/clients', status: 'done' },
          { label: 'Персональная наценка', description: 'Индивидуальный % для каждого клиента', icon: '💯', status: 'planned' },
        ],
      },
      {
        title: '📋 КП и Заказы',
        description: 'Формирование и отслеживание заказов',
        items: [
          { label: 'Оформление КП', description: 'Витрина товаров + A4-документ для быстрого создания КП', icon: '📋', routerLink: '/sales/cart', status: 'done' },
          { label: 'Коммерческие предложения', description: 'КП со статусами + snapshot товаров', icon: '📋', routerLink: '/sales/proposals', status: 'done' },
          { label: '3 варианта КП', description: 'Для разных юрлиц группы на 1 запрос', icon: '📑', status: 'planned' },
          { label: 'Договоры', description: 'На основе КП с выбором шаблона', icon: '✍️', routerLink: '/sales/contracts', status: 'done' },
        ],
      },
    ],
  },
  {
    title: 'ПРОИЗВОДСТВО',
    subtitle: 'Виды работ → Заказы → Гант → Отгрузка',
    status: 'wip',
    gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
    modules: [
      {
        title: '🔧 Справочники производства',
        description: 'Настройка производственных процессов',
        items: [
          { label: 'Виды работ', description: 'Резка, сварка, покраска, сборка...', icon: '🔧', routerLink: '/production/work-types', status: 'done' },
          { label: 'Рабочие центры', description: 'Станки и рабочие места', icon: '🖥️', routerLink: '/production/work-centers', status: 'done' },
          { label: 'Работники', description: 'ФИО, разряд, привязка к видам работ', icon: '👥', routerLink: '/production/workers', status: 'done' },
        ],
      },
      {
        title: '📋 Управление заказами',
        description: 'От поступления до отгрузки',
        items: [
          { label: 'Производственные заказы', description: 'Заказы со статусами + таблица + детали', icon: '📋', routerLink: '/production/orders', status: 'done' },
          { label: 'Задачи по заказу', description: 'Распределение по исполнителям + статусы', icon: '✅', routerLink: '/production/tasks', status: 'done' },
          { label: 'Диаграмма Ганта', description: 'Группировка по работам, drag/resize, часы', icon: '📊', routerLink: '/production/gantt', status: 'done' },
          { label: 'Авто-задачи', description: 'Недостающие данные → задача конкретному отделу', icon: '🔔', status: 'wip' },
        ],
      },
      {
        title: '📦 Отгрузка',
        description: 'Завершение заказа',
        items: [
          { label: 'Готов к отгрузке', description: 'Статус + диалог отгрузки с шаблоном', icon: '🚚', status: 'wip' },
          { label: 'Отгрузочные документы', description: 'Из шаблонов документов', icon: '📄', status: 'planned' },
        ],
      },
    ],
  },
  {
    title: 'СКЛАД И ЗАКУПКИ',
    subtitle: 'Склады → Остатки → Заявки → Поставщики',
    status: 'planned',
    gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
    modules: [
      {
        title: '🏗️ Склад',
        description: 'Учёт материалов и товаров',
        items: [
          { label: 'Склады', description: 'Места хранения', icon: '🏭', status: 'planned' },
          { label: 'Остатки', description: 'Количество материалов на складах', icon: '📦', status: 'planned' },
          { label: 'Движения', description: 'Приход, расход, перемещение', icon: '↔️', status: 'planned' },
        ],
      },
      {
        title: '📋 Закупки',
        description: 'Снабжение производства',
        items: [
          { label: 'Заявки на закупку', description: 'Потребность в материалах', icon: '📋', status: 'planned' },
          { label: 'Заказы поставщикам', description: 'ПРОММЕТИЗ и другие', icon: '🚚', status: 'planned' },
          { label: 'Входящие счета', description: 'Учёт счетов от поставщиков', icon: '🧾', status: 'planned' },
        ],
      },
    ],
  },
  {
    title: 'БУХГАЛТЕРИЯ',
    subtitle: 'Закрытие заказов → Акты → Отчёты',
    status: 'planned',
    gradient: 'linear-gradient(135deg, #be185d, #db2777)',
    modules: [
      {
        title: '💰 Финансы',
        description: 'Финансовое закрытие и отчётность',
        items: [
          { label: 'Закрытие заказов', description: 'Акты, счета-фактуры', icon: '✅', status: 'planned' },
          { label: 'Акты сверки', description: 'Ежегодные сверки с контрагентами', icon: '📊', status: 'planned' },
          { label: 'Отчёты', description: 'Финансовая аналитика', icon: '📈', status: 'planned' },

        ],
      },
    ],
  },
];

// ─── Уровни последовательности заполнения ─────────────────────────────────────

export const DEPENDANCY_LEVELS: DependancyLevel[] = [
  {
    level: 0,
    title: '🏁 Базовые справочники',
    subtitle: 'Не зависят ни от чего — можно заполнять сразу, в любом порядке',
    gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)',
    modules: [
      { icon: '🏷️', name: 'Виды контрагентов', dependsOn: [], enables: 'Метки для контрагентов', status: 'done' },
      { icon: '📋', name: 'Типы документов', dependsOn: [], enables: 'Типизацию шаблонов', status: 'done' },
      { icon: '🏷️', name: 'Категории товаров', dependsOn: [], enables: 'Префиксы для артикулов', status: 'done' },
      { icon: '🎨', name: 'UI Kit (компоненты)', dependsOn: [], enables: 'Интерфейс для всех страниц', status: 'done' },
    ],
  },
  {
    level: 1,
    title: '📐 Конструктор и основные справочники',
    subtitle: 'Зависят только от уровня 0 — строятся на базе справочников',
    gradient: 'linear-gradient(135deg, #059669, #10b981)',
    modules: [
      { icon: '📊', name: 'Шаблоны таблиц', dependsOn: [], enables: 'Структуру колонок для документов', status: 'done' },
      { icon: '📄', name: 'Шаблоны документов', dependsOn: ['Типы документов'], enables: 'A4-холст для КП, договоров', status: 'done' },
      { icon: '🏢', name: 'Контрагенты (юр.лица)', dependsOn: ['Виды контрагентов'], enables: 'Реквизиты для КП и договоров', status: 'done' },
      { icon: '📦', name: 'Товары и услуги', dependsOn: ['Категории товаров'], enables: 'Номенклатуру с артикулами и ценами', status: 'done' },
    ],
  },
  {
    level: 2,
    title: '👤 Клиенты и подготовка к продажам',
    subtitle: 'Зависят от уровня 1 — можно начинать после товаров и контрагентов',
    gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    modules: [
      { icon: '👤', name: 'Клиенты (физ.лица)', dependsOn: [], enables: 'Привязку контактных лиц к организациям', status: 'done' },
      { icon: '🧩', name: 'Компоненты товаров', dependsOn: ['Товары и услуги'], enables: 'Состав изготавливаемых товаров', status: 'planned' },
      { icon: '💯', name: 'Персональная наценка', dependsOn: ['Клиенты (физ.лица)'], enables: 'Индивидуальные цены для клиентов', status: 'planned' },
    ],
  },
  {
    level: 3,
    title: '🛒 Транзакции: Корзина → КП → Договоры',
    subtitle: 'Операционная деятельность — нужны товары, клиенты и шаблоны документов',
    gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    modules: [
      { icon: '📋', name: 'Оформление КП', dependsOn: ['Товары и услуги', 'Шаблоны документов'], enables: 'Витрина товаров + быстрый выбор в документ', status: 'done' },
      { icon: '📋', name: 'Коммерческие предложения', dependsOn: ['Оформление КП', 'Шаблоны документов'], enables: 'Документ со snapshot товаров', status: 'done' },
      { icon: '✍️', name: 'Договоры', dependsOn: ['Коммерческие предложения'], enables: 'Юридическое оформление сделки', status: 'done' },
    ],
  },
  {
    level: 4,
    title: '🏭 Производство',
    subtitle: 'Нужны договоры + собственные справочники',
    gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
    modules: [
      { icon: '🔧', name: 'Виды работ', dependsOn: [], enables: 'Техпроцессы (резка, сварка...)', status: 'done' },
      { icon: '🖥️', name: 'Рабочие центры', dependsOn: [], enables: 'Привязку станков к работам', status: 'done' },
      { icon: '👥', name: 'Работники', dependsOn: ['Виды работ'], enables: 'Исполнителей для задач', status: 'done' },
      { icon: '📋', name: 'Производственные заказы', dependsOn: ['Договоры', 'Рабочие центры'], enables: 'План производства', status: 'done' },
      { icon: '✅', name: 'Задачи по заказу', dependsOn: ['Производственные заказы', 'Работники'], enables: 'Распределение по исполнителям', status: 'done' },
      { icon: '📊', name: 'Диаграмма Ганта', dependsOn: ['Задачи по заказу'], enables: 'Визуальный контроль сроков', status: 'done' },
      { icon: '🚚', name: 'Отгрузка', dependsOn: ['Производственные заказы'], enables: 'Готовые документы для отгрузки', status: 'wip' },
    ],
  },
  {
    level: 5,
    title: '📦 Склад и Закупки',
    subtitle: 'Может идти параллельно с производством',
    gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
    modules: [
      { icon: '🏭', name: 'Склады', dependsOn: [], enables: 'Места хранения материалов', status: 'planned' },
      { icon: '📦', name: 'Остатки на складе', dependsOn: ['Склады', 'Товары и услуги'], enables: 'Учёт материалов', status: 'planned' },
      { icon: '↔️', name: 'Движения товаров', dependsOn: ['Остатки на складе'], enables: 'Приход, расход, перемещение', status: 'planned' },
      { icon: '📋', name: 'Заявки на закупку', dependsOn: ['Остатки на складе'], enables: 'Потребность в материалах', status: 'planned' },
      { icon: '🚚', name: 'Заказы поставщикам', dependsOn: ['Заявки на закупку'], enables: 'Снабжение производства', status: 'planned' },
    ],
  },
  {
    level: 6,
    title: '💰 Бухгалтерия',
    subtitle: 'Заключительный этап — закрытие заказов и отчётность',
    gradient: 'linear-gradient(135deg, #be185d, #db2777)',
    modules: [
      { icon: '✅', name: 'Закрытие заказов', dependsOn: ['Отгрузка'], enables: 'Акты и счета-фактуры', status: 'planned' },
      { icon: '📊', name: 'Акты сверки', dependsOn: ['Контрагенты (юр.лица)'], enables: 'Ежегодные сверки', status: 'planned' },
      { icon: '📈', name: 'Финансовые отчёты', dependsOn: ['Закрытие заказов'], enables: 'Аналитика прибыли', status: 'planned' },

    ],
  },
];
