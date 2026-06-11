import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
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
import { KpToggleComponent } from '../../shared/ui/kp-toggle.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';

import { NotificationService } from '../../core/notification.service';
import { DocTypeService } from '../../core/doc-type.service';
import { ConfirmationService } from 'primeng/api';
import type { DocTypeDef } from '../../../../shared/types/index.js';

interface DocTypeRow extends DocTypeDef {
  statusLabel: string;
}

@Component({
  selector: 'app-doc-type-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpDialogComponent, KpInputComponent,
    KpToggleComponent, KpToastComponent,
  ],
  providers: [ConfirmationService],
  template: `
    <kp-toast />

    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="dt-list__header">
        <h2 class="dt-list__title">Типы документов</h2>
        <kp-button label="+ Добавить тип" lucideIcon="plus" (buttonClick)="openAddDialog()" />
      </div>

      <kp-table
        storageKey="doc-types"
        [data]="rows()"
        [columns]="tableColumns"
        [rows]="20"
        [paginator]="true"
        [sortField]="'name'"
        [sortOrder]="1"
        [searchFields]="['name', 'slug', 'description']"
        emptyMessage="Нет типов документов"
        [showActions]="true"
        (rowEdit)="onEditRow($event)"
        (rowDelete)="onDelete($event)"
      />
    </kp-card>

    <!-- Диалог добавления/редактирования -->
    <kp-dialog
      [header]="editId() ? 'Редактировать тип документа' : 'Добавить тип документа'"
      [(visible)]="dialogVisible"
      width="500px"
    >
      <div class="dt-list__form">
        <kp-input
          label="Название"
          placeholder="Например: Акт выполненных работ"
          [(ngModel)]="editName"
          [error]="nameError()"
        />
        <kp-input
          label="Системный ключ (slug)"
          placeholder="Автоматически из названия"
          [(ngModel)]="editSlug"
        />
        <small class="dt-list__hint">Английскими буквами, без пробелов. Используется в коде и шаблонах для идентификации типа документа.</small>
        <kp-input
          label="Описание"
          placeholder="Необязательное описание"
          [(ngModel)]="editDescription"
        />
        <kp-toggle
          label="Активен"
          [(ngModel)]="editIsActive"
        />
      </div>
      <div class="dt-list__dialog-footer">
        <kp-button label="Сохранить" lucideIcon="check" [loading]="saving()" (buttonClick)="save()" />
        <kp-button label="Отмена" lucideIcon="x" severity="secondary" (buttonClick)="dialogVisible.set(false)" />
      </div>
    </kp-dialog>
  `,
  styles: [`
    :host { display: block; max-width: 900px; margin: 0 auto; padding: var(--space-6); }
    .dt-list__header {
      display: flex; align-items: center; justify-content: space-between; margin: var(--space-4) 0;
    }
    .dt-list__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-text); margin: 0; }
    .dt-list__form { display: flex; flex-direction: column; gap: var(--space-4); }
    .dt-list__dialog-footer { display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-4); }
    .dt-list__hint { color: var(--color-text-muted); font-size: 0.75rem; margin-top: -8px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocTypeListComponent {
  private docTypeService = inject(DocTypeService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  rows = signal<DocTypeRow[]>([]);
  loading = signal(false);
  saving = signal(false);

  dialogVisible = signal(false);
  editId = signal<string | null>(null);
  editName = signal('');
  editSlug = signal('');
  editDescription = signal('');
  editIsActive = signal(true);
  nameError = signal('');

  breadcrumbs: MenuItem[] = [
    { label: 'Справочники', routerLink: '/references' },
    { label: 'Типы документов' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'name', header: 'Название', sortable: true },
    { field: 'slug', header: 'Системный ключ', width: '200px', sortable: true },
    { field: 'description', header: 'Описание' },
    { field: 'statusLabel', header: 'Статус', width: '120px', type: 'badge' },
  ];

  constructor() {
    this.load();
  }

  async load() {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.docTypeService.getDocTypes());
      this.rows.set(res.data.map(t => ({ ...t, statusLabel: t.isActive ? 'Активен' : 'Неактивен' })));
    } finally {
      this.loading.set(false);
    }
  }

  openAddDialog() {
    this.editId.set(null);
    this.editName.set('');
    this.editSlug.set('');
    this.editDescription.set('');
    this.editIsActive.set(true);
    this.nameError.set('');
    this.dialogVisible.set(true);
  }

  onEditRow(row: unknown) {
    const item = row as DocTypeRow;
    this.editId.set(item.id);
    this.editName.set(item.name);
    this.editSlug.set(item.slug);
    this.editDescription.set(item.description ?? '');
    this.editIsActive.set(item.isActive);
    this.nameError.set('');
    this.dialogVisible.set(true);
  }

  onDelete(row: unknown) {
    const item = row as DocTypeRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление типа документа',
      message: `Вы уверены, что хотите удалить тип «${item.name}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.docTypeService.deleteDocType(item.id));
        if (res.success) {
          this.notification.success('Тип документа удалён');
          this.load();
        } else {
          this.notification.error(res.message || 'Ошибка удаления');
        }
      },
    });
  }

  async save() {
    if (!this.editName().trim()) {
      this.nameError.set('Название обязательно');
      return;
    }
    this.nameError.set('');
    this.saving.set(true);

    try {
      const data = {
        name: this.editName().trim(),
        slug: this.editSlug().trim() || this.editName().trim().toLowerCase().replace(/[^a-zа-яё0-9]+/g, '_').replace(/^_|_$/g, ''),
        description: this.editDescription().trim() || undefined,
        isActive: this.editIsActive(),
      };

      if (this.editId()) {
        await firstValueFrom(this.docTypeService.updateDocType(this.editId()!, data));
        this.notification.success('Тип документа обновлён');
      } else {
        await firstValueFrom(this.docTypeService.createDocType(data));
        this.notification.success('Тип документа создан');
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
