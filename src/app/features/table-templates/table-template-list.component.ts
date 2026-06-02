import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';
import { TableTemplateService } from '../../core/table-template.service';
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
    KpToastComponent,
  ],
  templateUrl: './table-template-list.component.html',
  styleUrls: ['./table-template-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTemplateListComponent implements OnInit {
  private templateService = inject(TableTemplateService);
  private notification = inject(NotificationService);

  templates = signal<TableTemplateRow[]>([]);
  loading = signal(false);

  breadcrumbs: MenuItem[] = [
    { label: 'Администрирование', routerLink: '/admin' },
    { label: 'Шаблоны таблиц' },
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

  async onDelete(row: TableTemplateRow) {
    const result = await firstValueFrom(this.templateService.deleteTemplate(row.id));
    if (result.success) {
      this.notification.success('Шаблон удалён');
      await this.loadTemplates();
    } else {
      this.notification.error(result.message || 'Ошибка удаления');
    }
  }

  async onClone(row: TableTemplateRow) {
    const result = await firstValueFrom(this.templateService.cloneTemplate(row.id));
    if (result.success) {
      this.notification.success('Шаблон склонирован');
      await this.loadTemplates();
    } else {
      this.notification.error(result.message || 'Ошибка клонирования');
    }
  }
}
