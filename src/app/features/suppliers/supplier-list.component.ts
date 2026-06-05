import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { NotificationService } from '../../core/notification.service';
import { SupplierService } from '../../core/supplier.service';
import { ConfirmationService } from 'primeng/api';
import type { Supplier } from '../../../../shared/types/index.js';

interface SupplierRow extends Supplier {
  updatedAtDisplay: string;
}

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpToastComponent, KpConfirmDialogComponent,
  ],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierListComponent implements OnInit {
  private router = inject(Router);
  private supplierService = inject(SupplierService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  suppliers = signal<SupplierRow[]>([]);
  loading = signal(false);

  breadcrumbs: MenuItem[] = [
    { label: 'Справочники', routerLink: '/references' },
    { label: 'Поставщики' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'name', header: 'Наименование', sortable: true },
    { field: 'contactPerson', header: 'Контактное лицо', width: '200px' },
    { field: 'phone', header: 'Телефон', width: '170px' },
    { field: 'email', header: 'Email', width: '200px' },
    { field: 'inn', header: 'ИНН', width: '140px', sortable: true },
    { field: 'updatedAtDisplay', header: 'Изменён', width: '170px', sortable: true },
  ];

  async ngOnInit() {
    await this.loadSuppliers();
  }

  async loadSuppliers() {
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.supplierService.getSuppliers());
      this.suppliers.set(result.data.map(s => ({
        ...s,
        updatedAtDisplay: new Date(s.updatedAt).toLocaleString('ru-RU'),
      })));
    } finally {
      this.loading.set(false);
    }
  }

  onEditRow(row: unknown) {
    const sup = row as SupplierRow;
    this.router.navigate(['/references/suppliers', sup.id, 'edit']);
  }

  onDelete(row: unknown) {
    const sup = row as SupplierRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление поставщика',
      message: `Вы уверены, что хотите удалить поставщика «${sup.name}»?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const result = await firstValueFrom(this.supplierService.deleteSupplier(sup.id));
        if (result.success) {
          this.notification.success('Поставщик удалён');
          await this.loadSuppliers();
        } else {
          this.notification.error(result.message || 'Ошибка удаления');
        }
      },
    });
  }
}
