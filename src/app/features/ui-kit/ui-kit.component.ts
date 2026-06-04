import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent, SelectOption } from '../../shared/ui/kp-select.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpBadgeComponent } from '../../shared/ui/kp-badge.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';
import { KpAvatarComponent } from '../../shared/ui/kp-avatar.component';
import { KpToggleComponent } from '../../shared/ui/kp-toggle.component';
import { KpFileUploadComponent } from '../../shared/ui/kp-file-upload.component';
import { KpDatepickerComponent } from '../../shared/ui/kp-datepicker.component';
import { NotificationService } from '../../core/notification.service';
import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { inject } from '@angular/core';

@Component({
  selector: 'app-ui-kit',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpButtonComponent, KpInputComponent, KpSelectComponent,
    KpCardComponent, KpTableComponent, KpDialogComponent,
    KpBadgeComponent, KpBreadcrumbComponent,
    KpToastComponent, KpConfirmDialogComponent,
    KpAvatarComponent, KpToggleComponent,
    KpFileUploadComponent, KpDatepickerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kp-toast />
    <kp-confirm-dialog />

    <div class="uikit">
      <div class="uikit__header">
        <h1 class="uikit__title">UI Kit</h1>
        <p class="uikit__subtitle">Все компоненты ядра. Используй артикулы чтобы ссылаться на них в промтах.</p>
      </div>

      <!-- ============================================ -->
      <!-- KP-BTN: Кнопка -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-button">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-BTN</span>
          Кнопка &middot; <code>&lt;kp-button&gt;</code>
        </h2>
        <p class="uikit__section-desc">Все варианты кнопок: основные, второстепенные, опасные, текстовые, с загрузкой.</p>
        <div class="uikit__demo">
          <div class="uikit__demo-row">
            <kp-button label="Primary" />
            <kp-button label="Secondary" severity="secondary" />
            <kp-button label="Success" severity="success" />
            <kp-button label="Danger" severity="danger" />
            <kp-button label="Warn" severity="warn" />
          </div>
          <div class="uikit__demo-row">
            <kp-button label="Outlined" [outlined]="true" />
            <kp-button label="Raised" [raised]="true" />
            <kp-button label="Rounded" [rounded]="true" />
            <kp-button label="Text-only" [text]="true" />
            <kp-button icon="pi pi-check" />
          </div>
          <div class="uikit__demo-row">
            <kp-button label="Loading" [loading]="true" />
            <kp-button label="Disabled" [disabled]="true" />
            <kp-button label="Small" size="small" />
            <kp-button label="Large" size="large" />
            <kp-button label="С иконкой" icon="pi pi-search" />
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-IPT: Поле ввода -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-input">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-IPT</span>
          Поле ввода &middot; <code>&lt;kp-input&gt;</code>
        </h2>
        <p class="uikit__section-desc">Текст, число, пароль, email. С лейблом и без. С ошибкой. Кнопка очистки и переключатель видимости пароля.</p>
        <div class="uikit__demo uikit__demo--grid">
          <kp-input label="Имя" type="text" placeholder="Введите имя" />
          <kp-input label="Email" type="email" placeholder="email@example.com" />
          <kp-input label="Пароль" type="password" placeholder="••••••" />
          <kp-input label="С очисткой" type="text" placeholder="Наберите текст..." [showClear]="true" />
          <kp-input label="С ошибкой" [error]="'Поле обязательно'" />
          <kp-input placeholder="Без лейбла" />
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-SEL: Выпадающий список -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-select">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-SEL</span>
          Выпадающий список &middot; <code>&lt;kp-select&gt;</code>
        </h2>
        <p class="uikit__section-desc">Выбор из списка, с поиском, очисткой. Поддержка ngModel. Фильтрация для длинных списков.</p>
        <div class="uikit__demo uikit__demo--grid">
          <kp-select label="Статус" [options]="statusOptions" placeholder="Выберите статус" />
          <kp-select label="Город (с фильтром)" [options]="cityOptions" placeholder="Начните ввод..." [filter]="true" [showClear]="true" />
          <kp-select [options]="cityOptions" placeholder="Без лейбла" />
          <kp-select label="С ошибкой" [options]="statusOptions" [error]="'Выберите значение'" />
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-CRD: Карточка -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-card">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-CRD</span>
          Карточка &middot; <code>&lt;kp-card&gt;</code>
        </h2>
        <p class="uikit__section-desc">Блок с заголовком и подзаголовком. Hover lift-эффект. Скелетон для загрузки.</p>
        <div class="uikit__demo-row" style="margin-bottom:var(--space-4)">
          <kp-toggle label="Показать скелетон" [(checked)]="cardLoading" />
        </div>
        <div class="uikit__demo uikit__demo--grid">
          <kp-card header="Заголовок карточки" [loading]="cardLoading()">
            <p style="margin:0;color:var(--color-text-muted)">Содержимое карточки. Здесь может быть любой контент: текст, таблицы, формы.</p>
          </kp-card>
          <kp-card header="С подзаголовком" subheader="Дополнительная информация" [loading]="cardLoading()">
            <p style="margin:0;color:var(--color-text-muted)">Карточка с подзаголовком для контекста. Наведи — увидишь lift.</p>
          </kp-card>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-TBL: Таблица -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-table">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-TBL</span>
          Таблица &middot; <code>&lt;kp-table&gt;</code>
        </h2>
        <p class="uikit__section-desc">CRUD-таблица с пагинацией, сортировкой, поиском. Кнопки действий всегда видны — с фоном и hover-эффектом.</p>
        <div class="uikit__demo">
          <kp-table
            [data]="tableData()"
            [columns]="tableColumns"
            [rows]="5"
            [paginator]="true"
            [sortField]="'name'"
            [sortOrder]="1"
            [searchFields]="['name', 'client', 'status']"
            [showClone]="true"
            (rowEdit)="onTableEdit($event)"
            (rowClone)="onTableClone($event)"
            (rowDelete)="onTableDelete($event)"
          />
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-DLG: Диалог -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-dialog">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-DLG</span>
          Диалог &middot; <code>&lt;kp-dialog&gt;</code>
        </h2>
        <p class="uikit__section-desc">Модальное окно с backdrop-blur, maxHeight и прокруткой длинного контента.</p>
        <div class="uikit__demo">
          <kp-button label="Открыть диалог" icon="pi pi-window-maximize" (buttonClick)="dialogVisible.set(true)" />
          <kp-dialog
            header="Пример диалога"
            [visible]="dialogVisible()"
            (visibleChange)="dialogVisible.set($event)"
          >
            <p>Это содержимое диалога.</p>
            <p style="color:var(--color-text-muted)">Здесь можно разместить форму, текст или любой другой контент.</p>
            <p style="color:var(--color-text-muted)">При длинном содержимом — автоматическая прокрутка (maxHeight: 70vh).</p>
            <p style="color:var(--color-text-muted)">Фон за диалогом размыт (backdrop-filter: blur).</p>
            <div style="margin-top:var(--space-4);display:flex;gap:var(--space-2);justify-content:flex-end">
              <kp-button label="Закрыть" severity="secondary" (buttonClick)="dialogVisible.set(false)" />
              <kp-button label="Сохранить" (buttonClick)="dialogVisible.set(false)" />
            </div>
          </kp-dialog>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-BDG: Бейдж -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-badge">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-BDG</span>
          Бейдж &middot; <code>&lt;kp-badge&gt;</code>
        </h2>
        <p class="uikit__section-desc">Цветная метка статуса с поддержкой иконок. Все severity: success, info, warn, danger, secondary, contrast.</p>
        <div class="uikit__demo uikit__demo--row">
          <kp-badge value="Активен" severity="success" />
          <kp-badge value="В ожидании" severity="warn" />
          <kp-badge value="Ошибка" severity="danger" />
          <kp-badge value="Инфо" severity="info" />
          <kp-badge value="Черновик" severity="secondary" />
          <kp-badge value="Контраст" severity="contrast" />
        </div>
        <div class="uikit__demo-row" style="margin-top:var(--space-4)">
          <kp-badge value="Активен" icon="pi pi-check" severity="success" />
          <kp-badge value="В ожидании" icon="pi pi-clock" severity="warn" />
          <kp-badge value="Ошибка" icon="pi pi-times" severity="danger" />
          <kp-badge value="Инфо" icon="pi pi-info-circle" severity="info" />
          <kp-badge value="Rounded" severity="success" [rounded]="true" />
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-AVT: Аватар -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-avatar">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-AVT</span>
          Аватар &middot; <code>&lt;kp-avatar&gt;</code>
        </h2>
        <p class="uikit__section-desc">Аватар с инициалами, иконкой или фото. Индикатор статуса (онлайн/офлайн/занят/отошёл).</p>
        <div class="uikit__demo uikit__demo--row">
          <kp-avatar label="АИ" status="online" />
          <kp-avatar label="МП" status="offline" />
          <kp-avatar icon="pi pi-user" status="busy" size="large" />
          <kp-avatar icon="pi pi-user" status="away" size="large" />
          <kp-avatar label="АИ" size="xlarge" status="online" />
          <kp-avatar icon="pi pi-user" />
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-TGL: Переключатель -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-toggle">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-TGL</span>
          Переключатель &middot; <code>&lt;kp-toggle&gt;</code>
        </h2>
        <p class="uikit__section-desc">Toggle switch с тремя размерами: small, normal, large.</p>
        <div class="uikit__demo uikit__demo--row">
          <kp-toggle label="Small" toggleSize="small" />
          <kp-toggle label="Normal" />
          <kp-toggle label="Large" toggleSize="large" />
          <kp-toggle label="Disabled" [disabled]="true" />
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-DAT: Выбор даты -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-datepicker">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-DAT</span>
          Выбор даты &middot; <code>&lt;kp-datepicker&gt;</code>
        </h2>
        <p class="uikit__section-desc">Календарь с русской локализацией (месяцы и дни на русском).</p>
        <div class="uikit__demo uikit__demo--grid">
          <kp-datepicker label="Дата" placeholder="дд.мм.гг" [showIcon]="true" />
          <kp-datepicker label="Дата и время" placeholder="дд.мм.гг" [showTime]="true" [showIcon]="true" />
          <kp-datepicker label="Disabled" [disabled]="true" />
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-UPL: Загрузка файлов -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-file-upload">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-UPL</span>
          Загрузка файлов &middot; <code>&lt;kp-file-upload&gt;</code>
        </h2>
        <p class="uikit__section-desc">Drag-and-drop зона с подсветкой при наведении файла.</p>
        <div class="uikit__demo">
          <kp-file-upload
            label="Загрузите файл"
            accept=".pdf,.docx,.xlsx"
            chooseLabel="Выбрать файл"
            uploadLabel="Загрузить"
            cancelLabel="Отмена"
            mode="basic"
          />
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-BRD: Хлебные крошки -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-breadcrumb">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-BRD</span>
          Хлебные крошки &middot; <code>&lt;kp-breadcrumb&gt;</code>
        </h2>
        <p class="uikit__section-desc">Навигационный путь с кастомным разделителем ›.</p>
        <div class="uikit__demo">
          <kp-breadcrumb [items]="breadcrumbItems" />
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-TST: Уведомления (Toast) -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-toast">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-TST</span>
          Уведомления &middot; <code>&lt;kp-toast&gt;</code> + <code>NotificationService</code>
        </h2>
        <p class="uikit__section-desc">Всплывающие сообщения с прогресс-баром. 4 типа: success, info, warn, error.</p>
        <div class="uikit__demo uikit__demo--row">
          <kp-button label="Успешно" severity="success" (buttonClick)="notify.success('Операция выполнена успешно')" />
          <kp-button label="Инфо" severity="info" (buttonClick)="notify.info('Информационное сообщение')" />
          <kp-button label="Предупреждение" severity="warn" (buttonClick)="notify.warn('Внимание!')" />
          <kp-button label="Ошибка" severity="danger" (buttonClick)="notify.error('Произошла ошибка')" />
        </div>
      </section>

      <!-- ============================================ -->
      <!-- KP-CFM: Подтверждение (Confirm Dialog) -->
      <!-- ============================================ -->
      <section class="uikit__section" id="kp-confirm">
        <h2 class="uikit__section-title">
          <span class="uikit__code">KP-CFM</span>
          Подтверждение &middot; <code>&lt;kp-confirm-dialog&gt;</code> + <code>KpConfirmDialogComponent.confirm()</code>
        </h2>
        <p class="uikit__section-desc">Диалог подтверждения действий (удаление, выход и т.п.).</p>
        <div class="uikit__demo">
          <kp-button
            label="Показать подтверждение"
            severity="danger"
            icon="pi pi-exclamation-triangle"
            (buttonClick)="showConfirm()"
          />
        </div>
      </section>

    </div>
  `,
  styles: [`
    .uikit {
      padding: var(--space-6) var(--space-6) var(--space-10);
      max-width: 1100px;
      margin: 0 auto;
    }
    .uikit__header {
      margin-bottom: var(--space-8);
    }
    .uikit__title {
      font-size: 2rem;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-2);
    }
    .uikit__subtitle {
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      margin: 0;
    }

    .uikit__section {
      margin-bottom: var(--space-8);
      padding-bottom: var(--space-6);
      border-bottom: 1px solid var(--color-border-light);
    }
    .uikit__section:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    .uikit__section-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 var(--space-2);
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    .uikit__code {
      background: var(--color-primary-light);
      color: var(--color-primary);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      font-family: 'Consolas', 'Courier New', monospace;
      letter-spacing: 0.5px;
    }
    .uikit__section-title code {
      background: var(--color-surface-alt);
      padding: 1px 6px;
      border-radius: var(--radius-sm);
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    .uikit__section-desc {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      margin: 0 0 var(--space-4);
    }

    .uikit__demo {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      box-shadow: var(--shadow-sm);
    }
    .uikit__demo--grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: var(--space-5);
    }
    .uikit__demo-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-3);
    }
    .uikit__demo-row + .uikit__demo-row {
      margin-top: var(--space-4);
    }
    .uikit__demo--row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-3);
    }
  `]
})
export class UiKitComponent {
  notify = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  dialogVisible = signal(false);
  cardLoading = signal(false);

  // KP-SEL: sample options
  statusOptions: SelectOption[] = [
    { label: 'Активен', value: 'active' },
    { label: 'В ожидании', value: 'pending' },
    { label: 'Завершён', value: 'completed' },
    { label: 'Отменён', value: 'cancelled' }
  ];

  cityOptions: SelectOption[] = [
    { label: 'Москва', value: 'msk' },
    { label: 'Санкт-Петербург', value: 'spb' },
    { label: 'Новосибирск', value: 'nsk' },
    { label: 'Екатеринбург', value: 'ekb' },
    { label: 'Казань', value: 'kzn' },
    { label: 'Краснодар', value: 'krd' },
    { label: 'Владивосток', value: 'vlv' },
    { label: 'Самара', value: 'sam' },
    { label: 'Ростов-на-Дону', value: 'rnd' },
    { label: 'Уфа', value: 'ufa' }
  ];

  // KP-TBL: sample data
  tableColumns: TableColumn[] = [
    { field: 'id', header: '#', width: '60px', sortable: true },
    { field: 'name', header: 'Наименование', sortable: true },
    { field: 'client', header: 'Клиент', sortable: true },
    { field: 'status', header: 'Статус', width: '120px', type: 'badge' },
    { field: 'amount', header: 'Сумма', width: '120px', type: 'number', sortable: true },
    { field: 'date', header: 'Дата', width: '110px', type: 'date', sortable: true }
  ];

  tableData = signal([
    { id: 1, name: 'КП №001-2026', client: 'ООО "ТехноСервис"', status: 'Активен', amount: '245 000 ₽', date: '01.06.2026' },
    { id: 2, name: 'Заказ №45', client: 'ИП Иванов А.С.', status: 'В ожидании', amount: '89 500 ₽', date: '31.05.2026' },
    { id: 3, name: 'КП №002-2026', client: 'АО "ПромСнаб"', status: 'Завершён', amount: '512 000 ₽', date: '28.05.2026' },
    { id: 4, name: 'Заказ №44', client: 'ООО "СтройКомплект"', status: 'Активен', amount: '156 000 ₽', date: '27.05.2026' },
    { id: 5, name: 'КП №003-2026', client: 'ЗАО "МеталлТорг"', status: 'В ожидании', amount: '78 200 ₽', date: '25.05.2026' },
    { id: 6, name: 'Заказ №43', client: 'ООО "СпецМаш"', status: 'Завершён', amount: '320 000 ₽', date: '22.05.2026' },
    { id: 7, name: 'КП №004-2026', client: 'ИП Петров В.К.', status: 'Активен', amount: '45 000 ₽', date: '20.05.2026' },
    { id: 8, name: 'Заказ №42', client: 'АО "ЭнергоПром"', status: 'Отменён', amount: '198 000 ₽', date: '18.05.2026' },
    { id: 9, name: 'КП №005-2026', client: 'ООО "ГрандСтрой"', status: 'Активен', amount: '670 000 ₽', date: '15.05.2026' },
    { id: 10, name: 'Заказ №41', client: 'ЗАО "ТехноЛогистика"', status: 'Завершён', amount: '234 000 ₽', date: '12.05.2026' },
    { id: 11, name: 'Заказ №40', client: 'ООО "АльфаСервис"', status: 'В ожидании', amount: '89 000 ₽', date: '10.05.2026' },
    { id: 12, name: 'КП №006-2026', client: 'ИП Сидоров М.Л.', status: 'Активен', amount: '156 000 ₽', date: '08.05.2026' }
  ]);

  // KP-BRD: breadcrumb items
  breadcrumbItems: MenuItem[] = [
    { label: 'Главная', routerLink: '/dashboard' },
    { label: 'UI Kit' }
  ];

  onTableEdit(row: unknown) {
    this.notify.info(`Редактирование: ${(row as { name: string }).name}`);
  }

  onTableClone(row: unknown) {
    this.notify.success(`Клонирование: ${(row as { name: string }).name}`);
  }

  onTableDelete(row: unknown) {
    this.notify.warn(`Запрос на удаление: ${(row as { name: string }).name}`);
  }

  showConfirm() {
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите удалить этот элемент? Это действие нельзя отменить.',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: () => this.notify.success('Подтверждено!')
    });
  }
}
