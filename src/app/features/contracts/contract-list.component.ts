import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn, TableExtraAction } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';

import { NotificationService } from '../../core/notification.service';
import { ContractService } from '../../core/contract.service';
import { generateId } from '../../core/crud-factory.js';
import { ConfirmationService } from 'primeng/api';
import type { Contract, ContractStatus } from '../../../../shared/types/index.js';

interface ContractRow extends Contract {
  statusLabel: string;
  itemsCount: number;
  updatedAtDisplay: string;
}

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpToastComponent,
  ],
  template: `
    <kp-toast />

    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="ct-list__header">
        <h2 class="ct-list__title">📑 Договоры</h2>
        <kp-button
          label="+ Новый договор"
          lucideIcon="plus"
          routerLink="/sales/contracts/new"
          [disabled]="loading()"
        />
      </div>

      <kp-table
        storageKey="contracts"
        [data]="rows()"
        [columns]="tableColumns"
        [rows]="20"
        [paginator]="true"
        [sortField]="'number'"
        [sortOrder]="-1"
        [searchFields]="['number', 'notes']"
        emptyMessage="Нет договоров"
        [showActions]="true"
        [loading]="loading()"
        [extraActions]="statusActions"
        (rowView)="onView($event)"
        (rowEdit)="onEditRow($event)"
        (rowDelete)="onDelete($event)"
        (rowClone)="onDuplicate($event)"
        (rowExtraAction)="onStatusChange($event)"
      />
    </kp-card>
  `,
  styleUrl: './contract-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractListComponent {
  private router = inject(Router);
  private contractService = inject(ContractService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  rows = signal<ContractRow[]>([]);
  loading = signal(false);

  statusActions: TableExtraAction[] = [
    {
      icon: 'play',
      severity: 'success',
      tooltip: 'Активировать',
      visible: (row: unknown) => (row as Contract).status === 'draft',
    },
    {
      icon: 'check',
      severity: 'info',
      tooltip: 'Завершить',
      visible: (row: unknown) => (row as Contract).status === 'active',
    },
    {
      icon: 'x',
      severity: 'danger',
      tooltip: 'Расторгнуть',
      visible: (row: unknown) => (row as Contract).status === 'active',
    },
  ];

  breadcrumbs: MenuItem[] = [
    { label: 'Продажи' },
    { label: 'Договоры' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'number', header: 'Номер', width: '110px', sortable: true },
    { field: 'statusLabel', header: 'Статус', width: '120px', type: 'badge' },
    { field: 'itemsCount', header: 'Позиций', width: '90px', type: 'number' },
    { field: 'updatedAtDisplay', header: 'Изменён', width: '170px', sortable: true },
  ];

  constructor() {
    this.load();
  }

  async load() {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.contractService.getContracts());
      this.rows.set(res.data.map(c => ({
        ...c,
        statusLabel: this.statusText(c.status),
        itemsCount: c.items.length,
        updatedAtDisplay: new Date(c.updatedAt).toLocaleString('ru-RU'),
      })));
    } finally {
      this.loading.set(false);
    }
  }

  private statusText(s: string): string {
    const map: Record<string, string> = {
      draft: 'Черновик',
      active: 'Действует',
      completed: 'Завершён',
      terminated: 'Расторгнут',
    };
    return map[s] || s;
  }

  onView(row: unknown) {
    const c = row as Contract;
    this.router.navigate(['/sales/contracts', c.id]);
  }

  onEditRow(row: unknown) {
    const c = row as Contract;
    this.router.navigate(['/sales/contracts', c.id, 'edit']);
  }

  async onDuplicate(row: unknown) {
    const c = row as ContractRow;
    // Создаём копию договора с новыми ID и номером, статус — черновик
    const duplicateData = {
      organizationId: c.organizationId,
      clientId: c.clientId,
      proposalId: c.proposalId,
      status: 'draft' as const,
      notes: c.notes ? `Копия: ${c.notes}` : undefined,
      items: c.items.map(item => ({ ...item, id: generateId() })),
    };

    const res = await firstValueFrom(this.contractService.createContract(duplicateData));
    if (res.success) {
      this.notification.success(`Дубликат «${res.data.number}» создан`);
      this.load();
    } else {
      this.notification.error(res.message || 'Ошибка дублирования');
    }
  }

  async onStatusChange(event: { icon: string; row: unknown }) {
    const c = event.row as Contract;
    const statusMap: Record<string, { status: ContractStatus; label: string }> = {
      play: { status: 'active', label: 'Действует' },
      check: { status: 'completed', label: 'Завершён' },
      x: { status: 'terminated', label: 'Расторгнут' },
    };
    const target = statusMap[event.icon];
    if (!target) return;

    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Смена статуса договора',
      message: `Вы уверены, что хотите изменить статус «${c.number}» на «${target.label}»?`,
      acceptLabel: 'Подтвердить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.contractService.changeStatus(c.id, target.status));
        if (res.success) {
          this.notification.success(`Договор «${c.number}» — ${target.label}`);
          this.load();
        } else {
          this.notification.error(res.message || 'Ошибка смены статуса');
        }
      },
    });
  }

  onDelete(row: unknown) {
    const c = row as ContractRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление договора',
      message: `Вы уверены, что хотите удалить «${c.number}» (${c.statusLabel})?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.contractService.deleteContract(c.id));
        if (res.success) {
          this.notification.success('Договор удалён');
          this.load();
        } else {
          this.notification.error(res.message || 'Ошибка удаления');
        }
      },
    });
  }
}
