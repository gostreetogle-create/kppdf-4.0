import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
import { ConfirmationService } from 'primeng/api';
import type { Organization } from '../../../../shared/types/index.js';

interface OrganizationRow extends Organization {
  updatedAtDisplay: string;
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
  private orgService = inject(OrganizationService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  organizations = signal<OrganizationRow[]>([]);
  loading = signal(false);

  breadcrumbs: MenuItem[] = [
    { label: 'Справочники', routerLink: '/references' },
    { label: 'Организации' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'name', header: 'Наименование', sortable: true },
    { field: 'legalForm', header: 'ОПФ', width: '80px', sortable: true },
    { field: 'inn', header: 'ИНН', width: '140px', sortable: true },
    { field: 'phone', header: 'Телефон', width: '170px' },
    { field: 'email', header: 'Email', width: '200px' },
    { field: 'updatedAtDisplay', header: 'Изменён', width: '170px', sortable: true },
  ];

  async ngOnInit() {
    await this.loadOrganizations();
  }

  async loadOrganizations() {
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.orgService.getOrganizations());
      this.organizations.set(result.data.map(o => ({
        ...o,
        updatedAtDisplay: new Date(o.updatedAt).toLocaleString('ru-RU'),
      })));
    } finally {
      this.loading.set(false);
    }
  }

  onEditRow(row: unknown) {
    const org = row as OrganizationRow;
    this.router.navigate(['/references/organizations', org.id, 'edit']);
  }

  onDelete(row: unknown) {
    const org = row as OrganizationRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление организации',
      message: `Вы уверены, что хотите удалить организацию «${org.shortName}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const result = await firstValueFrom(this.orgService.deleteOrganization(org.id));
        if (result.success) {
          this.notification.success('Организация удалена');
          await this.loadOrganizations();
        } else {
          this.notification.error(result.message || 'Ошибка удаления');
        }
      },
    });
  }
}
