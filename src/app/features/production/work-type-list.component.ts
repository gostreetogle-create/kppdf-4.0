import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';
import { NotificationService } from '../../core/notification.service';
import { WorkTypeService } from '../../core/work-type.service';
import type { WorkType } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-work-type-list',
  standalone: true,
  imports: [CommonModule, FormsModule, KpBreadcrumbComponent, KpCardComponent, KpTableComponent, KpToastComponent  ],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">🔧 Виды работ</h2>
      <kp-table storageKey="work-types" [data]="rows()" [columns]="columns" [rows]="20" [paginator]="true" [sortField]="'name'" [sortOrder]="1" emptyMessage="Виды работ не найдены" [showActions]="true" (rowEdit)="onEdit($event)" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styleUrl: './work-type-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkTypeListComponent implements OnInit {
  private svc = inject(WorkTypeService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  rows = signal<WorkType[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '🏭 Производство' }, { label: 'Виды работ' }];
  columns: TableColumn[] = [
    { field: 'name', header: 'Название', sortable: true },
    { field: 'department', header: 'Отдел', width: '150px' },
    { field: 'defaultDurationHours', header: 'Нормо-часы', width: '120px', type: 'number' },
  ];
  ngOnInit() { this.load(); }
  async load() { const r = await firstValueFrom(this.svc.getAll()); this.rows.set(r.data); }
  onEdit(row: unknown) { this.notification.info('Редактирование: ' + (row as WorkType).name); }
  onDelete(row: unknown) {
    const w = row as WorkType;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление вида работ',
      message: `Вы уверены, что хотите удалить вид работ «${w.name}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.svc.delete(w.id));
        if (res.success) {
          this.notification.success('Вид работ удалён');
          this.load();
        } else {
          this.notification.error(res.message || 'Ошибка удаления');
        }
      },
    });
  }
}
