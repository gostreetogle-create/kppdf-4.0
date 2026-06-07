import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';
import { WorkTypeService } from '../../core/work-type.service';
import type { WorkType } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-work-type-list',
  standalone: true,
  imports: [CommonModule, FormsModule, KpButtonComponent, KpBreadcrumbComponent, KpCardComponent, KpTableComponent, KpToastComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">🔧 Виды работ</h2>
      <kp-table storageKey="work-types" [data]="rows()" [columns]="columns" [rows]="20" [paginator]="true" [sortField]="'name'" [sortOrder]="1" emptyMessage="Виды работ не найдены" [showActions]="true" (rowEdit)="onEdit($event)" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styles: [`:host { display: block; max-width: 1000px; margin: 0 auto; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkTypeListComponent {
  private svc = inject(WorkTypeService);
  private notification = inject(NotificationService);
  rows = signal<WorkType[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '🏭 Производство' }, { label: 'Виды работ' }];
  columns: TableColumn[] = [
    { field: 'name', header: 'Название', sortable: true },
    { field: 'department', header: 'Отдел', width: '150px' },
    { field: 'defaultDurationHours', header: 'Нормо-часы', width: '120px', type: 'number' },
  ];
  constructor() { this.load(); }
  async load() { const r = await firstValueFrom(this.svc.getAll()); this.rows.set(r.data); }
  onEdit(row: unknown) { this.notification.info('Редактирование: ' + (row as WorkType).name); }
  onDelete(row: unknown) { const w = row as WorkType; if (confirm(`Удалить «${w.name}»?`)) { this.svc.delete(w.id).subscribe(() => this.load()); } }
}
