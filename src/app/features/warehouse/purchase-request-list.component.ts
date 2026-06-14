import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
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
import { PurchaseRequestService } from '../../core/purchase-request.service';
import { ConfirmationService } from 'primeng/api';
import type { PurchaseRequest, PurchaseRequestStatus } from '../../../../shared/types/index.js';

interface RequestRow extends PurchaseRequest {
  statusLabel: string;
  updatedAtDisplay: string;
}

@Component({
  selector: 'app-purchase-request-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpToastComponent,
  ],
  template: `
    <kp-toast />

    <div class="pr-list">
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="pr-list__header">
        <h2 class="pr-list__title">📋 Заявки на закупку</h2>
        <kp-button
          label="+ Новая заявка"
          lucideIcon="plus"
          routerLink="/warehouse/purchase-requests/new"
          [disabled]="loading()"
        />
      </div>

      <kp-card>
        <kp-table
          storageKey="purchase-requests"
          [data]="rows()"
          [columns]="tableColumns"
          [rows]="20"
          [paginator]="true"
          [sortField]="'number'"
          [sortOrder]="-1"
          [searchFields]="['number', 'entityName', 'notes']"
          emptyMessage="Нет заявок"
          [showActions]="true"
          [loading]="loading()"
          [extraActions]="statusActions"
          (rowEdit)="onEditRow($event)"
          (rowDelete)="onDelete($event)"
          (rowExtraAction)="onStatusChange($event)"
        />
      </kp-card>
    </div>
  `,
  styleUrl: './purchase-request-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseRequestListComponent implements OnInit {
  private router = inject(Router);
  private prService = inject(PurchaseRequestService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  rows = signal<RequestRow[]>([]);
  loading = signal(false);

  statusActions: TableExtraAction[] = [
    { icon: 'send', severity: 'info', tooltip: 'Отправить', visible: (row: unknown) => (row as PurchaseRequest).status === 'draft' },
    { icon: 'check', severity: 'success', tooltip: 'Утвердить', visible: (row: unknown) => (row as PurchaseRequest).status === 'pending' },
    { icon: 'shopping-cart', severity: 'info', tooltip: 'Заказано', visible: (row: unknown) => (row as PurchaseRequest).status === 'approved' },
    { icon: 'package-check', severity: 'success', tooltip: 'Выполнено', visible: (row: unknown) => (row as PurchaseRequest).status === 'ordered' },
  ];

  breadcrumbs: MenuItem[] = [
    { label: 'Склад', routerLink: '/warehouse' },
    { label: 'Заявки на закупку' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'number', header: 'Номер', width: '110px', sortable: true },
    { field: 'entityName', header: 'Позиция', width: 'auto', sortable: true },
    { field: 'quantity', header: 'Кол-во', width: '80px', type: 'number' },
    { field: 'entityUnit', header: 'Ед.', width: '60px' },
    { field: 'statusLabel', header: 'Статус', width: '120px', type: 'badge' },
  ];

  ngOnInit() { this.load(); }

  async load() {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.prService.getRequests());
      this.rows.set(res.data.map(r => ({
        ...r,
        statusLabel: this.statusText(r.status),
        updatedAtDisplay: new Date(r.updatedAt).toLocaleString('ru-RU'),
      })));
    } finally { this.loading.set(false); }
  }

  private statusText(s: string): string {
    const map: Record<string, string> = {
      draft: 'Черновик', pending: 'На согласовании',
      approved: 'Утверждена', ordered: 'Заказано',
      fulfilled: 'Выполнена', cancelled: 'Отменена',
    };
    return map[s] || s;
  }

  onEditRow(row: unknown) {
    const r = row as PurchaseRequest;
    this.router.navigate(['/warehouse/purchase-requests', r.id, 'edit']);
  }

  async onStatusChange(event: { icon: string; row: unknown }) {
    const r = event.row as PurchaseRequest;
    const map: Record<string, { status: PurchaseRequestStatus; label: string }> = {
      send: { status: 'pending', label: 'На согласовании' },
      check: { status: 'approved', label: 'Утверждена' },
      'shopping-cart': { status: 'ordered', label: 'Заказано' },
      'package-check': { status: 'fulfilled', label: 'Выполнена' },
    };
    const target = map[event.icon];
    if (!target) return;

    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Смена статуса заявки',
      message: `Изменить статус «${r.number}» на «${target.label}»?`,
      acceptLabel: 'Подтвердить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.prService.changeStatus(r.id, target.status));
        if (res.success) { this.notification.success(`Заявка «${r.number}» — ${target.label}`); this.load(); }
        else { this.notification.error(res.message || 'Ошибка'); }
      },
    });
  }

  onDelete(row: unknown) {
    const r = row as RequestRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление заявки',
      message: `Удалить «${r.number}»?`,
      acceptLabel: 'Удалить', rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.prService.deleteRequest(r.id));
        if (res.success) { this.notification.success('Заявка удалена'); this.load(); }
        else { this.notification.error(res.message || 'Ошибка'); }
      },
    });
  }
}
