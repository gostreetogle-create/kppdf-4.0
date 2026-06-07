import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';
import { WorkCenterService } from '../../core/work-center.service';
import type { WorkCenter } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-work-center-list',
  standalone: true,
  imports: [CommonModule, FormsModule, KpBreadcrumbComponent, KpCardComponent, KpTableComponent, KpToastComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">🖥️ Рабочие центры</h2>
      <kp-table storageKey="work-centers" [data]="rows()" [columns]="columns" [rows]="20" [paginator]="true" [sortField]="'name'" [sortOrder]="1" emptyMessage="Не найдены" [showActions]="true" (rowEdit)="onEdit($event)" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styles: [`:host { display: block; max-width: 1000px; margin: 0 auto; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkCenterListComponent {
  private svc = inject(WorkCenterService);
  private notification = inject(NotificationService);
  rows = signal<WorkCenter[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '🏭 Производство' }, { label: 'Рабочие центры' }];
  columns: TableColumn[] = [
    { field: 'name', header: 'Название', sortable: true },
    { field: 'type', header: 'Тип', width: '120px' },
    { field: 'description', header: 'Описание' },
  ];
  constructor() { this.load(); }
  async load() { const r = await firstValueFrom(this.svc.getAll()); this.rows.set(r.data); }
  onEdit(row: unknown) { this.notification.info('Редактирование: ' + (row as WorkCenter).name); }
  onDelete(row: unknown) { const w = row as WorkCenter; if (confirm(`Удалить «${w.name}»?`)) { this.svc.delete(w.id).subscribe(() => this.load()); } }
}
