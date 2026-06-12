import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { RoleService } from '../../core/role.service';
import type { RoleDef } from '../../../../shared/types/index.js';

const SECTION_LABELS: Record<string, string> = { sales: 'Продажи', production: 'Производство', warehouse: 'Склад', finance: 'Бухгалтерия', references: 'Справочники', admin: 'Администрирование' };

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, KpCardComponent, KpBreadcrumbComponent, KpTableComponent, KpToastComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">👥 Пользователи и роли</h2>
      <kp-table storageKey="roles" [data]="rows()" [columns]="columns" [rows]="20" emptyMessage="Роли не найдены" [showActions]="true" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styles: [`:host { display: block; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleListComponent implements OnInit {
  private svc = inject(RoleService);
  rows = signal<RoleDef[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '⚙️ Администрирование' }, { label: 'Пользователи и роли' }];
  columns: TableColumn[] = [
    { field: 'name', header: 'Роль', sortable: true },
    { field: 'description', header: 'Описание' },
    { field: 'sectionsStr', header: 'Доступ к разделам', width: '300px' },
    { field: 'isActive', header: 'Активна', width: '90px', type: 'badge' },
  ];

  ngOnInit() { this.load(); }
  async load() {
    const r = await firstValueFrom(this.svc.getAll());
    this.rows.set(r.data.map(role => ({ ...role, sectionsStr: role.sectionIds.map(s => SECTION_LABELS[s] || s).join(', ') } as RoleDef & { sectionsStr: string })));
  }
  async onDelete(row: unknown) { const r = row as RoleDef; if (confirm(`Удалить «${r.name}»?`)) { await firstValueFrom(this.svc.delete(r.id)); this.load(); } }
}
