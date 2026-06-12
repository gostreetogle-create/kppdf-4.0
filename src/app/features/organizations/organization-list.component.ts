import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';

import { NotificationService } from '../../core/notification.service';
import { OrganizationService } from '../../core/organization.service';
import { CounterpartyRoleService } from '../../core/counterparty-role.service';
import { ConfirmationService } from 'primeng/api';
import type { Organization, CounterpartyRoleDef } from '../../../../shared/types/index.js';

interface OrganizationRow extends Organization {
  updatedAtDisplay: string;
  roleLabels: string;
  vatRateDisplay: string;
}

interface Tab {
  id: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-organization-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpToastComponent, KpConfirmDialogComponent,
  ],
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationListComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private orgService = inject(OrganizationService);
  private roleService = inject(CounterpartyRoleService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  organizations = signal<OrganizationRow[]>([]);
  allRoleDefs = signal<CounterpartyRoleDef[]>([]);
  loading = signal(false);
  activeTab = signal('all');
  tabs = signal<Tab[]>([]);

  breadcrumbs: MenuItem[] = [
    { label: 'Справочники', routerLink: '/references' },
    { label: 'Контрагенты' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'name', header: 'Наименование', sortable: true },
    { field: 'legalForm', header: 'ОПФ', width: '80px' },
    { field: 'inn', header: 'ИНН', width: '140px', sortable: true },
    { field: 'vatRateDisplay', header: 'НДС', width: '70px' },
    { field: 'roleLabels', header: 'Роли', width: '160px' },
    { field: 'phone', header: 'Телефон', width: '170px' },
    { field: 'email', header: 'Email', width: '200px' },
    { field: 'updatedAtDisplay', header: 'Изменён', width: '170px', sortable: true },
  ];

  async ngOnInit() {
    // Загружаем все роли из справочника
    const roleResult = await firstValueFrom(this.roleService.getRoles());
    this.allRoleDefs.set(roleResult.data.filter(r => r.isActive));

    // Определяем активную вкладку из query-параметра ?role=
    const roleSlug = this.route.snapshot.queryParamMap.get('role');
    if (roleSlug) {
      this.activeTab.set(roleSlug);
    }

    await this.loadTabs();
    await this.loadOrganizations();
  }

  async loadTabs() {
    // Загружаем все организации для подсчёта по ролям
    const allOrgs = await firstValueFrom(this.orgService.getOrganizations());
    const orgs = allOrgs.data || [];

    const tabs: Tab[] = [{ id: 'all', label: 'Все', count: orgs.length }];

    // Динамические вкладки для каждой роли из справочника
    for (const role of this.allRoleDefs()) {
      const count = orgs.filter(o => {
        const roleId = this.allRoleDefs().find(r => r.slug === role.slug)?.id;
        return roleId ? o.counterpartyRoleIds.includes(roleId) : false;
      }).length;
      tabs.push({ id: role.slug, label: role.name, count });
    }

    this.tabs.set(tabs);
  }

  private getRoleName(roleId: string): string {
    return this.allRoleDefs().find(r => r.id === roleId)?.name || roleId;
  }

  async loadOrganizations() {
    this.loading.set(true);
    try {
      const roleSlug = this.activeTab() === 'all' ? undefined : this.activeTab();
      const result = await firstValueFrom(this.orgService.getOrganizations(roleSlug));
      this.organizations.set(result.data.map(o => ({
        ...o,
        updatedAtDisplay: new Date(o.updatedAt).toLocaleString('ru-RU'),
        vatRateDisplay: o.vatRate != null ? o.vatRate + '%' : '—',
        roleLabels: o.counterpartyRoleIds.length > 0
          ? o.counterpartyRoleIds.map(id => this.getRoleName(id)).join(', ')
          : '—',
      })));
    } finally {
      this.loading.set(false);
    }
  }

  onTabChange(tabId: string) {
    this.activeTab.set(tabId);
    this.loadOrganizations();
  }

  onEditRow(row: unknown) {
    const org = row as OrganizationRow;
    this.router.navigate(['/references/organizations', org.id, 'edit']);
  }

  onDelete(row: unknown) {
    const org = row as OrganizationRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление контрагента',
      message: `Вы уверены, что хотите удалить контрагента «${org.shortName || org.name}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const result = await firstValueFrom(this.orgService.deleteOrganization(org.id));
        if (result.success) {
          this.notification.success('Контрагент удалён');
          await this.loadOrganizations();
          await this.loadTabs();
        } else {
          this.notification.error(result.message || 'Ошибка удаления');
        }
      },
    });
  }
}
