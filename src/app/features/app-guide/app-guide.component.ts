import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { APP_PHASES, DEPENDANCY_LEVELS } from './app-guide.data';

@Component({
  selector: 'app-app-guide',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="ag__page">
      <!-- Header -->
      <header class="ag__header">
        <div class="ag__header-content">
          <span class="ag__header-icon">🗺️</span>
          <div>
            <h1 class="ag__title">Карта приложения</h1>
            <p class="ag__subtitle">
              Как устроена система «СпортИН-ЮГ» — от конструктора документов до отгрузки заказов.
              Нажмите на любой раздел, чтобы перейти к нему.
            </p>
          </div>
        </div>
        <div class="ag__legend">
          <span class="ag__legend-item"><span class="ag__badge ag__badge--done"></span> Готово</span>
          <span class="ag__legend-item"><span class="ag__badge ag__badge--wip"></span> В разработке</span>
          <span class="ag__legend-item"><span class="ag__badge ag__badge--planned"></span> Запланировано</span>
        </div>
      </header>

      <!-- Phases -->
      @for (phase of phases; track phase.title; let i = $index) {
        <section class="ag__phase">
          <div class="ag__phase-header" [style.background]="phase.gradient">
            <div class="ag__phase-header-inner">
              <div class="ag__phase-info">
                <span class="ag__phase-label">{{ 'Фаза ' + i }}</span>
                <h2 class="ag__phase-title">{{ phase.title }}</h2>
                <p class="ag__phase-subtitle">{{ phase.subtitle }}</p>
              </div>
              <span class="ag__phase-status" [class]="'ag__phase-status--' + phase.status">
                {{ statusLabel(phase.status) }}
              </span>
            </div>
          </div>

          <div class="ag__modules">
            @for (mod of phase.modules; track mod.title) {
              <div class="ag__module">
                <h3 class="ag__module-title">{{ mod.title }}</h3>
                <p class="ag__module-desc">{{ mod.description }}</p>
                <div class="ag__items">
                  @for (item of mod.items; track item.label) {
                    <a
                      class="ag__item"
                      [class.ag__item--planned]="item.status === 'planned'"
                      [class.ag__item--clickable]="!!item.routerLink"
                      [routerLink]="item.routerLink || null"
                    >
                      <div class="ag__item-icon-wrap">
                        <span class="ag__item-icon">{{ item.icon }}</span>
                      </div>
                      <div class="ag__item-body">
                        <span class="ag__item-label">{{ item.label }}</span>
                        <span class="ag__item-desc">{{ item.description }}</span>
                      </div>
                      <span class="ag__item-status ag__item-status--{{ item.status }}">
                        <span class="ag__item-status-dot"></span>
                        {{ item.status === 'done' ? 'Готово' : item.status === 'wip' ? 'В работе' : 'План' }}
                      </span>
                    </a>
                  }
                </div>
              </div>
            }
          </div>

          @if (i < phases.length - 1) {
            <div class="ag__connector">
              <div class="ag__connector-line"></div>
              <span class="ag__connector-arrow">⬇</span>
            </div>
          }
        </section>
      }

      <!-- Legend / Details -->
      <section class="ag__details">
        <h2 class="ag__details-title">📖 Как это работает</h2>
        <div class="ag__details-grid">
          <div class="ag__detail-card">
            <h3 class="ag__detail-card-title">🏪 Товары</h3>
            <p class="ag__detail-card-text">
              Каждый товар имеет <strong>артикул</strong> (SKU), который генерируется автоматически:
              <strong>префикс категории</strong> + <strong>4 цифры</strong>.
            </p>
            <p class="ag__detail-card-text">
              <strong>Типы товаров:</strong> 🛒 покупной (просто закупается у поставщика) 
              или 🔧 изготавливаемый (состоит из компонентов с материалами и видами работ).
            </p>
          </div>
          <div class="ag__detail-card ag__detail-card--prefixes">
            <h3 class="ag__detail-card-title">🔤 Префиксы артикулов (SKU)</h3>
            <p class="ag__detail-card-text">
              Первые 2 буквы артикула = <strong>категория товара</strong>. 
              Система автоматически подставляет префикс при выборе категории.
            </p>
            <div class="ag__prefix-table">
              <div class="ag__prefix-row ag__prefix-row--header">
                <span class="ag__prefix-cell ag__prefix-cell--code">Префикс</span>
                <span class="ag__prefix-cell ag__prefix-cell--name">Категория</span>
                <span class="ag__prefix-cell ag__prefix-cell--example">Пример</span>
              </div>
              <div class="ag__prefix-row">
                <span class="ag__prefix-cell ag__prefix-cell--code"><span class="ag__prefix-badge ag__prefix-badge--sp">SP</span></span>
                <span class="ag__prefix-cell ag__prefix-cell--name">Спортивное оборудование</span>
                <span class="ag__prefix-cell ag__prefix-cell--example ag__prefix-mono">SP0001</span>
              </div>
              <div class="ag__prefix-row">
                <span class="ag__prefix-cell ag__prefix-cell--code"><span class="ag__prefix-badge ag__prefix-badge--mf">MF</span></span>
                <span class="ag__prefix-cell ag__prefix-cell--name">Малые архитектурные формы</span>
                <span class="ag__prefix-cell ag__prefix-cell--example ag__prefix-mono">MF0001</span>
              </div>
              <div class="ag__prefix-row">
                <span class="ag__prefix-cell ag__prefix-cell--code"><span class="ag__prefix-badge ag__prefix-badge--og">OG</span></span>
                <span class="ag__prefix-cell ag__prefix-cell--name">Ограждения</span>
                <span class="ag__prefix-cell ag__prefix-cell--example ag__prefix-mono">OG0001</span>
              </div>
              <div class="ag__prefix-row">
                <span class="ag__prefix-cell ag__prefix-cell--code"><span class="ag__prefix-badge ag__prefix-badge--os">OS</span></span>
                <span class="ag__prefix-cell ag__prefix-cell--name">Освещение</span>
                <span class="ag__prefix-cell ag__prefix-cell--example ag__prefix-mono">OS0001</span>
              </div>
              <div class="ag__prefix-row">
                <span class="ag__prefix-cell ag__prefix-cell--code"><span class="ag__prefix-badge ag__prefix-badge--mb">MB</span></span>
                <span class="ag__prefix-cell ag__prefix-cell--name">Мебель</span>
                <span class="ag__prefix-cell ag__prefix-cell--example ag__prefix-mono">MB0001</span>
              </div>
              <div class="ag__prefix-row">
                <span class="ag__prefix-cell ag__prefix-cell--code"><span class="ag__prefix-badge ag__prefix-badge--nv">NV</span></span>
                <span class="ag__prefix-cell ag__prefix-cell--name">Спортивный инвентарь</span>
                <span class="ag__prefix-cell ag__prefix-cell--example ag__prefix-mono">NV0001</span>
              </div>
              <div class="ag__prefix-row">
                <span class="ag__prefix-cell ag__prefix-cell--code"><span class="ag__prefix-badge ag__prefix-badge--pr">PR</span></span>
                <span class="ag__prefix-cell ag__prefix-cell--name">Прочее (услуги, работы)</span>
                <span class="ag__prefix-cell ag__prefix-cell--example ag__prefix-mono">PR0001</span>
              </div>
            </div>
            <p class="ag__detail-card-text ag__detail-card-text--note">
              💡 Хотите добавить свою категорию? Перейдите в <strong>«Категории товаров»</strong> и создайте новую — 
              префикс (2 заглавные буквы) задаётся вручную.
            </p>
          </div>
          <div class="ag__detail-card">
            <h3 class="ag__detail-card-title">📋 Жизненный цикл заказа</h3>
            <ol class="ag__detail-card-list">
              <li><strong>Корзина</strong> → выбор товаров из витрины</li>
              <li><strong>КП</strong> → формируется из шаблона документа</li>
              <li><strong>Заказ</strong> → копия из КП (без цен), уходит в производство</li>
              <li><strong>Производство</strong> → распределение по видам работ</li>
              <li><strong>Гант</strong> → авто-заполнение + задачи</li>
              <li><strong>Отгрузка</strong> → документы из шаблонов</li>
              <li><strong>Закрытие</strong> → бухгалтерия</li>
            </ol>
          </div>
          <div class="ag__detail-card">
            <h3 class="ag__detail-card-title">🔧 Виды работ</h3>
            <p class="ag__detail-card-text">
              В производстве используются следующие виды работ:
            </p>
            <div class="ag__tags">
              <span class="ag__tag">Лазерная резка</span>
              <span class="ag__tag">Труборез</span>
              <span class="ag__tag">Полуавтом. сварка</span>
              <span class="ag__tag">Деревообработка</span>
              <span class="ag__tag">Порошковая покраска</span>
              <span class="ag__tag">Пескоструйная мойка</span>
              <span class="ag__tag">Лазерная сварка</span>
              <span class="ag__tag">Слесарные работы</span>
            </div>
          </div>
          <div class="ag__detail-card">
            <h3 class="ag__detail-card-title">👥 Роли и доступ</h3>
            <p class="ag__detail-card-text">
              Каждый сотрудник имеет <strong>роль</strong>, которая определяет доступ к разделам.
              Администратор настраивает права через галочки.
            </p>
            <div class="ag__roles">
              <span class="ag__role">👑 Администратор — всё</span>
              <span class="ag__role">💼 Менеджер — продажи</span>
              <span class="ag__role">🏭 Рук. производства — производство</span>
              <span class="ag__role">🔧 Мастер цеха — цех</span>
              <span class="ag__role">👷 Рабочий — свои задачи</span>
              <span class="ag__role">📦 Кладовщик — склад</span>
              <span class="ag__role">💰 Бухгалтер — финансы</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Sequence / Dependancy Flow -->
      <section class="ag__sequence">
        <h2 class="ag__sequence-title">📊 Последовательность заполнения</h2>
        <p class="ag__sequence-intro">
          Чтобы система работала, данные заполняются <strong>по уровням</strong> — 
          сначала базовые справочники, затем зависящие от них модули. 
          Каждый уровень открывает доступ к следующему.
        </p>

        @for (lvl of dependancyLevels; track lvl.level) {
          <div class="ag__seq-level">
            <div class="ag__seq-level-header">
              <span class="ag__seq-step" [style.background]="lvl.gradient">{{ lvl.level }}</span>
              <div class="ag__seq-level-info">
                <h3 class="ag__seq-level-title">{{ lvl.title }}</h3>
                <p class="ag__seq-level-subtitle">{{ lvl.subtitle }}</p>
              </div>
            </div>

            <div class="ag__seq-modules">
              @for (mod of lvl.modules; track mod.name) {
                <div
                  class="ag__seq-card"
                  [class.ag__seq-card--planned]="mod.status === 'planned'"
                >
                  <div class="ag__seq-card-top">
                    <span class="ag__seq-card-icon">{{ mod.icon }}</span>
                    <div class="ag__seq-card-body">
                      <span class="ag__seq-card-name">{{ mod.name }}</span>
                      @if (mod.enables) {
                        <span class="ag__seq-card-enables">→ {{ mod.enables }}</span>
                      }
                    </div>
                    <span class="ag__seq-card-status ag__seq-card-status--{{ mod.status }}"></span>
                  </div>
                  @if (mod.dependsOn.length > 0) {
                    <div class="ag__seq-card-deps">
                      <span class="ag__seq-deps-label">⬅ нужно:</span>
                      @for (dep of mod.dependsOn; track dep) {
                        <span class="ag__seq-dep-tag">{{ dep }}</span>
                      }
                    </div>
                  }
                </div>
              }
            </div>

            @if (lvl.level < dependancyLevels.length - 1) {
              <div class="ag__seq-connector">
                <div class="ag__seq-connector-line"></div>
                <span class="ag__seq-connector-arrow">⤵</span>
              </div>
            }
          </div>
        }

        <div class="ag__seq-key">
          <span class="ag__seq-key-item"><span class="ag__seq-key-dot ag__seq-key-dot--done"></span> Готово</span>
          <span class="ag__seq-key-item"><span class="ag__seq-key-dot ag__seq-key-dot--wip"></span> В работе</span>
          <span class="ag__seq-key-item"><span class="ag__seq-key-dot ag__seq-key-dot--planned"></span> Запланировано</span>
          <span class="ag__seq-key-item"><span class="ag__seq-dep-tag">⬅ нужно:</span> модули, которые надо заполнить сначала</span>
          <span class="ag__seq-key-item"><span class="ag__seq-key-arrow">→</span> что появляется после заполнения</span>
        </div>
      </section>

      <!-- Footer -->
      <footer class="ag__footer">
        <p class="ag__footer-text">
          🗺️ Карта приложения обновляется по мере развития системы. 
          <br>            Актуально на <strong>{{ currentDate }}</strong>. Следующее обновление — после завершения Фазы 1.
        </p>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ag__page { max-width: 1100px; margin: 0 auto; padding: var(--space-8); }

    .ag__header { margin-bottom: var(--space-8); }
    .ag__header-content { display: flex; align-items: flex-start; gap: var(--space-4); margin-bottom: var(--space-4); }
    .ag__header-icon { font-size: 3rem; line-height: 1; }
    .ag__title { font-size: 2rem; font-weight: 800; color: var(--color-text); margin: 0; }
    .ag__subtitle { font-size: var(--font-size-base); color: var(--color-text-secondary); margin: var(--space-2) 0 0; line-height: 1.6; }
    .ag__legend { display: flex; gap: var(--space-5); flex-wrap: wrap; }
    .ag__legend-item { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary); }
    .ag__badge { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    .ag__badge--done { background: #22c55e; }
    .ag__badge--wip { background: #f97316; }
    .ag__badge--planned { background: #94a3b8; }

    .ag__phase { margin-bottom: var(--space-6); }
    .ag__phase-header { border-radius: var(--radius-lg) var(--radius-lg) 0 0; overflow: hidden; }
    .ag__phase-header-inner { padding: var(--space-6); display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-4); }
    .ag__phase-info { flex: 1; }
    .ag__phase-label { display: inline-block; font-size: var(--font-size-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.15); padding: 2px 10px; border-radius: var(--radius-sm); margin-bottom: var(--space-2); }
    .ag__phase-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0; }
    .ag__phase-subtitle { font-size: var(--font-size-sm); color: rgba(255,255,255,0.8); margin: var(--space-1) 0 0; }
    .ag__phase-status { display: inline-flex; align-items: center; gap: var(--space-1); padding: 4px 14px; border-radius: 999px; font-size: var(--font-size-sm); font-weight: 600; white-space: nowrap; }
    .ag__phase-status--done { background: rgba(34,197,94,0.2); color: #86efac; }
    .ag__phase-status--wip { background: rgba(249,115,22,0.2); color: #fdba74; }
    .ag__phase-status--planned { background: rgba(148,163,184,0.2); color: #cbd5e1; }

    .ag__modules { background: var(--color-surface); border: 1px solid var(--color-border); border-top: none; border-radius: 0 0 var(--radius-lg) var(--radius-lg); padding: var(--space-6); display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-6); }
    .ag__module-title { font-size: var(--font-size-base); font-weight: var(--font-weight-bold); color: var(--color-text); margin: 0 0 var(--space-1); }
    .ag__module-desc { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: 0 0 var(--space-4); line-height: 1.5; }

    .ag__items { display: flex; flex-direction: column; gap: var(--space-2); }
    .ag__item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-3); border-radius: var(--radius-md); background: var(--color-bg-secondary); border: 1px solid var(--color-border); text-decoration: none; transition: all 0.2s ease; cursor: default; }
    .ag__item--clickable { cursor: pointer; }
    .ag__item--clickable:hover { border-color: var(--color-primary); background: var(--color-primary-bg, rgba(59,130,246,0.05)); transform: translateX(4px); }
    .ag__item--planned { opacity: 0.6; }
    .ag__item-icon-wrap { width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--color-bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ag__item-icon { font-size: 1.25rem; line-height: 1; }
    .ag__item-body { flex: 1; min-width: 0; }
    .ag__item-label { display: block; font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text); }
    .ag__item-desc { display: block; font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: 2px; }
    .ag__item-status { display: flex; align-items: center; gap: 4px; font-size: var(--font-size-xs); font-weight: 600; white-space: nowrap; flex-shrink: 0; }
    .ag__item-status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
    .ag__item-status--done { color: #22c55e; }
    .ag__item-status--done .ag__item-status-dot { background: #22c55e; }
    .ag__item-status--wip { color: #f97316; }
    .ag__item-status--wip .ag__item-status-dot { background: #f97316; }
    .ag__item-status--planned { color: #94a3b8; }
    .ag__item-status--planned .ag__item-status-dot { background: #94a3b8; }

    .ag__connector { display: flex; flex-direction: column; align-items: center; padding: var(--space-2) 0; position: relative; }
    .ag__connector-line { width: 2px; height: 24px; background: linear-gradient(to bottom, var(--color-border), var(--color-primary)); }
    .ag__connector-arrow { font-size: 1.25rem; color: var(--color-primary); margin-top: -2px; }

    .ag__details { margin-top: var(--space-8); }
    .ag__details-title { font-size: 1.25rem; font-weight: 700; color: var(--color-text); margin: 0 0 var(--space-4); }
    .ag__details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4); }
    .ag__detail-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-5); transition: box-shadow 0.2s ease; }
    .ag__detail-card:hover { box-shadow: var(--shadow-md); }
    .ag__detail-card-title { font-size: var(--font-size-base); font-weight: 700; color: var(--color-text); margin: 0 0 var(--space-3); }
    .ag__detail-card-text { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; margin: 0 0 var(--space-2); }
    .ag__detail-card-text--note { margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--color-border); }

    .ag__detail-card--prefixes { grid-column: 1 / -1; }
    .ag__prefix-table { display: flex; flex-direction: column; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; margin-top: var(--space-3); }
    .ag__prefix-row { display: grid; grid-template-columns: 100px 1fr 120px; gap: 0; transition: background 0.15s ease; }
    .ag__prefix-row:not(.ag__prefix-row--header):hover { background: var(--color-bg-secondary); }
    .ag__prefix-row--header { background: var(--color-bg-secondary); border-bottom: 1px solid var(--color-border); }
    .ag__prefix-cell { padding: var(--space-3) var(--space-4); font-size: var(--font-size-sm); display: flex; align-items: center; }
    .ag__prefix-cell--code { justify-content: center; }
    .ag__prefix-cell--name { color: var(--color-text); font-weight: 500; }
    .ag__prefix-cell--example { color: var(--color-text-secondary); font-family: 'Courier New', monospace; justify-content: flex-end; }
    .ag__prefix-mono { font-family: 'Courier New', monospace; letter-spacing: 0.03em; }
    .ag__prefix-row--header .ag__prefix-cell { font-size: var(--font-size-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary); }
    .ag__prefix-badge { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 26px; border-radius: 6px; font-size: var(--font-size-sm); font-weight: 800; letter-spacing: 0.05em; color: #fff; }
    .ag__prefix-badge--sp { background: linear-gradient(135deg, #059669, #10b981); }
    .ag__prefix-badge--mf { background: linear-gradient(135deg, #2563eb, #3b82f6); }
    .ag__prefix-badge--og { background: linear-gradient(135deg, #d97706, #f59e0b); }
    .ag__prefix-badge--os { background: linear-gradient(135deg, #7c3aed, #8b5cf6); }
    .ag__prefix-badge--mb { background: linear-gradient(135deg, #be185d, #db2777); }
    .ag__prefix-badge--nv { background: linear-gradient(135deg, #0891b2, #06b6d4); }
    .ag__prefix-badge--pr { background: linear-gradient(135deg, #6b7280, #9ca3af); }

    @media (max-width: 600px) {
      .ag__prefix-row { grid-template-columns: 70px 1fr 80px; }
      .ag__prefix-cell { padding: var(--space-2) var(--space-3); }
      .ag__prefix-badge { width: 40px; height: 22px; font-size: var(--font-size-xs); }
    }
    .ag__detail-card-list { margin: 0; padding-left: var(--space-4); font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 2; }
    .ag__tags { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-2); }
    .ag__tag { padding: 3px 10px; border-radius: 999px; background: var(--color-bg-secondary); border: 1px solid var(--color-border); font-size: var(--font-size-xs); color: var(--color-text-secondary); }
    .ag__roles { display: flex; flex-direction: column; gap: var(--space-1); margin-top: var(--space-2); }
    .ag__role { font-size: var(--font-size-sm); color: var(--color-text-secondary); }

    .ag__sequence { margin-top: var(--space-8); padding: var(--space-6); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); }
    .ag__sequence-title { font-size: 1.25rem; font-weight: 700; color: var(--color-text); margin: 0 0 var(--space-1); }
    .ag__sequence-intro { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; margin: 0 0 var(--space-6); }

    .ag__seq-level { margin-bottom: 0; }
    .ag__seq-level-header { display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4); }
    .ag__seq-step { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; font-size: var(--font-size-base); font-weight: 800; color: #fff; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
    .ag__seq-level-info { flex: 1; }
    .ag__seq-level-title { font-size: var(--font-size-base); font-weight: 700; color: var(--color-text); margin: 0; }
    .ag__seq-level-subtitle { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin: 2px 0 0; }

    .ag__seq-modules { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-3); padding-left: 52px; }
    .ag__seq-card { background: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4); transition: all 0.2s ease; }
    .ag__seq-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); transform: translateY(-2px); }
    .ag__seq-card--planned { opacity: 0.55; }
    .ag__seq-card-top { display: flex; align-items: flex-start; gap: var(--space-3); }
    .ag__seq-card-icon { font-size: 1.3rem; line-height: 1; margin-top: 2px; }
    .ag__seq-card-body { flex: 1; min-width: 0; }
    .ag__seq-card-name { display: block; font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text); line-height: 1.3; }
    .ag__seq-card-enables { display: block; font-size: var(--font-size-xs); color: var(--color-primary); margin-top: 2px; opacity: 0.85; }
    .ag__seq-card-status { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
    .ag__seq-card-status--done { background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.15); }
    .ag__seq-card-status--wip { background: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.15); }
    .ag__seq-card-status--planned { background: #94a3b8; box-shadow: 0 0 0 3px rgba(148,163,184,0.15); }

    .ag__seq-card-deps { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-1); margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px dashed var(--color-border); }
    .ag__seq-deps-label { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-right: var(--space-1); }
    .ag__seq-dep-tag { padding: 1px 8px; border-radius: 999px; background: var(--color-surface); border: 1px solid var(--color-border); font-size: var(--font-size-xs); color: var(--color-text-secondary); white-space: nowrap; }

    .ag__seq-connector { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0 var(--space-2) 52px; }
    .ag__seq-connector-line { flex: 1; height: 1px; background: linear-gradient(to right, var(--color-border), transparent); }
    .ag__seq-connector-arrow { font-size: 1.2rem; color: var(--color-text-secondary); opacity: 0.5; }

    .ag__seq-key { display: flex; flex-wrap: wrap; gap: var(--space-4); margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid var(--color-border); }
    .ag__seq-key-item { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-xs); color: var(--color-text-secondary); }
    .ag__seq-key-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .ag__seq-key-dot--done { background: #22c55e; }
    .ag__seq-key-dot--wip { background: #f97316; }
    .ag__seq-key-dot--planned { background: #94a3b8; }
    .ag__seq-key-arrow { color: var(--color-primary); font-weight: 700; }

    @media (max-width: 768px) {
      .ag__seq-modules { padding-left: 0; grid-template-columns: 1fr; }
      .ag__seq-connector { padding-left: 0; }
      .ag__seq-key { flex-direction: column; gap: var(--space-2); }
    }

    .ag__footer { margin-top: var(--space-8); padding: var(--space-6); text-align: center; border-top: 1px solid var(--color-border); }
    .ag__footer-text { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; margin: 0; }

    @media (max-width: 768px) {
      .ag__page { padding: var(--space-4); }
      .ag__phase-header-inner { flex-direction: column; }
      .ag__modules { grid-template-columns: 1fr; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppGuideComponent {
  currentDate = '06.06.2026';
  readonly phases = APP_PHASES;
  readonly dependancyLevels = DEPENDANCY_LEVELS;

  statusLabel(status: string): string {
    switch (status) {
      case 'done': return '✅ Готово';
      case 'wip': return '🚧 В разработке';
      case 'planned': return '📋 Запланировано';
      default: return '';
    }
  }
}
