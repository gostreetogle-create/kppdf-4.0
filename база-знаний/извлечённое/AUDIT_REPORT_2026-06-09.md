# АУДИТ-ОТЧЁТ kppdf-4.0 — 2026-06-09

> Глубокий аудит: фронтенд, бэкенд, связь, чек-листы, готовность к деплою.
> Автор: Buffy (Codebuff AI)
> Статус: v1.14.3 · 452 теста ✅ · сборка ✅ · линт 0 · деплой sport-set.ru

---

## 1. РЕЗЮМЕ

### ✅ Сильные стороны
- Архитектура: модульная, слоистая (core → shared → features → layout)
- UI Kit: 22 компонента, дизайн-токены, 2 темы
- Бэкенд: 30+ Mongoose-моделей + CRUD-роутеров, CRUD Factory
- Ролевая система: authGuard + requireRole, маршруты защищены
- 452 теста, 0 ошибок линта, сборка успешна

### ⚠️ Ключевые проблемы
1. **Товары не встраиваются в табличные блоки шаблона** — добавляются текстовым блоком в конец
2. **~20 сервисов всё ещё на in-memory моках** — не используют HTTP/ApiService
3. **Табличные блоки в превью конвертируются в текст** — нет рендеринга реальных таблиц с данными
4. **3 теста заскипаны** — нужен рефакторинг на TestBed.createComponent()

---

## 2. ФРОНТЕНД — СТАТУС СЕРВИСОВ

| Сервис | HTTP (ApiService) | In-Memory | Статус |
|--------|-------------------|-----------|--------|
| auth.service.ts | ✅ | — | HTTP |
| api.service.ts | ✅ | — | HTTP |
| organization.service.ts | ✅ | — | HTTP |
| counterparty-role.service.ts | ✅ | — | HTTP |
| doc-type.service.ts | ✅ | — | HTTP |
| product.service.ts | ✅ | — | HTTP |
| product-category.service.ts | ✅ | — | HTTP |
| product-photo.service.ts | ✅ | — | HTTP |
| product-component.service.ts | ✅ | — | HTTP |
| client.service.ts | ✅ | — | HTTP |
| document-template.service.ts | ✅ | — | HTTP |
| table-template.service.ts | ✅ | — | HTTP |
| **commercial-proposal.service.ts** | ❌ | ✅ BaseCrudService | ⚠️ МОК |
| **cart.service.ts** | ❌ | ✅ In-memory | ⚠️ МОК |
| **contract.service.ts** | ❌ | ✅ BaseCrudService | ⚠️ МОК |
| **Все сервисы Фаз 2-5** | ❌ | ✅ | ⚠️ МОКИ |

**Итого: 12 сервисов на HTTP, ~22 на моках**

---

## 3. БЭКЕНД — ПОЛНАЯ КАРТА

### 3.1 Модули (все 30+ реализованы ✅)

| Сущность | Модель | CRUD-роутер | Seed |
|----------|--------|-------------|------|
| User | ✅ | ✅ | ✅ admin |
| Organization | ✅ | ✅ | ✅ 4 шт. |
| CounterpartyRole | ✅ | ✅ | — |
| DocType | ✅ | ✅ | — |
| ProductCategory | ✅ | ✅ | ✅ 7 шт. |
| Product | ✅ | ✅ | ✅ 10 шт. |
| ProductComponent | ✅ | ✅ | ✅ 7 шт. |
| ProductPhoto | — (внутри product) | — | ✅ |
| Client | ✅ | ✅ | ✅ 5 шт. |
| CommercialProposal | ✅ | ✅ | — |
| Contract | ✅ | ✅ | — |
| DocumentTemplate | ✅ | ✅ | ✅ 2 шт. |
| TableTemplate | ✅ | ✅ | ✅ 2 шт. |
| WorkType | ✅ | ✅ | ✅ 9 шт. |
| WorkCenter | ✅ | ✅ | ✅ 6 шт. |
| Worker | ✅ | ✅ | ✅ 6 шт. |
| ProductionOrder | ✅ | ✅ | ✅ 2 шт. |
| OrderTask | ✅ | ✅ | ✅ 8 шт. |
| Warehouse | ✅ | ✅ | ✅ 2 шт. |
| StorageItem | ✅ | ✅ | ✅ 5 шт. |
| InventoryItem+Movement | ✅ | ✅ | ✅ 14 шт. |
| PurchaseRequest | ✅ | ✅ | ✅ 4 шт. |
| SupplierOrder | ✅ | ✅ | ✅ 3 шт. |
| IncomingInvoice | ✅ | ✅ | ✅ 3 шт. |
| OrderClosing | ✅ | ✅ | ✅ 3 шт. |
| ReconciliationAct | ✅ | ✅ | ✅ 3 шт. |
| FinancialReport | ✅ | ✅ | ✅ 2 шт. |
| Tender | ✅ | ✅ | ✅ 3 шт. |
| StatusWorkflow | ✅ | ✅ | ✅ 3 шт. |
| RoleDef | ✅ | ✅ | ✅ 8 шт. |
| RppEntry | ✅ | ✅ | ✅ 2 шт. |
| Certificate | ✅ | ✅ | ✅ 3 шт. |
| InventorFile | ✅ | ✅ | ✅ 4 шт. |
| Upload | — | ✅ (multer) | — |

---

## 4. КЛЮЧЕВЫЕ АРХИТЕКТУРНЫЕ НАХОДКИ

### 4.1 Интеграция товаров в шаблон документа

**Текущий поток (ProposalShowcase → docBlocks):**
```
1. Выбирается шаблон документа
2. Все блоки шаблона клонируются
3. Выбранные товары добавляются НОВЫМ текстовым блоком в конец
   (не в существующие table-блоки)
```

**Проблема:** Пользователь ожидает что товары из витрины заполнят ТАБЛИЧНЫЕ блоки внутри шаблона, а не добавятся отдельно.

**Целевой поток:**
```
1. Выбирается шаблон документа с table-блоком (у которого tableTemplateId)
2. Товары из витрины попадают в ЭТОТ table-блок
3. kp-doc-block-table в режиме 'instance' загружает данные через API
   и отображает реальную таблицу с товарами
```

### 4.2 Табличные блоки в превью КП

В `proposal-list.component.ts → fillPlaceholders()`:
- Табличные блоки КОНВЕРТИРУЮТСЯ в текстовые
- Данные товаров форматируются ручной табуляцией (`\t`)
- Нет использования реального рендеринга таблиц

**Нужно:** Передать proposal items в kp-doc-canvas в режиме 'instance', чтобы kp-doc-block-table отрендерил таблицу с реальными колонками.

---

## 5. ЧЕК-ЛИСТ — СВЕРКА С КОНСОЛИДИРОВАННЫМ

### Что отмечено как ✅ но требует внимания:

| Пункт чек-листа | Статус | Комментарий |
|-----------------|--------|-------------|
| P5.2 A4 документ справа | ✅ | Работает, но товары текстовым блоком |
| P5.3 Выбор шаблона и организации | ✅ | Работает |
| P5.5 Создание КП из витрины | ✅ | createWithItems() работает на моках |
| Привязка складов к ролям | ⚠️ | Кладовщик видит свои склады — требует бэкенд |
| 1С-интеграция | ❌ | Отложено |
| Отправка КП по email | ❌ | Отложено |
| Авто-бэкапы MongoDB | ❌ | cron не настроен |
| Мониторинг | ❌ | Отсутствует |
| Git-ветки для фич | ❌ | Всё в main |

---

## 6. ПЛАН ДЕЙСТВИЙ (приоритет)

### 🔴 P0 — Критично
1. Интеграция товаров в табличные блоки шаблона (ProposalShowcase.docBlocks)
2. Рендеринг table-блоков с реальными данными в превью КП

### 🟠 P1 — Важно
3. Перевод CommercialProposalService на HTTP (сейчас BaseCrudService)
4. Перевод CartService на HTTP
5. Перевод остальных сервисов Фаз 2-5 на HTTP

### 🟡 P2 — Желательно
6. Настроить cron для авто-бэкапов MongoDB
7. Создать git-ветки (feature/*)
8. Рефакторинг 3 skipped-тестов

---

*Дата: 2026-06-09 | Автор: Buffy | Версия: 2.0*
