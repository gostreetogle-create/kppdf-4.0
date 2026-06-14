import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';

import { NotificationService } from '../../core/notification.service';
import { StorageItemService } from '../../core/storage-item.service';
import { ConfirmationService } from 'primeng/api';
import type { StorageItem } from '../../../../shared/types/index.js';

interface StorageItemRow extends StorageItem {
  updatedAtDisplay: string;
}

@Component({
  selector: 'app-storage-item-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    KpCardComponent, KpButtonComponent, KpBreadcrumbComponent, KpToastComponent,
    KpTableComponent, KpInputComponent, KpDialogComponent,
  ],
  template: `
    <kp-toast />

    <div class="si-list">
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="si-list__header">
        <h2 class="si-list__title">📦 Инвентарь</h2>
        <div class="si-list__header-actions">
          <kp-button
            label="+ Добавить"
            lucideIcon="plus"
            (buttonClick)="openCreateDialog()"
          />
          <kp-button
            label="← Назад к складам"
            severity="secondary"
            routerLink="/warehouse"
          />
        </div>
      </div>

      <kp-card>
        <kp-table
          storageKey="storage-items"
          [data]="rows()"
          [columns]="tableColumns"
          [rows]="20"
          [paginator]="true"
          [searchFields]="['name', 'description', 'notes']"
          [loading]="loading()"
          [showActions]="true"
          emptyMessage="Нет инвентаря"
          (rowEdit)="onEdit($event)"
          (rowDelete)="onDelete($event)"
        />
      </kp-card>

      <!-- Create/Edit Dialog -->
      <kp-dialog
        [header]="editingId ? 'Редактировать' : 'Новый инвентарь'"
        [(visible)]="showDialog"
        width="500px"
        (dialogHide)="showDialog = false"
      >
        <div class="si-list__form">
          <kp-input
            label="Название *"
            [(ngModel)]="formName"
            placeholder="Например: Сварочный аппарат TIG-200"
          />
          <kp-input
            label="Описание"
            [(ngModel)]="formDescription"
            placeholder="Характеристики, состояние..."
          />
          <div class="si-list__form-row">
            <kp-input
              label="Вес (кг)"
              type="number"
              [(ngModel)]="formWeight"
            />
            <kp-input
              label="Габариты"
              [(ngModel)]="formDimensions"
              placeholder="Д×Ш×В мм"
            />
          </div>
          <kp-input
            label="Заметки"
            [(ngModel)]="formNotes"
            placeholder="Где используется, серийный номер..."
          />

          <div class="si-list__form-actions">
            <kp-button
              [label]="editingId ? 'Сохранить' : 'Добавить на склад'"
              lucideIcon="check"
              [loading]="saving()"
              (buttonClick)="save()"
            />
            <kp-button
              label="Отмена"
              severity="secondary"
              (buttonClick)="showDialog = false"
            />
          </div>
        </div>
      </kp-dialog>
    </div>
  `,
  styleUrl: './storage-item-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageItemListComponent implements OnInit {
  private storageItemService = inject(StorageItemService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  rows = signal<StorageItemRow[]>([]);
  loading = signal(false);
  saving = signal(false);

  showDialog = false;
  editingId: string | null = null;
  formName = '';
  formDescription = '';
  formWeight = '';
  formDimensions = '';
  formNotes = '';

  breadcrumbs: MenuItem[] = [
    { label: 'Склад', routerLink: '/warehouse' },
    { label: 'Инвентарь' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'name', header: 'Название', width: 'auto', sortable: true },
    { field: 'dimensions', header: 'Габариты', width: '140px' },
    { field: 'weightKg', header: 'Вес (кг)', width: '90px', type: 'number' },
    { field: 'updatedAtDisplay', header: 'Изменён', width: '170px', sortable: true },
  ];

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.storageItemService.getStorageItems());
      this.rows.set(res.data.map(si => ({
        ...si,
        updatedAtDisplay: new Date(si.updatedAt).toLocaleString('ru-RU'),
      })));
    } finally {
      this.loading.set(false);
    }
  }

  openCreateDialog() {
    this.editingId = null;
    this.formName = '';
    this.formDescription = '';
    this.formWeight = '';
    this.formDimensions = '';
    this.formNotes = '';
    this.showDialog = true;
  }

  onEdit(row: unknown) {
    const item = row as StorageItem;
    this.editingId = item.id;
    this.formName = item.name;
    this.formDescription = item.description || '';
    this.formWeight = item.weightKg?.toString() || '';
    this.formDimensions = item.dimensions || '';
    this.formNotes = item.notes || '';
    this.showDialog = true;
  }

  async save() {
    if (!this.formName.trim()) {
      this.notification.warn('Название обязательно');
      return;
    }
    this.saving.set(true);
    try {
      const data = {
        name: this.formName,
        description: this.formDescription || undefined,
        weightKg: this.formWeight ? Number(this.formWeight) : undefined,
        dimensions: this.formDimensions || undefined,
        notes: this.formNotes || undefined,
        isActive: true,
      };

      if (this.editingId) {
        await firstValueFrom(this.storageItemService.updateStorageItem(this.editingId, data));
        this.notification.success('Инвентарь обновлён');
      } else {
        await firstValueFrom(this.storageItemService.createStorageItem(data));
        this.notification.success('Инвентарь добавлен');
      }
      this.showDialog = false;
      await this.load();
    } catch {
      this.notification.error('Ошибка сохранения');
    } finally {
      this.saving.set(false);
    }
  }

  onDelete(row: unknown) {
    const item = row as StorageItem;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление инвентаря',
      message: `Удалить «${item.name}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.storageItemService.deleteStorageItem(item.id));
        if (res.success) {
          this.notification.success('Инвентарь удалён');
          await this.load();
        } else {
          this.notification.error(res.message || 'Ошибка удаления');
        }
      },
    });
  }
}
