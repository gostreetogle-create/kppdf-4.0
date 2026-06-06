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
import { ProductCategoryService } from '../../core/product-category.service';
import { ConfirmationService } from 'primeng/api';
import type { ProductCategory } from '../../../../shared/types/index.js';

interface CategoryRow extends ProductCategory {
  statusLabel: string;
}

@Component({
  selector: 'app-product-category-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpDialogComponent, KpInputComponent,
    KpToggleComponent, KpToastComponent, KpConfirmDialogComponent,
  ],
  providers: [ConfirmationService],
  template: `
    <kp-toast />

    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="pc-list__header">
        <h2 class="pc-list__title">Категории товаров</h2>
        <kp-button label="+ Добавить категорию" lucideIcon="plus" (buttonClick)="openAddDialog()" />
      </div>

      <kp-table
        storageKey="product-categories"
        [data]="rows()"
        [columns]="tableColumns"
        [rows]="20"
        [paginator]="true"
        [sortField]="'sortOrder'"
        [sortOrder]="1"
        [searchFields]="['name', 'prefix', 'description']"
        emptyMessage="Нет категорий"
        [showActions]="true"
        (rowEdit)="onEditRow($event)"
        (rowDelete)="onDelete($event)"
      />
    </kp-card>

    <kp-dialog
      [header]="editId() ? 'Редактировать категорию' : 'Добавить категорию'"
      [visible]="dialogVisible()"
      (visibleChange)="dialogVisible.set($event)"
      width="500px"
    >
      <div class="pc-list__form">
        <kp-input label="Название" placeholder="Например: Спортивное оборудование" [(ngModel)]="editName" [error]="nameError()" />
        <kp-input label="Префикс артикула" placeholder="SP, MF, OG..." [(ngModel)]="editPrefix" [error]="prefixError()" maxlength="4" />
        <kp-input label="Описание" placeholder="Необязательно" [(ngModel)]="editDescription" />
        <kp-input label="Порядок сортировки" type="number" [(ngModel)]="editSortOrder" />
        <kp-toggle label="Активна" [(ngModel)]="editIsActive" />
      </div>
      <div class="pc-list__dialog-footer">
        <kp-button label="Сохранить" lucideIcon="check" [loading]="saving()" (buttonClick)="save()" />
        <kp-button label="Отмена" lucideIcon="x" severity="secondary" (buttonClick)="dialogVisible.set(false)" />
      </div>
    </kp-dialog>
  `,
  styles: [`
    :host { display: block; max-width: 900px; margin: 0 auto; padding: var(--space-6); }
    .pc-list__header { display: flex; align-items: center; justify-content: space-between; margin: var(--space-4) 0; }
    .pc-list__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-text); margin: 0; }
    .pc-list__form { display: flex; flex-direction: column; gap: var(--space-4); }
    .pc-list__dialog-footer { display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-4); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCategoryListComponent {
  private categoryService = inject(ProductCategoryService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  rows = signal<CategoryRow[]>([]);
  saving = signal(false);

  dialogVisible = signal(false);
  editId = signal<string | null>(null);
  editName = signal('');
  editPrefix = signal('');
  editDescription = signal('');
  editSortOrder = signal(0);
  editIsActive = signal(true);
  nameError = signal('');
  prefixError = signal('');

  breadcrumbs: MenuItem[] = [
    { label: 'Справочники', routerLink: '/references' },
    { label: 'Категории товаров' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'prefix', header: 'Префикс', width: '100px', sortable: true },
    { field: 'name', header: 'Название', sortable: true },
    { field: 'description', header: 'Описание' },
    { field: 'sortOrder', header: 'Порядок', width: '100px', sortable: true },
    { field: 'statusLabel', header: 'Статус', width: '120px', type: 'badge' },
  ];

  constructor() {
    this.load();
  }

  async load() {
    const res = await firstValueFrom(this.categoryService.getAll());
    this.rows.set(res.data.map(c => ({ ...c, statusLabel: c.isActive ? 'Активна' : 'Неактивна' })));
  }

  openAddDialog() {
    this.editId.set(null);
    this.editName.set('');
    this.editPrefix.set('');
    this.editDescription.set('');
    this.editSortOrder.set(0);
    this.editIsActive.set(true);
    this.nameError.set('');
    this.prefixError.set('');
    this.dialogVisible.set(true);
  }

  onEditRow(row: unknown) {
    const item = row as CategoryRow;
    this.editId.set(item.id);
    this.editName.set(item.name);
    this.editPrefix.set(item.prefix);
    this.editDescription.set(item.description ?? '');
    this.editSortOrder.set(item.sortOrder);
    this.editIsActive.set(item.isActive);
    this.nameError.set('');
    this.prefixError.set('');
    this.dialogVisible.set(true);
  }

  onDelete(row: unknown) {
    const item = row as CategoryRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление категории',
      message: `Вы уверены, что хотите удалить категорию «${item.name}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.categoryService.delete(item.id));
        if (res.success) {
          this.notification.success('Категория удалена');
          this.load();
        } else {
          this.notification.error(res.message || 'Ошибка удаления');
        }
      },
    });
  }

  async save() {
    if (!this.editName().trim()) { this.nameError.set('Название обязательно'); return; }
    if (!this.editPrefix().trim()) { this.prefixError.set('Префикс обязателен'); return; }
    this.nameError.set('');
    this.prefixError.set('');
    this.saving.set(true);

    try {
      const data = {
        name: this.editName().trim(),
        prefix: this.editPrefix().trim().toUpperCase(),
        description: this.editDescription().trim() || undefined,
        sortOrder: this.editSortOrder(),
        isActive: this.editIsActive(),
      };

      if (this.editId()) {
        await firstValueFrom(this.categoryService.update(this.editId()!, data));
        this.notification.success('Категория обновлена');
      } else {
        await firstValueFrom(this.categoryService.create(data as any));
        this.notification.success('Категория создана');
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
