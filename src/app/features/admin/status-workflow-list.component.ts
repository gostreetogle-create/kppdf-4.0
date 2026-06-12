import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { StatusWorkflowService } from '../../core/status-workflow.service';
import type { StatusWorkflow } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-status-workflow-list',
  standalone: true,
  imports: [CommonModule, KpCardComponent, KpBreadcrumbComponent, KpTableComponent, KpToastComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">📊 Статусные модели</h2>
      <kp-table storageKey="status-workflows" [data]="rows()" [columns]="columns" [rows]="20" emptyMessage="Модели не найдены" [showActions]="true" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styles: [`:host { display: block; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusWorkflowListComponent implements OnInit {
  private svc = inject(StatusWorkflowService);
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
  async onDelete(row: unknown) { const w = row as StatusWorkflow; if (confirm(`Удалить «${w.name}»?`)) { await firstValueFrom(this.svc.delete(w.id)); this.load(); } }
}
