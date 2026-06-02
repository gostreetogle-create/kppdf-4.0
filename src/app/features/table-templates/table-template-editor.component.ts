import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent, SelectOption } from '../../shared/ui/kp-select.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';
import { TableRegistryService } from '../../core/table-registry.service';
import { TableTemplateService } from '../../core/table-template.service';
import type { TableMeta, TableField, TableTemplate, TemplateColumn } from '../../../../shared/types/index.js';

interface EditableColumn {
  tableName: string;
  fieldName: string;
  label: string;
  width: string;
  order: number;
  errors: Record<string, string>;
}

@Component({
  selector: 'app-table-template-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpInputComponent, KpSelectComponent, KpButtonComponent,
    KpBreadcrumbComponent, KpCardComponent, KpToastComponent,
  ],
  templateUrl: './table-template-editor.component.html',
  styleUrls: ['./table-template-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTemplateEditorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private registry = inject(TableRegistryService);
  private templateService = inject(TableTemplateService);
  private notification = inject(NotificationService);

  isNew = signal(true);
  templateId = signal<string | null>(null);
  templateName = signal('');
  nameError = signal('');

  tables = signal<TableMeta[]>([]);
  columns = signal<EditableColumn[]>([]);
  loading = signal(false);
  saving = signal(false);
  tableOptions = signal<SelectOption[]>([]);

  breadcrumbs: MenuItem[] = [
    { label: 'Администрирование', routerLink: '/admin' },
    { label: 'Шаблоны таблиц', routerLink: '/admin/table-templates' },
    { label: 'Новый шаблон' },
  ];

  async ngOnInit() {
    this.loading.set(true);
    try {
      const tables = await firstValueFrom(this.registry.getTables());
      this.tables.set(tables);
      this.tableOptions.set(tables.map(t => ({ value: t.name, label: t.label })));

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isNew.set(false);
        this.templateId.set(id);
        const result = await firstValueFrom(this.templateService.getTemplate(id));
        if (result.success && result.data) {
          this.templateName.set(result.data.name);
          this.columns.set(result.data.columns.map((c, i) => this.columnToEditable(c, i)));
          this.breadcrumbs[2] = { label: result.data.name };
        } else {
          this.notification.error('Шаблон не найден');
          this.router.navigate(['/admin/table-templates']);
        }
      }
    } finally {
      this.loading.set(false);
    }
  }

  private columnToEditable(c: TemplateColumn, index: number): EditableColumn {
    return {
      tableName: c.tableName,
      fieldName: c.fieldName,
      label: c.label,
      width: c.width ?? '',
      order: c.order ?? index,
      errors: {},
    };
  }

  /** Получить список полей для выбранной таблицы */
  getFieldOptions(tableName: string): SelectOption[] {
    const table = this.tables().find(t => t.name === tableName);
    return table?.fields.map(f => ({ value: f.name, label: f.label })) ?? [];
  }

  /** Добавить новую колонку */
  addColumn() {
    this.columns.update(cols => [
      ...cols,
      {
        tableName: '',
        fieldName: '',
        label: '',
        width: '',
        order: cols.length,
        errors: {},
      },
    ]);
  }

  /** Удалить колонку */
  removeColumn(index: number) {
    this.columns.update(cols => cols.filter((_, i) => i !== index));
  }

  /** Переместить колонку вверх */
  moveUp(index: number) {
    if (index === 0) return;
    this.columns.update(cols => {
      const arr = [...cols];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  }

  /** Переместить колонку вниз */
  moveDown(index: number) {
    if (index >= this.columns().length - 1) return;
    this.columns.update(cols => {
      const arr = [...cols];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  }

  /** При выборе таблицы — очищаем поле */
  onTableChange(index: number, tableName: string) {
    this.columns.update(cols => {
      const updated = [...cols];
      updated[index] = {
        ...updated[index],
        tableName,
        fieldName: '',
        label: '',
        errors: { ...updated[index].errors, tableName: '', fieldName: '' },
      };
      return updated;
    });
  }

  /** При выборе поля — авто-заполняем заголовок */
  onFieldChange(index: number, fieldName: string) {
    this.columns.update(cols => {
      const updated = [...cols];
      const table = this.tables().find(t => t.name === updated[index].tableName);
      const field = table?.fields.find(f => f.name === fieldName);
      updated[index] = {
        ...updated[index],
        fieldName,
        label: field?.label ?? updated[index].label,
        errors: { ...updated[index].errors, fieldName: '' },
      };
      return updated;
    });
  }

  /** Валидация */
  validate(): boolean {
    let valid = true;

    if (!this.templateName().trim()) {
      this.nameError.set('Название обязательно');
      valid = false;
    } else {
      this.nameError.set('');
    }

    if (this.columns().length === 0) {
      this.notification.error('Добавьте хотя бы одну колонку');
      valid = false;
    }

    this.columns.update(cols => cols.map((col, i) => {
      const errors: Record<string, string> = {};
      if (!col.tableName) {
        errors['tableName'] = 'Выберите таблицу';
        valid = false;
      }
      if (!col.fieldName) {
        errors['fieldName'] = 'Выберите поле';
        valid = false;
      }
      return { ...col, errors };
    }));

    return valid;
  }

  /** Сохранить */
  async save() {
    if (!this.validate()) return;

    this.saving.set(true);
    try {
      const data = {
        name: this.templateName().trim(),
        columns: this.columns().map((c, i) => ({
          tableName: c.tableName,
          fieldName: c.fieldName,
          label: c.label || this.getFieldLabel(c.tableName, c.fieldName),
          width: c.width || undefined,
          order: i,
        })),
      };

      if (this.isNew()) {
        await firstValueFrom(this.templateService.createTemplate(data));
        this.notification.success('Шаблон создан');
      } else {
        await firstValueFrom(this.templateService.updateTemplate(this.templateId()!, data));
        this.notification.success('Шаблон сохранён');
      }

      this.router.navigate(['/admin/table-templates']);
    } catch {
      this.notification.error('Ошибка сохранения');
    } finally {
      this.saving.set(false);
    }
  }

  private getFieldLabel(tableName: string, fieldName: string): string {
    const table = this.tables().find(t => t.name === tableName);
    return table?.fields.find(f => f.name === fieldName)?.label ?? fieldName;
  }

  cancel() {
    this.router.navigate(['/admin/table-templates']);
  }
}
