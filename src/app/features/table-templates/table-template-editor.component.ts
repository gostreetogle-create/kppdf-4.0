import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { LucideDynamicIcon } from '@lucide/angular';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent, SelectOption } from '../../shared/ui/kp-select.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { NotificationService } from '../../core/notification.service';
import { TableRegistryService } from '../../core/table-registry.service';
import { TableTemplateService } from '../../core/table-template.service';
import type { TableMeta, TemplateColumn } from '../../../../shared/types/index.js';

function colId(): string {
  return Math.random().toString(36).slice(2, 10);
}

interface EditableColumn {
  uid: string;
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
    CommonModule, FormsModule, DragDropModule,
    KpInputComponent, KpSelectComponent, KpButtonComponent,
    KpBreadcrumbComponent, KpCardComponent, KpToastComponent,
    KpDialogComponent, KpTableComponent, LucideDynamicIcon,
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
  selectedTable = signal('');
  tableError = signal('');
  columns = signal<EditableColumn[]>([]);
  loading = signal(false);
  saving = signal(false);

  previewVisible = signal(false);

  /** Колонки для kp-table в предпросмотре (только с выбранным полем) */
  previewColumns = computed<TableColumn[]>(() =>
    this.columns()
      .filter(c => !!c.fieldName)
      .map(c => ({
        field: c.fieldName,
        header: c.label || this.getFieldLabel(c.fieldName) || c.fieldName,
        width: c.width || undefined,
      }))
  );

  /** Фейковые данные для предпросмотра (1 строка с плейсхолдерами) */
  previewData = computed<Record<string, string>[]>(() => {
    const cols = this.previewColumns();
    if (cols.length === 0) return [];
    const row: Record<string, string> = {};
    for (const col of cols) {
      row[col.field] = '{{' + col.field + '}}';
    }
    return [row];
  });

  tableOptions = computed<SelectOption[]>(() =>
    this.tables().map(t => ({ value: t.name, label: t.label }))
  );

  fieldOptions = computed<SelectOption[]>(() => {
    const table = this.tables().find(t => t.name === this.selectedTable());
    return table?.fields.map(f => ({ value: f.name, label: f.label })) ?? [];
  });


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

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isNew.set(false);
        this.templateId.set(id);
        const result = await firstValueFrom(this.templateService.getTemplate(id));
        if (result.success && result.data) {
          const tmpl = result.data;
          this.templateName.set(tmpl.name);
          if (tmpl.columns.length > 0) {
            this.selectedTable.set(tmpl.columns[0].tableName);
          }
          this.columns.set(tmpl.columns.map((c, i) => this.columnToEditable(c, i)));
          this.breadcrumbs[2] = { label: tmpl.name };
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
      uid: colId(),
      fieldName: c.fieldName,
      label: c.label,
      width: c.width ?? '',
      order: c.order ?? index,
      errors: {},
    };
  }

  onTableSelect(tableName: string) {
    this.selectedTable.set(tableName);
    this.tableError.set('');
    if (this.isNew()) {
      this.columns.set([]);
      // Подставляем название таблицы как имя шаблона (если ещё не ввели вручную)
      const table = this.tables().find(t => t.name === tableName);
      if (table && !this.templateName().trim()) {
        this.templateName.set(table.label);
      }
    }
  }

  public getFieldLabel(fieldName: string): string {
    const table = this.tables().find(t => t.name === this.selectedTable());
    return table?.fields.find(f => f.name === fieldName)?.label ?? fieldName;
  }

  addColumn() {
    if (!this.selectedTable()) {
      this.tableError.set('Сначала выберите таблицу');
      return;
    }
    this.columns.update(cols => [
      ...cols,
      {
        uid: colId(),
        fieldName: '',
        label: '',
        width: '',
        order: cols.length,
        errors: {},
      },
    ]);
  }

  /** Drag-and-drop колонок */
  onColumnDrop(event: CdkDragDrop<EditableColumn[]>) {
    if (event.previousIndex === event.currentIndex) return;
    this.columns.update(cols => {
      const arr = [...cols];
      moveItemInArray(arr, event.previousIndex, event.currentIndex);
      return arr;
    });
  }

  /** Предпросмотр таблицы */
  openPreview() {
    if (!this.selectedTable() || this.columns().length === 0) {
      this.notification.info('Добавьте хотя бы одну колонку');
      return;
    }
    this.previewVisible.set(true);
  }

  /** Обновить ширину колонки из предпросмотра */
  onColumnResized(event: { field: string; width: string }) {
    this.columns.update(cols =>
      cols.map(c =>
        c.fieldName === event.field ? { ...c, width: event.width } : c
      )
    );
  }

  removeColumn(index: number) {
    this.columns.update(cols => cols.filter((_, i) => i !== index));
  }

  onFieldChange(index: number, fieldName: string) {
    this.columns.update(cols => {
      const updated = [...cols];
      updated[index] = {
        ...updated[index],
        fieldName,
        label: this.getFieldLabel(fieldName),
        errors: { ...updated[index].errors, fieldName: '' },
      };
      return updated;
    });
  }

  validate(): boolean {
    let valid = true;

    if (!this.templateName().trim()) {
      this.nameError.set('Название обязательно');
      valid = false;
    } else {
      this.nameError.set('');
    }

    if (!this.selectedTable()) {
      this.tableError.set('Выберите таблицу');
      valid = false;
    } else {
      this.tableError.set('');
    }

    if (this.columns().length === 0) {
      this.notification.error('Добавьте хотя бы одну колонку');
      valid = false;
    }

    this.columns.update(cols => cols.map(col => {
      const errors: Record<string, string> = {};
      if (!col.fieldName) {
        errors['fieldName'] = 'Выберите поле';
        valid = false;
      }
      return { ...col, errors };
    }));

    return valid;
  }

  async save() {
    if (!this.validate()) return;

    this.saving.set(true);
    try {
      const tableName = this.selectedTable();
      const data = {
        name: this.templateName().trim(),
        columns: this.columns().map((c, i) => ({
          tableName,
          fieldName: c.fieldName,
          label: c.label || this.getFieldLabel(c.fieldName),
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

  cancel() {
    this.router.navigate(['/admin/table-templates']);
  }
}
