import { Component, inject, signal, computed, viewChild, ChangeDetectionStrategy, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../core/auth.service';
import { ThemeService } from '../core/theme.service';
import { PageTitleService } from '../core/page-title.service';
import { KpToastComponent } from '../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../shared/ui/kp-confirm-dialog.component';
import { KpButtonComponent } from '../shared/ui/kp-button.component';
import { KpSelectComponent, SelectOption } from '../shared/ui/kp-select.component';
import { KpAvatarComponent } from '../shared/ui/kp-avatar.component';
import { KpTieredMenuComponent } from '../shared/ui/kp-tiered-menu.component';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    RouterOutlet, RouterLink, RouterLinkActive,
    TooltipModule,
    KpToastComponent, KpConfirmDialogComponent, KpButtonComponent, KpSelectComponent,
    KpAvatarComponent, KpTieredMenuComponent, LucideDynamicIcon,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private pageTitleService = inject(PageTitleService);
  private router = inject(Router);

  readonly pageTitle = this.pageTitleService.title;
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // При каждой навигации очищаем заголовок — страницы сами установят свой в ngOnInit
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.pageTitleService.clearTitle());
  }

  readonly userMenuRef = viewChild<KpTieredMenuComponent>('userMenu');

  sidebarVisible = signal(true);
  isDark = this.themeService.isDark;
  currentUser = this.authService.currentUser;

  /** Демо-выбор роли (переопределяет роль из AuthService) */
  demoRole = signal('');

  /** Все возможные роли для переключателя */
  roleOptions: SelectOption[] = [
    { label: '👑 Администратор (всё)', value: 'admin' },
    { label: '💰 Менеджер продаж', value: 'manager' },
    { label: '🏭 Руководитель производства', value: 'production' },
    { label: '📦 Кладовщик', value: 'storekeeper' },
    { label: '🧾 Бухгалтер', value: 'accountant' },
    { label: '👁️ Наблюдатель', value: 'viewer' },
  ];

  /** Цвета разделов меню */
  sectionColors: Record<string, { bar: string; text: string; bg: string }> = {
    sales: { bar: '#818cf8', text: '#a5b4fc', bg: 'rgba(129,140,248,0.08)' },
    production: { bar: '#fbbf24', text: '#fcd34d', bg: 'rgba(251,191,36,0.08)' },
    warehouse: { bar: '#4ade80', text: '#86efac', bg: 'rgba(74,222,128,0.08)' },
    references: { bar: '#c084fc', text: '#d8b4fe', bg: 'rgba(192,132,252,0.08)' },
    finance: { bar: '#22d3ee', text: '#67e8f9', bg: 'rgba(34,211,238,0.08)' },
    admin: { bar: '#94a3b8', text: '#cbd5e1', bg: 'rgba(148,163,184,0.08)' },
  };

  collapsedSections = signal<Set<string>>(new Set(['sales', 'production', 'warehouse', 'references', 'finance', 'admin']));

  getSectionId(item: MenuItem & { sectionId?: string }): string { return item.sectionId || ''; }
  getSectionColors(sectionId: string) { return this.sectionColors[sectionId] || this.sectionColors['admin']; }
  isCollapsed(sectionId: string) { return this.collapsedSections().has(sectionId); }
  toggleSection(sectionId: string) {
    this.collapsedSections.update(s => {
      const next = new Set(s);
      if (next.has(sectionId)) next.delete(sectionId); else next.add(sectionId);
      return next;
    });
  }

  /** Привязка роли к доступным разделам */
  private readonly ROLE_SECTIONS: Record<string, string[]> = {
    admin: ['sales', 'production', 'warehouse', 'finance', 'references', 'admin'],
    manager: ['sales', 'references'],
    production: ['production', 'references'],
    storekeeper: ['warehouse'],
    accountant: ['finance'],
    viewer: [],
  };

  /** Разрешённые секции для текущей роли */
  allowedSections = computed(() => {
    const demo = this.demoRole();
    const role = demo || this.currentUser()?.role || 'viewer';
    return this.ROLE_SECTIONS[role] || [];
  });

  /** Полный список пунктов меню (до фильтрации) */
  private allNavItems: MenuItem[] = [
    { id: 'nav-home', label: 'Главная', icon: 'house', routerLink: '/dashboard' },
    { id: 'nav-app-guide', label: 'Карта приложения', icon: 'map', routerLink: '/app-guide' },
    { id: 'nav-uikit', label: 'UI Kit', icon: 'palette', routerLink: '/ui-kit' },
    { id: 'nav-sep-1', separator: true },
    {
      id: 'nav-sales', sectionId: 'sales',
      label: 'Продажи',
      icon: 'shopping-cart',
      items: [
        { id: 'nav-products', label: 'Товары и услуги', icon: 'box', routerLink: '/sales/products' },
        { id: 'nav-cart', label: 'Оформление КП', icon: 'file-text', routerLink: '/sales/cart' },
        { id: 'nav-proposals', label: 'Коммерческие предложения', icon: 'file', routerLink: '/sales/proposals' },
        { id: 'nav-markup-analysis', label: 'Анализ наценок', icon: 'percent', routerLink: '/sales/markup-analysis' },
        { id: 'nav-contracts', label: 'Договоры', icon: 'file-signature', routerLink: '/sales/contracts' },
      ]
    },
    {
      id: 'nav-production', sectionId: 'production',
      label: 'Производство',
      icon: 'building',
      items: [
        { id: 'nav-prod-orders', label: 'Заказы', icon: 'clipboard', routerLink: '/production/orders' },
        { id: 'nav-prod-tasks', label: 'Задачи', icon: 'check-square', routerLink: '/production/tasks' },
        { id: 'nav-prod-gantt', label: 'Диаграмма Ганта', icon: 'bar-chart', routerLink: '/production/gantt' },
        { id: 'nav-prod-wt', label: 'Виды работ', icon: 'wrench', routerLink: '/production/work-types' },
        { id: 'nav-prod-wc', label: 'Рабочие центры', icon: 'monitor', routerLink: '/production/work-centers' },
        { id: 'nav-prod-wkr', label: 'Работники', icon: 'users', routerLink: '/production/workers' },
      ]
    },{ id: 'nav-warehouse', sectionId: 'warehouse',
      label: 'Склад',
      icon: 'package',
      items: [
        { id: 'nav-wh-dash', label: 'Обзор складов', icon: 'warehouse', routerLink: '/warehouse' },
        { id: 'nav-wh-items', label: 'Инвентарь', icon: 'package', routerLink: '/warehouse/storage-items' },
        { id: 'nav-wh-pr', label: 'Заявки на закупку', icon: 'shopping-cart', routerLink: '/warehouse/purchase-requests' },
        { id: 'nav-wh-so', label: 'Заказы поставщикам', icon: 'truck', routerLink: '/warehouse/supplier-orders' },
        { id: 'nav-wh-inv', label: 'Входящие счета', icon: 'file-text', routerLink: '/warehouse/incoming-invoices' },
      ]
    },
    {
      id: 'nav-refs', sectionId: 'references',
      label: 'Справочники',
      icon: 'book',
      items: [
        { id: 'nav-orgs', label: 'Контрагенты', icon: 'building', routerLink: '/references/organizations' },
        { id: 'nav-role-types', label: 'Виды контрагентов', icon: 'tag', routerLink: '/references/counterparty-roles' },
        { id: 'nav-doc-types', label: 'Типы документов', icon: 'file', routerLink: '/references/doc-types' },
        { id: 'nav-clients', label: 'Клиенты', icon: 'user', routerLink: '/references/clients' },
        { id: 'nav-prod-cats', label: 'Категории товаров', icon: 'tag', routerLink: '/references/product-categories' },
        { id: 'nav-suppliers', label: 'Поставщики', icon: 'truck', routerLink: '/references/organizations?role=supplier' },
        { id: 'nav-buyers', label: 'Покупатели', icon: 'shopping-cart', routerLink: '/references/organizations?role=buyer' }
      ]
    },
    {
      id: 'nav-finance', sectionId: 'finance',
      label: 'Бухгалтерия',
      icon: 'landmark',
      items: [
        { id: 'nav-fin-dash', label: 'Сводка', icon: 'pie-chart', routerLink: '/finance' },
        { id: 'nav-fin-oc', label: 'Закрытие заказов', icon: 'check-square', routerLink: '/finance/order-closing' },
        { id: 'nav-fin-ra', label: 'Акты сверки', icon: 'file-text', routerLink: '/finance/reconciliation' },
        { id: 'nav-fin-fr', label: 'Финансовые отчёты', icon: 'bar-chart', routerLink: '/finance/reports' },
      ]
    },
    { id: 'nav-sep-2', separator: true },
    {
      id: 'nav-admin', sectionId: 'admin',
      label: 'Администрирование',
      icon: 'cog',
      items: [
        { id: 'nav-table-tpl', label: 'Шаблоны таблиц', icon: 'table', routerLink: '/admin/table-templates' },
        { id: 'nav-doc-tpl', label: 'Шаблоны документов', icon: 'file', routerLink: '/admin/document-templates' },
        { id: 'nav-feature-flags', label: 'Флаги возможностей', icon: 'flag', routerLink: '/admin/feature-flags' },
        { id: 'nav-users', label: 'Пользователи и роли', icon: 'users', routerLink: '/admin/users' },
        { id: 'nav-status-wf', label: '📊 Статусные модели', routerLink: '/admin/status-workflows' },
        { id: 'nav-tenders', label: '📋 Тендеры', routerLink: '/admin/tenders' },
        { id: 'nav-rpp', label: '📋 Реестр РПП', routerLink: '/admin/rpp' },
        { id: 'nav-certs', label: '📜 Сертификаты ЕАЭС', routerLink: '/admin/certificates' },
        { id: 'nav-cad', label: '📁 CAD-файлы', routerLink: '/admin/cad-files' },
        { id: 'nav-monitor', label: '🩺 Мониторинг', icon: 'activity', routerLink: '/admin/monitor' },
      ]
    }
  ];

  /** Отфильтрованное меню по роли */
  navItems = computed((): MenuItem[] => {
    const allowed = this.allowedSections();
    const filtered = this.allNavItems.filter(item => {
      if (item.separator) return true;
      const sectionId = (item as MenuItem & { sectionId?: string }).sectionId;
      if (!sectionId) return true;
      return allowed.includes(sectionId);
    });
    // Убираем дублирующиеся разделители
    return filtered.filter((item, i, arr) => {
      if (!item.separator) return true;
      const prev = arr[i - 1];
      const next = arr[i + 1];
      // Убираем разделитель если перед ним тоже разделитель или после нет элементов
      if (prev?.separator) return false;
      if (!next) return false;
      return true;
    });
  });

  userMenuItems: MenuItem[] = [
    { id: 'user-profile', label: 'Профиль', icon: 'user', command: () => {} },
    { id: 'user-settings', label: 'Настройки', icon: 'settings', command: () => {} },
    { id: 'user-sep', separator: true },
    { id: 'user-logout', label: 'Выйти', icon: 'log-out', command: () => this.authService.logout() }
  ];

  toggleSidebar() {
    this.sidebarVisible.update(v => !v);
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  onNotificationsClick() {}

  openUserMenu(event: Event) {
    this.userMenuRef()?.toggle(event);
  }
}
