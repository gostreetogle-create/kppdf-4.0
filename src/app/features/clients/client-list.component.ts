import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpToggleComponent } from '../../shared/ui/kp-toggle.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';

import { NotificationService } from '../../core/notification.service';
import { ClientService } from '../../core/client.service';
import { OrganizationService } from '../../core/organization.service';
import { ConfirmationService } from 'primeng/api';
import type { Client, Organization } from '../../../../shared/types/index.js';

interface ClientRow extends Client {
  fullName: string;
  organizationName: string;
  statusLabel: string;
}

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpDialogComponent, KpInputComponent,
    KpSelectComponent, KpToggleComponent, KpToastComponent,
  ],
  providers: [ConfirmationService],
  template: `
    <kp-toast />

    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="cl-list__header">
        <h2 class="cl-list__title">👤 Клиенты (физ.лица)</h2>
        <kp-button label="+ Добавить клиента" lucideIcon="plus" (buttonClick)="openAddDialog()" />
      </div>

      <kp-table
        storageKey="clients"
        [data]="rows()"
        [columns]="tableColumns"
        [rows]="20"
        [paginator]="true"
        [sortField]="'fullName'"
        [sortOrder]="1"
        [searchFields]="['fullName', 'phone', 'email', 'inn']"
        emptyMessage="Нет клиентов"
        [showActions]="true"
        (rowEdit)="onEditRow($event)"
        (rowDelete)="onDelete($event)"
      />
    </kp-card>

    <!-- Диалог добавления/редактирования -->
    <kp-dialog
      [header]="editId() ? 'Редактировать клиента' : 'Добавить клиента'"
      [(visible)]="dialogVisible"
      width="600px"
    >
      <div class="cl-list__form">
        <div class="cl-list__form-row">
          <kp-input label="Фамилия" placeholder="Фамилия" [(ngModel)]="editLastName" [error]="lastNameError()" />
          <kp-input label="Имя" placeholder="Имя" [(ngModel)]="editFirstName" [error]="firstNameError()" />
          <kp-input label="Отчество" placeholder="Отчество" [(ngModel)]="editPatronymic" />
        </div>
        <kp-input label="Телефон" placeholder="+7 (___) ___-__-__" [(ngModel)]="editPhone" [error]="phoneError()" />
        <kp-input label="Email" placeholder="email@example.ru" [(ngModel)]="editEmail" />
        <div class="cl-list__form-row">
          <kp-input label="ИНН" placeholder="12 цифр" [(ngModel)]="editInn" />
          <kp-select
            label="Организация"
            [options]="orgOptions()"
            [(ngModel)]="editOrganizationId"
            placeholder="Не привязан"
          />
        </div>
        <kp-input label="Адрес" placeholder="Адрес" [(ngModel)]="editAddress" />
        <div class="cl-list__form-row">
          <kp-input label="Наценка (%)" type="number" placeholder="0" [(ngModel)]="editMarkupPercent" />
          <kp-toggle label="Активен" name="cl-edit-isActive" [(ngModel)]="editIsActive" />
        </div>
        <kp-input label="Комментарий" placeholder="Заметки о клиенте" [(ngModel)]="editNotes" />
      </div>
      <div class="cl-list__dialog-footer">
        <kp-button label="Сохранить" lucideIcon="check" [loading]="saving()" (buttonClick)="save()" />
        <kp-button label="Отмена" lucideIcon="x" severity="secondary" (buttonClick)="dialogVisible.set(false)" />
      </div>
    </kp-dialog>
  `,
  styles: [`
    :host { display: block; max-width: 1000px; margin: 0 auto; padding: var(--space-6); }
    .cl-list__header {
      display: flex; align-items: center; justify-content: space-between; margin: var(--space-4) 0;
    }
    .cl-list__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-text); margin: 0; }
    .cl-list__form { display: flex; flex-direction: column; gap: var(--space-4); }
    .cl-list__form-row { display: flex; gap: var(--space-3); flex-wrap: wrap; }
    .cl-list__form-row > * { flex: 1; min-width: 140px; }
    .cl-list__dialog-footer { display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-4); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientListComponent {
  private clientService = inject(ClientService);
  private organizationService = inject(OrganizationService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  rows = signal<ClientRow[]>([]);
  organizations = signal<Organization[]>([]);
  loading = signal(false);
  saving = signal(false);

  dialogVisible = signal(false);
  editId = signal<string | null>(null);
  editLastName = signal('');
  editFirstName = signal('');
  editPatronymic = signal('');
  editPhone = signal('');
  editEmail = signal('');
  editInn = signal('');
  editOrganizationId = signal('');
  editAddress = signal('');
  editMarkupPercent = signal<number | null>(null);
  editIsActive = signal(true);
  editNotes = signal('');

  lastNameError = signal('');
  firstNameError = signal('');
  phoneError = signal('');

  breadcrumbs: MenuItem[] = [
    { label: 'Справочники' },
    { label: 'Клиенты (физ.лица)' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'fullName', header: 'ФИО', sortable: true },
    { field: 'phone', header: 'Телефон', width: '160px' },
    { field: 'email', header: 'Email', width: '180px' },
    { field: 'organizationName', header: 'Организация', width: '200px' },
    { field: 'statusLabel', header: 'Статус', width: '110px', type: 'badge' },
  ];

  orgOptions = computed(() => {
    const orgs = this.organizations();
    return [
      { label: 'Не привязан', value: '' },
      ...orgs.filter(o => o.isActive).map(o => ({ label: o.shortName, value: o.id })),
    ];
  });

  constructor() {
    this.load();
  }

  async load() {
    this.loading.set(true);
    try {
      const [cliRes, orgRes] = await Promise.all([
        firstValueFrom(this.clientService.getClients()),
        firstValueFrom(this.organizationService.getAll()),
      ]);
      this.organizations.set(orgRes.data);
      const orgMap = new Map(orgRes.data.map(o => [o.id, o.shortName]));
      this.rows.set(cliRes.data.map(c => ({
        ...c,
        fullName: [c.lastName, c.firstName, c.patronymic].filter(Boolean).join(' '),
        organizationName: c.organizationId ? (orgMap.get(c.organizationId) || '—') : '—',
        statusLabel: c.isActive ? 'Активен' : 'Неактивен',
      })));
    } finally {
      this.loading.set(false);
    }
  }

  openAddDialog() {
    this.editId.set(null);
    this.editLastName.set('');
    this.editFirstName.set('');
    this.editPatronymic.set('');
    this.editPhone.set('');
    this.editEmail.set('');
    this.editInn.set('');
    this.editOrganizationId.set('');
    this.editAddress.set('');
    this.editMarkupPercent.set(null);
    this.editIsActive.set(true);
    this.editNotes.set('');
    this.lastNameError.set('');
    this.firstNameError.set('');
    this.phoneError.set('');
    this.dialogVisible.set(true);
  }

  onEditRow(row: unknown) {
    const item = row as ClientRow;
    this.editId.set(item.id);
    this.editLastName.set(item.lastName);
    this.editFirstName.set(item.firstName);
    this.editPatronymic.set(item.patronymic ?? '');
    this.editPhone.set(item.phone);
    this.editEmail.set(item.email ?? '');
    this.editInn.set(item.inn ?? '');
    this.editOrganizationId.set(item.organizationId ?? '');
    this.editAddress.set(item.address ?? '');
    this.editMarkupPercent.set(item.personalMarkupPercent ?? null);
    this.editIsActive.set(item.isActive);
    this.editNotes.set(item.notes ?? '');
    this.lastNameError.set('');
    this.firstNameError.set('');
    this.phoneError.set('');
    this.dialogVisible.set(true);
  }

  onDelete(row: unknown) {
    const item = row as ClientRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление клиента',
      message: `Вы уверены, что хотите удалить клиента «${item.fullName}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.clientService.deleteClient(item.id));
        if (res.success) {
          this.notification.success('Клиент удалён');
          this.load();
        } else {
          this.notification.error(res.message || 'Ошибка удаления');
        }
      },
    });
  }

  async save() {
    this.lastNameError.set('');
    this.firstNameError.set('');
    this.phoneError.set('');

    if (!this.editLastName().trim()) { this.lastNameError.set('Фамилия обязательна'); return; }
    if (!this.editFirstName().trim()) { this.firstNameError.set('Имя обязательно'); return; }
    if (!this.editPhone().trim()) { this.phoneError.set('Телефон обязателен'); return; }

    this.saving.set(true);
    try {
      const data = {
        lastName: this.editLastName().trim(),
        firstName: this.editFirstName().trim(),
        patronymic: this.editPatronymic().trim() || undefined,
        phone: this.editPhone().trim(),
        email: this.editEmail().trim() || undefined,
        inn: this.editInn().trim() || undefined,
        organizationId: this.editOrganizationId() || undefined,
        address: this.editAddress().trim() || undefined,
        personalMarkupPercent: this.editMarkupPercent() ?? undefined,
        isActive: this.editIsActive(),
        notes: this.editNotes().trim() || undefined,
      };

      if (this.editId()) {
        await firstValueFrom(this.clientService.updateClient(this.editId()!, data));
        this.notification.success('Клиент обновлён');
      } else {
        await firstValueFrom(this.clientService.createClient(data));
        this.notification.success('Клиент создан');
      }

      this.dialogVisible.set(false);
      this.load();
    } catch {
      this.notification.error('Ошибка сохранения');
    } finally {
      this.saving.set(false);
    }
  }
}
