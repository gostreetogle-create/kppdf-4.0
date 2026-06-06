import { Component, inject, signal, viewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { KpDocPreviewDialogComponent } from '../../shared/ui/kp-doc-preview-dialog.component';
import { NotificationService } from '../../core/notification.service';
import { DocumentTemplateService } from '../../core/document-template.service';
import { ConfirmationService } from 'primeng/api';
import type { DocumentTemplate } from '../../../../shared/types/index.js';

interface DocTemplateRow extends DocumentTemplate {
  blocksCount: number;
  updatedAtDisplay: string;
  docTypeLabel: string;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  quotation: 'КП',
  contract: 'Договор',
  invoice: 'Счёт',
  shipping: 'Отгрузка',
};

@Component({
  selector: 'app-document-template-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpToastComponent, KpConfirmDialogComponent, KpDocPreviewDialogComponent,
  ],
  templateUrl: './document-template-list.component.html',
  styleUrls: ['./document-template-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTemplateListComponent implements OnInit {
  private router = inject(Router);
  private templateService = inject(DocumentTemplateService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  templates = signal<DocTemplateRow[]>([]);
  loading = signal(false);

  previewDialog = viewChild(KpDocPreviewDialogComponent);

  breadcrumbs: MenuItem[] = [
    { label: 'Администрирование', routerLink: '/admin' },
    { label: 'Шаблоны документов' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'name', header: 'Название', sortable: true },
    { field: 'docTypeLabel', header: 'Тип', width: '120px', sortable: true },
    { field: 'blocksCount', header: 'Блоков', width: '100px', type: 'number', sortable: true },
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
        blocksCount: t.blocks.length,
        updatedAtDisplay: new Date(t.updatedAt).toLocaleString('ru-RU'),
        docTypeLabel: DOC_TYPE_LABELS[t.docType] ?? t.docType,
      })));
    } finally {
      this.loading.set(false);
    }
  }

  onEditRow(row: unknown) {
    const tmpl = row as DocTemplateRow;
    this.router.navigate(['/admin/document-templates', tmpl.id, 'edit']);
  }

  onDelete(row: unknown) {
    const tmpl = row as DocTemplateRow;
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

  async onClone(row: unknown) {
    const tmpl = row as DocTemplateRow;
    const result = await firstValueFrom(this.templateService.cloneTemplate(tmpl.id));
    if (result.success) {
      this.notification.success('Шаблон склонирован');
      await this.loadTemplates();
    } else {
      this.notification.error(result.message || 'Ошибка клонирования');
    }
  }

  onViewRow(row: unknown) {
    const tmpl = row as DocTemplateRow;
    this.previewDialog()?.open(
      tmpl.name,
      tmpl.docType,
      tmpl.blocks,
    );
  }
}
