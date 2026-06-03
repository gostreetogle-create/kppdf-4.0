import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="welcome">
      <div class="welcome__hero">
        <div class="welcome__hero-bg"></div>
        <h1 class="welcome__title">Project Core</h1>
        <p class="welcome__subtitle">Универсальное ядро для быстрого запуска веб-приложений</p>
      </div>

      <div class="welcome__cards">
        <a routerLink="/ui-kit" class="welcome-card">
          <div class="welcome-card__icon-wrap welcome-card__icon-wrap--blue">
            <i class="pi pi-palette"></i>
          </div>
          <span class="welcome-card__title">UI Kit</span>
          <span class="welcome-card__desc">16 компонентов: кнопки, таблицы, формы, диалоги, меню, аватары</span>
          <span class="welcome-card__link">Открыть витрину →</span>
        </a>

        <a routerLink="/admin/table-templates" class="welcome-card">
          <div class="welcome-card__icon-wrap welcome-card__icon-wrap--green">
            <i class="pi pi-table"></i>
          </div>
          <span class="welcome-card__title">Шаблоны таблиц</span>
          <span class="welcome-card__desc">Конструктор таблиц для документов: КП, накладные, акты</span>
          <span class="welcome-card__link">Перейти к шаблонам →</span>
        </a>

        <div class="welcome-card">
          <div class="welcome-card__icon-wrap welcome-card__icon-wrap--purple">
            <i class="pi pi-database"></i>
          </div>
          <span class="welcome-card__title">Backend API</span>
          <span class="welcome-card__desc">Express + MongoDB + JWT + CRUD Factory</span>
        </div>

        <div class="welcome-card">
          <div class="welcome-card__icon-wrap welcome-card__icon-wrap--amber">
            <i class="pi pi-shield"></i>
          </div>
          <span class="welcome-card__title">Авторизация</span>
          <span class="welcome-card__desc">JWT access + refresh токены, HttpOnly cookies, роли, права</span>
        </div>
      </div>

      <div class="welcome__footer">
        <div class="welcome__stat">
          <span class="welcome__stat-value">16</span>
          <span class="welcome__stat-label">UI компонентов</span>
        </div>
        <div class="welcome__stat">
          <span class="welcome__stat-value">108</span>
          <span class="welcome__stat-label">Тестов</span>
        </div>
        <div class="welcome__stat">
          <span class="welcome__stat-value">0</span>
          <span class="welcome__stat-label">Ошибок</span>
        </div>
        <div class="welcome__stat">
          <span class="welcome__stat-value">9</span>
          <span class="welcome__stat-label">Фаз ROADMAP</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 var(--space-4) var(--space-10);
    }

    .welcome__hero {
      position: relative;
      width: 100%;
      text-align: center;
      padding: var(--space-12) var(--space-4) var(--space-8);
      margin-bottom: var(--space-8);
      overflow: hidden;
    }

    .welcome__hero-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%);
      opacity: 0.06;
      border-radius: var(--radius-xl);
    }

    .welcome__title {
      position: relative;
      font-size: 2.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-2);
      letter-spacing: -0.03em;
    }

    .welcome__subtitle {
      position: relative;
      font-size: var(--font-size-lg);
      color: var(--color-text-muted);
      margin: 0;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
    }

    .welcome__cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--space-5);
      max-width: 960px;
      width: 100%;
    }

    .welcome-card {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      text-decoration: none;
      box-shadow: var(--shadow-card);
      border: 1px solid var(--color-border-light);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    a.welcome-card:hover {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-3px);
      border-color: rgba(37, 99, 235, 0.15);
    }

    .welcome-card__icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-2);

      i {
        font-size: 1.25rem;
        color: #ffffff;
      }

      &--blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
      &--green { background: linear-gradient(135deg, #10b981, #059669); }
      &--purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
      &--amber { background: linear-gradient(135deg, #f59e0b, #d97706); }
    }

    .welcome-card__title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .welcome-card__desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      line-height: 1.5;
    }

    .welcome-card__link {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-primary);
      margin-top: var(--space-2);
    }

    .welcome__footer {
      display: flex;
      gap: var(--space-8);
      margin-top: var(--space-10);
      padding: var(--space-6) var(--space-8);
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--color-border-light);
    }

    .welcome__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-1);
    }

    .welcome__stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
    }

    .welcome__stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-medium);
    }

    @media (max-width: 640px) {
      .welcome__footer {
        flex-wrap: wrap;
        gap: var(--space-4);
        justify-content: center;
      }
    }
  `]
})
export class DashboardComponent {}
