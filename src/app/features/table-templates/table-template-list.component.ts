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
import { TableTemplateService } from '../../core/table-template.service';
import { ConfirmationService } from 'primeng/api';
import type { TableTemplate } from '../../../../shared/types/index.js';

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
  ],
  templateUrl: './table-template-list.component.html',
  styleUrls: ['./table-template-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTemplateListComponent implements OnInit {
  private router = inject(Router);
  private templateService = inject(TableTemplateService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  templates = signal<TableTemplateRow[]>([]);
  loading = signal(false);

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
