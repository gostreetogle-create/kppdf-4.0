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
import { WorkerService } from '../../core/worker.service';
import type { Worker } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-worker-list',
  standalone: true,
  imports: [CommonModule, FormsModule, KpBreadcrumbComponent, KpCardComponent, KpTableComponent, KpToastComponent],
  providers: [ConfirmationService],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">👷 Работники</h2>
      <kp-table storageKey="workers" [data]="rows()" [columns]="columns" [rows]="20" [paginator]="true" [sortField]="'lastName'" [sortOrder]="1" emptyMessage="Нет работников" [showActions]="true" (rowEdit)="onEdit($event)" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styles: [`:host { display: block; max-width: 1000px; margin: 0 auto; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkerListComponent implements OnInit {
  private svc = inject(WorkerService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  rows = signal<Worker[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '🏭 Производство' }, { label: 'Работники' }];
  columns: TableColumn[] = [
    { field: 'lastName', header: 'Фамилия', sortable: true },
    { field: 'firstName', header: 'Имя', sortable: true },
    { field: 'grade', header: 'Разряд', width: '100px', type: 'number' },
    { field: 'ratePerHour', header: 'Ставка ₽/ч', width: '120px', type: 'number' },
  ];
  ngOnInit() { this.load(); }
  async load() { const r = await firstValueFrom(this.svc.getAll()); this.rows.set(r.data); }
  onEdit(row: unknown) { this.notification.info('Редактирование: ' + (row as Worker).lastName); }
  onDelete(row: unknown) {
    const w = row as Worker;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление работника',
      message: `Вы уверены, что хотите удалить работника «${w.lastName}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.svc.delete(w.id));
        if (res.success) {
          this.notification.success('Работник удалён');
          this.load();
        } else {
          this.notification.error(res.message || 'Ошибка удаления');
        }
      },
    });
  }
}
