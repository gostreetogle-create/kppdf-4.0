import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';
import { NotificationService } from '../../core/notification.service';
import { StatusWorkflowService } from '../../core/status-workflow.service';
import { ConfirmationService } from 'primeng/api';
import type { StatusWorkflow } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-status-workflow-list',
  standalone: true,
  imports: [CommonModule, KpCardComponent, KpBreadcrumbComponent, KpTableComponent, KpToastComponent  ],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">📊 Статусные модели</h2>
      <kp-table storageKey="status-workflows" [data]="rows()" [columns]="columns" [rows]="20" emptyMessage="Модели не найдены" [showActions]="true" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styleUrl: './status-workflow-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusWorkflowListComponent implements OnInit {
  private svc = inject(StatusWorkflowService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  rows = signal<StatusWorkflow[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '⚙️ Администрирование' }, { label: 'Статусные модели' }];
  columns: TableColumn[] = [
    { field: 'entityType', header: 'Сущность', sortable: true },
    { field: 'name', header: 'Название' },
    { field: 'statusCount', header: 'Статусов', width: '90px', type: 'number' },
    { field: 'transitionCount', header: 'Переходов', width: '100px', type: 'number' },
  ];

  ngOnInit() { this.load(); }
  async load() {
    const r = await firstValueFrom(this.svc.getAll());
    this.rows.set(r.data.map(w => ({ ...w, statusCount: w.statuses.length, transitionCount: w.transitions.length } as StatusWorkflow & { statusCount: number; transitionCount: number })));
  }
  async onDelete(row: unknown) { const w = row as StatusWorkflow; KpConfirmDialogComponent.confirm(this.confirmationService, { header: 'Удаление', message: `Удалить «${w.name}»?`, acceptLabel: 'Удалить', rejectLabel: 'Отмена', accept: async () => { await firstValueFrom(this.svc.delete(w.id)); this.notification.success('Модель удалена'); this.load(); } }); }
}
