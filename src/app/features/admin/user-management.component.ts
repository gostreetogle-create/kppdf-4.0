import { Component, inject, signal, computed, linkedSignal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';
import { UserService } from '../../core/user.service';
import { RoleService } from '../../core/role.service';
import { NotificationService } from '../../core/notification.service';
import { ConfirmationService } from 'primeng/api';
import type { User, RoleDef } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpDialogComponent, KpSelectComponent,
    KpInputComponent, KpToastComponent,
  ],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <div class="um-tabs">
        <kp-button [label]="'👥 Пользователи'" [severity]="activeTab() === 'users' ? 'info' : 'secondary'" size="small" (buttonClick)="activeTab.set('users')" />
        <kp-button [label]="'🔐 Роли'" [severity]="activeTab() === 'roles' ? 'info' : 'secondary'" size="small" (buttonClick)="activeTab.set('roles')" />
      </div>

      @let isEditing = editingUserId();
      @if (activeTab() === 'users') {
        <div class="um-header">
          <h2 class="page__title">Пользователи</h2>
          <kp-button label="+ Новый пользователь" lucideIcon="user-plus" severity="info" size="small" (buttonClick)="openCreate()" />
        </div>
        <kp-table
          storageKey="users"
          [data]="userRows()"
          [columns]="userColumns"
          [rows]="20"
          [paginator]="true"
          [sortField]="'username'"
          [sortOrder]="1"
          emptyMessage="Нет пользователей"
          [showActions]="true"
          (rowEdit)="onEditUser($event)"
          (rowDelete)="onDeleteUser($event)"
        />
      } @else {
        <div class="um-header">
          <h2 class="page__title">Роли</h2>
        </div>
        <kp-table
          storageKey="roles"
          [data]="roleRows()"
          [columns]="roleColumns"
          [rows]="20"
          emptyMessage="Нет ролей"
          [showActions]="true"
          (rowDelete)="onDeleteRole($event)"
        />
      }
    </kp-card>

    <!-- Диалог создания/редактирования пользователя -->
    <kp-dialog
      [header]="isEditing ? '✏️ Редактировать пользователя' : '👤 Новый пользователь'"
      [(visible)]="userDialogVisible"
      width="480px"
      (dialogHide)="closeUserDialog()"
    >
      <div class="um-form">
        <kp-input label="Имя пользователя" [(ngModel)]="formUsername" placeholder="Например: ivanov" />
        <kp-input label="Отображаемое имя" [(ngModel)]="formDisplayName" placeholder="Иван Иванов" />
        <kp-input label="Email" [(ngModel)]="formEmail" placeholder="ivanov@company.ru" />
        <kp-input label="Телефон" [(ngModel)]="formPhone" placeholder="+7 (999) 123-45-67" />
        @if (!isEditing) {
          <kp-input label="Пароль" [(ngModel)]="formPassword" placeholder="Минимум 6 символов" />
        }
        <kp-select label="Роль" [options]="svc.roleOptions" [(ngModel)]="formRole" placeholder="Выберите роль" />
      </div>
      <div class="um-actions">
        <kp-button label="Отмена" severity="secondary" size="small" (buttonClick)="closeUserDialog()" />
        <kp-button
          [label]="isEditing ? 'Сохранить' : 'Создать и пригласить'"
          [lucideIcon]="isEditing ? 'check' : 'send'"
          severity="info" size="small"
          [disabled]="!formUsername() || !formDisplayName() || !formRole()"
          (buttonClick)="saveUser()"
        />
      </div>
    </kp-dialog>
  `,
  styles: [`
    :host { display: block; max-width: 100%; margin: 0; padding: var(--space-6); }
    .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }
    .um-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); }
    .um-tabs { display: flex; gap: var(--space-2); margin: var(--space-4) 0; }
    .um-form { display: flex; flex-direction: column; gap: var(--space-4); padding: var(--space-2) 0; }
    .um-actions { display: flex; justify-content: flex-end; gap: var(--space-3); padding-top: var(--space-4); border-top: 1px solid var(--color-border-light); margin-top: var(--space-4); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {
  private userSvc = inject(UserService);
  private roleSvc = inject(RoleService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  protected svc = this.userSvc; // for template access

  activeTab = signal<'users' | 'roles'>('users');

  // ─── Users ───
  users = signal<User[]>([]);
  roles = signal<RoleDef[]>([]);

  breadcrumbs: MenuItem[] = [{ label: '⚙️ Администрирование' }, { label: 'Пользователи и роли' }];

  userColumns: TableColumn[] = [
    { field: 'username', header: 'Логин', width: '120px', sortable: true },
    { field: 'displayName', header: 'Имя', sortable: true },
    { field: 'email', header: 'Email', width: '200px' },
    { field: 'phone', header: 'Телефон', width: '150px' },
    { field: 'roleLabel', header: 'Роль', width: '180px' },
    { field: 'statusLabel', header: 'Статус', width: '100px', type: 'badge' },
  ];

  roleColumns: TableColumn[] = [
    { field: 'name', header: 'Роль', sortable: true },
    { field: 'description', header: 'Описание' },
    { field: 'sectionsStr', header: 'Доступ к разделам', width: '300px' },
    { field: 'activeLabel', header: 'Активна', width: '90px', type: 'badge' },
  ];

  userRows = computed(() => {
    const roleLabels: Record<string, string> = { admin: '👑 Администратор', manager: '💰 Менеджер продаж', production: '🏭 Рук. производства', storekeeper: '📦 Кладовщик', accountant: '🧾 Бухгалтер', viewer: '👁️ Наблюдатель' };
    return this.users().map(u => ({
      ...u,
      roleLabel: roleLabels[u.role] || u.role,
      statusLabel: u.isActive ? 'Активен' : 'Неактивен',
    }));
  });

  roleRows = computed(() => {
    const labels: Record<string, string> = { sales: 'Продажи', production: 'Производство', warehouse: 'Склад', finance: 'Бухгалтерия', references: 'Справочники', admin: 'Администрирование' };
    return this.roles().map(r => ({ ...r, sectionsStr: r.sectionIds.map(s => labels[s] || s).join(', '), activeLabel: r.isActive ? 'Активна' : 'Неактивна' }));
  });

  // ─── Форма пользователя (linkedSignal — авто-сброс при смене editingUserId) ───
  userDialogVisible = signal(false);
  editingUserId = signal<string | null>(null);

  formUsername = linkedSignal<string | null, string>({
    source: () => this.editingUserId(),
    computation: (id) => id ? this.users().find(u => u.id === id)?.username ?? '' : '',
  });
  formDisplayName = linkedSignal<string | null, string>({
    source: () => this.editingUserId(),
    computation: (id) => id ? this.users().find(u => u.id === id)?.displayName ?? '' : '',
  });
  formEmail = linkedSignal<string | null, string>({
    source: () => this.editingUserId(),
    computation: (id) => id ? this.users().find(u => u.id === id)?.email ?? '' : '',
  });
  formPhone = linkedSignal<string | null, string>({
    source: () => this.editingUserId(),
    computation: (id) => id ? this.users().find(u => u.id === id)?.phone ?? '' : '',
  });
  formPassword = linkedSignal<string | null, string>({
    source: () => this.editingUserId(),
    computation: () => '',
  });
  formRole = linkedSignal<string | null, string>({
    source: () => this.editingUserId(),
    computation: (id) => id ? this.users().find(u => u.id === id)?.role ?? '' : '',
  });

  constructor() {
    this.loadUsers();
    this.loadRoles();
  }

  async loadUsers() {
    const r = await firstValueFrom(this.userSvc.getAll());
    this.users.set(r.data);
  }

  async loadRoles() {
    const r = await firstValueFrom(this.roleSvc.getAll());
    this.roles.set(r.data);
  }

  openCreate() {
    this.editingUserId.set(null);
    this.userDialogVisible.set(true);
  }

  onEditUser(row: unknown) {
    const u = row as User;
    this.editingUserId.set(u.id);
    this.userDialogVisible.set(true);
  }

  onDeleteUser(row: unknown) {
    const u = row as User;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление пользователя',
      message: `Удалить пользователя «${u.displayName}» (${u.username})?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        await firstValueFrom(this.userSvc.delete(u.id));
        this.notification.success(`Пользователь «${u.displayName}» удалён`);
        this.loadUsers();
      },
    });
  }

  onDeleteRole(row: unknown) {
    const r = row as RoleDef;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление роли',
      message: `Удалить роль «${r.name}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        await firstValueFrom(this.roleSvc.delete(r.id));
        this.notification.success(`Роль «${r.name}» удалена`);
        this.loadRoles();
      },
    });
  }

  closeUserDialog() {
    this.userDialogVisible.set(false);
    this.editingUserId.set(null);
  }

  async saveUser() {
    const id = this.editingUserId();

    if (id) {
      await firstValueFrom(this.userSvc.update(id, {
        displayName: this.formDisplayName(),
        email: this.formEmail() || undefined,
        phone: this.formPhone() || undefined,
        role: this.formRole() as User['role'],
      }));
      this.notification.success('Пользователь обновлён');
    } else {
      const role = this.formRole() as User['role'];
      const permMap: Record<string, string[]> = { admin: ['*'], manager: ['sales','references'], production: ['production','references'], storekeeper: ['warehouse'], accountant: ['finance'], viewer: [] };
      await firstValueFrom(this.userSvc.create({
        username: this.formUsername(),
        displayName: this.formDisplayName(),
        email: this.formEmail() || undefined,
        phone: this.formPhone() || undefined,
        role,
        permissions: permMap[role] || [],
        isActive: true,
      }));
      this.notification.success(`Пользователь «${this.formDisplayName()}» создан. Пароль: ${this.formPassword() || '123456'}`);
    }

    this.closeUserDialog();
    this.loadUsers();
  }
}
