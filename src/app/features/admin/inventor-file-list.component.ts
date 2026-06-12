import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { InventorFileService } from '../../core/inventor-file.service';
import type { InventorFile } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-inventor-file-list',
  standalone: true,
  imports: [CommonModule, KpCardComponent, KpBreadcrumbComponent, KpTableComponent, KpToastComponent],
  template: `
    <kp-toast />
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />
      <h2 class="page__title">📁 Реестр CAD-файлов</h2>
      <kp-table storageKey="cad-files" [data]="rows()" [columns]="columns" [rows]="20" emptyMessage="Файлы не найдены" [showActions]="true" (rowDelete)="onDelete($event)" />
    </kp-card>
  `,
  styles: [`:host { display: block; padding: var(--space-6); } .page__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: var(--space-4) 0; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventorFileListComponent implements OnInit {
  private svc = inject(InventorFileService);
  rows = signal<InventorFile[]>([]);
  breadcrumbs: MenuItem[] = [{ label: '⚙️ Администрирование' }, { label: 'CAD-файлы' }];
  columns: TableColumn[] = [
    { field: 'fileName', header: 'Файл', sortable: true },
    { field: 'productName', header: 'Товар' },
    { field: 'productSku', header: 'Артикул', width: '100px' },
    { field: 'fileType', header: 'Тип', width: '80px' },
    { field: 'sizeKb', header: 'КБ', width: '70px', type: 'number' },
    { field: 'author', header: 'Автор', width: '140px' },
    { field: 'version', header: 'Версия', width: '80px' },
  ];

  ngOnInit() { this.load(); }
  async load() {
    const r = await firstValueFrom(this.svc.getAll());
    this.rows.set(r.data);
  }
  async onDelete(row: unknown) { const f = row as InventorFile; if (confirm(`Удалить «${f.fileName}»?`)) { await firstValueFrom(this.svc.delete(f.id)); this.load(); } }
}
