import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { NotificationService } from '../../core/notification.service';
import { TableTemplateService } from '../../core/table-template.service';
import { TableRegistryService } from '../../core/table-registry.service';
import { ConfirmationService } from 'primeng/api';
import type { TableTemplate, TemplateColumn } from '../../../../shared/types/index.js';

interface TableTemplateRow extends TableTemplate {
  columnsCount: number;
  updatedAtDisplay: string;
}

@Component({
  selector: 'app-table-template-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    KpButtonComponent,
    KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpToastComponent, KpConfirmDialogComponent,
    KpDialogComponent,
  ],
  templateUrl: './table-template-list.component.html',
  styleUrls: ['./table-template-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTemplateListComponent implements OnInit {
  private router = inject(Router);
  private templateService = inject(TableTemplateService);
  private registry = inject(TableRegistryService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  templates = signal<TableTemplateRow[]>([]);
  loading = signal(false);

  /** Preview dialog */
  previewVisible = signal(false);
  previewTemplate = signal<TableTemplate | null>(null);
  previewFields = signal<Record<string, string>>({});
  previewTableLabels = signal<Record<string, string>>({});
  previewLoading = signal(false);

  /** Колонки для kp-table в предпросмотре */
  previewColumns = computed<TableColumn[]>(() => {
    const tmpl = this.previewTemplate();
    const fieldLabels = this.previewFields();
    if (!tmpl) return [];
    return tmpl.columns.map(c => ({
      field: c.fieldName,
      header: c.label || fieldLabels[c.fieldName] || c.fieldName,
      width: c.width || undefined,
    }));
  });

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

  breadcrumbs: MenuItem[] = [
    { label: 'Администрирование', routerLink: '/admin' },
    { label: 'Шаблоны таблиц' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'name', header: 'Название', sortable: true },
    { field: 'columnsCount', header: 'Колонок', width: '100px', type: 'number', sortable: true },
    { field: 'updatedAtDisplay', header: 'Изменён', width: '200px', sortable: true },
  ];

  async ngOnInit() {
    await this.loadTemplates();
  }

  async loadTemplates() {
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.templateService.getTemplates());
      this.templates.set(result.data.map(t => ({
        ...t,
        columnsCount: t.columns.length,
        updatedAtDisplay: new Date(t.updatedAt).toLocaleString('ru-RU'),
      })));
    } finally {
      this.loading.set(false);
    }
  }

  onDelete(row: unknown) {
    const tmpl = row as TableTemplateRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление шаблона',
      message: `Вы уверены, что хотите удалить шаблон «${tmpl.name}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const result = await firstValueFrom(this.templateService.deleteTemplate(tmpl.id));
        if (result.success) {
          this.notification.success('Шаблон удалён');
          await this.loadTemplates();
        } else {
          this.notification.error(result.message || 'Ошибка удаления');
        }
      },
    });
  }

  onEditRow(row: unknown) {
    const tmpl = row as TableTemplateRow;
    this.router.navigate(['/admin/table-templates', tmpl.id, 'edit']);
  }

  onViewRow(row: unknown) {
    const tmpl = row as TableTemplateRow;
    this.openPreview(tmpl);
  }

  async openPreview(tmpl: TableTemplateRow) {
    this.previewTemplate.set(tmpl);
    this.previewLoading.set(true);
    this.previewVisible.set(true);

    try {
      const result = await firstValueFrom(this.templateService.getTemplate(tmpl.id));
      if (result.success && result.data) {
        const fullTemplate = result.data;
        this.previewTemplate.set(fullTemplate);

        // Собираем метаданные полей и названия таблиц из реестра
        const tableNames = [...new Set(fullTemplate.columns.map(c => c.tableName))];
        const fieldLabels: Record<string, string> = {};
        const tableLabels: Record<string, string> = {};
        for (const tableName of tableNames) {
          const table = await firstValueFrom(this.registry.getTable(tableName));
          if (table) {
            tableLabels[tableName] = table.label;
            for (const field of table.fields) {
              fieldLabels[field.name] = field.label;
            }
          }
        }
        this.previewFields.set(fieldLabels);
        this.previewTableLabels.set(tableLabels);
      }
    } catch {
      this.notification.error('Не удалось загрузить шаблон');
      this.previewVisible.set(false);
    } finally {
      this.previewLoading.set(false);
    }
  }

  getFieldLabel(col: TemplateColumn): string {
    return col.label || this.previewFields()[col.fieldName] || col.fieldName;
  }

  getTableNames(tmpl: TableTemplate): string {
    const labels = this.previewTableLabels();
    return [...new Set(tmpl.columns.map(c => c.tableName))]
      .map(name => labels[name] || name)
      .join(', ');
  }

  async onClone(row: unknown) {
    const tmpl = row as TableTemplateRow;
    const result = await firstValueFrom(this.templateService.cloneTemplate(tmpl.id));
    if (result.success) {
      this.notification.success('Шаблон склонирован');
      await this.loadTemplates();
    } else {
      this.notification.error(result.message || 'Ошибка клонирования');
    }
  }
}
