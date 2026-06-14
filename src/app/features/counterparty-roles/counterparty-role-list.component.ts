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
import { CounterpartyRoleService } from '../../core/counterparty-role.service';
import { ConfirmationService } from 'primeng/api';
import type { CounterpartyRoleDef } from '../../../../shared/types/index.js';

interface RoleRow extends CounterpartyRoleDef {
  updatedAtDisplay: string;
}

@Component({
  selector: 'app-counterparty-role-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpToastComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kp-toast />

    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="org-list__header">
        <h2 class="org-list__title">Виды контрагентов</h2>
        <kp-button
          label="Добавить вид"
          lucideIcon="plus"
          routerLink="/references/counterparty-roles/new"
        />
      </div>

      <kp-table
        storageKey="counterparty-roles"
        [data]="roles()"
        [columns]="tableColumns"
        [rows]="20"
        [paginator]="true"
        [loading]="loading()"
        [sortField]="'name'"
        [sortOrder]="1"
        [searchFields]="['name', 'description', 'slug']"
        emptyMessage="Нет видов контрагентов"
        (rowEdit)="onEditRow($event)"
        (rowDelete)="onDelete($event)"
      />
    </kp-card>
  `,
  styles: [`
    :host {
      display: block;
      max-width: 900px;
      margin: 0 auto;
      padding: var(--space-6);
    }
    .org-list__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: var(--space-4) 0;
    }
    .org-list__title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }
  `]
})
export class CounterpartyRoleListComponent implements OnInit {
  private router = inject(Router);
  private roleService = inject(CounterpartyRoleService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  roles = signal<RoleRow[]>([]);
  loading = signal(false);

  breadcrumbs: MenuItem[] = [
    { label: 'Справочники', routerLink: '/references' },
    { label: 'Виды контрагентов' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'name', header: 'Название', sortable: true },
    { field: 'slug', header: 'Системный ключ', width: '140px' },
    { field: 'description', header: 'Описание' },
    { field: 'updatedAtDisplay', header: 'Изменён', width: '170px', sortable: true },
  ];

  async ngOnInit() {
    await this.loadRoles();
  }

  async loadRoles() {
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.roleService.getRoles());
      this.roles.set(result.data.map(r => ({
        ...r,
        updatedAtDisplay: new Date(r.updatedAt).toLocaleString('ru-RU'),
      })));
    } finally {
      this.loading.set(false);
    }
  }

  onEditRow(row: unknown) {
    const r = row as RoleRow;
    this.router.navigate(['/references/counterparty-roles', r.id, 'edit']);
  }

  onDelete(row: unknown) {
    const r = row as RoleRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление вида контрагента',
      message: `Вы уверены, что хотите удалить вид «${r.name}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const result = await firstValueFrom(this.roleService.deleteRole(r.id));
        if (result.success) {
          this.notification.success('Вид контрагента удалён');
          await this.loadRoles();
        } else {
          this.notification.error(result.message || 'Ошибка удаления');
        }
      },
    });
  }
}
