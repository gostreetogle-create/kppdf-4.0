import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpTableComponent, TableColumn } from '../../shared/ui/kp-table.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent, SelectOption } from '../../shared/ui/kp-select.component';
import { NotificationService } from '../../core/notification.service';
import { WarehouseService } from '../../core/warehouse.service';
import { InventoryService } from '../../core/inventory.service';
import type { Warehouse, InventoryItem, InventoryMovement, MovementType } from '../../../../shared/types/index.js';

interface InventoryRow extends InventoryItem {
  zoneDisplay: string;
}

interface MovementRow extends InventoryMovement {
  typeLabel: string;
  dateDisplay: string;
}

const MOVEMENT_TYPES: SelectOption[] = [
  { value: 'in', label: '📥 Приход' },
  { value: 'out', label: '📤 Расход' },
  { value: 'transfer', label: '↔️ Перемещение' },
  { value: 'write_off', label: '🗑 Списание' },
  { value: 'adjustment', label: '🔧 Корректировка' },
];

const ENTITY_TYPES: SelectOption[] = [
  { value: 'product', label: 'Товар' },
  { value: 'storage_item', label: 'Инвентарь' },
];

@Component({
  selector: 'app-warehouse-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    KpCardComponent, KpButtonComponent, KpBreadcrumbComponent, KpToastComponent,
    KpTableComponent, KpDialogComponent, KpInputComponent, KpSelectComponent,
  ],
  template: `
    <kp-toast />

    <div class="wh-detail">
      <kp-breadcrumb [items]="breadcrumbs()" />

      <div class="wh-detail__header">
        <div>
          <h1 class="wh-detail__title">🏭 {{ warehouse()?.name || 'Склад' }}</h1>
          @if (warehouse()?.address) {
            <p class="wh-detail__addr">{{ warehouse()?.address }}</p>
          }
        </div>
        <kp-button
          label="+ Движение"
          lucideIcon="plus"
          (buttonClick)="showMovementDialog = true"
          [disabled]="loading()"
        />
      </div>

      <!-- Tabs -->
      <div class="wh-detail__tabs">
        <button
          class="wh-detail__tab"
          [class.wh-detail__tab--active]="activeTab() === 'inventory'"
          (click)="activeTab.set('inventory')"
        >📊 Остатки ({{ inventoryRows().length }})</button>
        <button
          class="wh-detail__tab"
          [class.wh-detail__tab--active]="activeTab() === 'movements'"
          (click)="activeTab.set('movements')"
        >📋 Движения ({{ movementRows().length }})</button>
      </div>

      <!-- Inventory Table -->
      @if (activeTab() === 'inventory') {
        <kp-card>
          <kp-table
            [storageKey]="'wh-inv-' + warehouseId()"
            [data]="inventoryRows()"
            [columns]="inventoryColumns"
            [rows]="20"
            [paginator]="true"
            [searchFields]="['entityName', 'entitySku']"
            [loading]="loading()"
            emptyMessage="Нет остатков на складе"
          />
        </kp-card>
      }

      <!-- Movements Table -->
      @if (activeTab() === 'movements') {
        <kp-card>
          <kp-table
            [storageKey]="'wh-mov-' + warehouseId()"
            [data]="movementRows()"
            [columns]="movementColumns"
            [rows]="20"
            [paginator]="true"
            [searchFields]="['entityName', 'notes']"
            [loading]="loading()"
            [sortField]="'dateDisplay'"
            [sortOrder]="-1"
            emptyMessage="Нет движений"
          />
        </kp-card>
      }

      <!-- Add Movement Dialog -->
      <kp-dialog
        [(visible)]="showMovementDialog"
        header="Новое движение"
      >
        <div class="wh-detail__movement-form">
          <kp-select
            label="Тип"
            [options]="movementTypes"
            [(ngModel)]="movForm.type"
          />
          <kp-select
            label="Сущность"
            [options]="entityTypes"
            [(ngModel)]="movForm.entityType"
          />
          <kp-input
            label="Название"
            [(ngModel)]="movForm.entityName"
          />
          @if (movForm.entityType === 'product') {
            <kp-input
              label="Артикул"
              [(ngModel)]="movForm.entitySku"
            />
          }
          <kp-input
            label="Количество"
            type="number"
            [(ngModel)]="movForm.quantity"
          />
          <kp-input
            label="Ед. изм."
            [(ngModel)]="movForm.entityUnit"
          />
          @if (movForm.type === 'transfer') {
            <kp-input
              label="Целевой склад (ID)"
              [(ngModel)]="targetWarehouseId"
            />
          }
          @if (warehouse()?.zoneNames?.length) {
            <kp-select
              label="Зона"
              [options]="zoneOptions()"
              [(ngModel)]="movForm.zoneName"
            />
          }
          <kp-input
            label="Примечание"
            [(ngModel)]="movForm.notes"
          />

          <div class="wh-detail__movement-actions">
            <kp-button
              label="Сохранить"
              lucideIcon="check"
              (buttonClick)="saveMovement()"
            />
            <kp-button
              label="Отмена"
              severity="secondary"
              (buttonClick)="showMovementDialog = false"
            />
          </div>
        </div>
      </kp-dialog>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .wh-detail { max-width: 1100px; margin: 0 auto; padding: var(--space-6); }
    .wh-detail__header {
      display: flex; align-items: flex-start; justify-content: space-between;
      flex-wrap: wrap; gap: var(--space-3); margin: var(--space-4) 0;
    }
    .wh-detail__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-text); margin: 0; }
    .wh-detail__addr { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: var(--space-1) 0 0; }

    .wh-detail__tabs { display: flex; gap: 0; margin-bottom: var(--space-4); border-bottom: 2px solid var(--color-border); }
    .wh-detail__tab {
      padding: var(--space-3) var(--space-5);
      border: none; background: none;
      font-size: var(--font-size-sm); font-weight: 600;
      color: var(--color-text-secondary);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
    }
    .wh-detail__tab--active { color: var(--color-primary); border-bottom-color: var(--color-primary); }

    .wh-detail__movement-form {
      display: flex; flex-direction: column; gap: var(--space-3);
    }
    .wh-detail__movement-actions {
      display: flex; gap: var(--space-3); margin-top: var(--space-3);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private warehouseService = inject(WarehouseService);
  private inventoryService = inject(InventoryService);
  private notification = inject(NotificationService);

  warehouseId = signal('');
  warehouse = signal<Warehouse | null>(null);
  loading = signal(false);
  activeTab = signal<'inventory' | 'movements'>('inventory');

  inventoryItems = signal<InventoryItem[]>([]);
  movements = signal<InventoryMovement[]>([]);

  showMovementDialog = false;
  movementTypes = MOVEMENT_TYPES;
  entityTypes = ENTITY_TYPES;

  targetWarehouseId = '';

  movForm = {
    type: 'in' as MovementType,
    entityType: 'product' as string,
    entityName: '',
    entitySku: '',
    entityId: '',
    entityUnit: 'шт',
    quantity: 1,
    zoneName: '',
    notes: '',
  };

  breadcrumbs = computed<MenuItem[]>(() => [
    { label: 'Склад', routerLink: '/warehouse' },
    { label: this.warehouse()?.name || 'Загрузка...' },
  ]);

  zoneOptions = computed<SelectOption[]>(() => [
    { label: 'Без зоны', value: '' },
    ...(this.warehouse()?.zoneNames || []).map(z => ({ label: z, value: z })),
  ]);

  inventoryColumns: TableColumn[] = [
    { field: 'entityName', header: 'Наименование', width: 'auto', sortable: true },
    { field: 'entitySku', header: 'Артикул', width: '100px' },
    { field: 'quantity', header: 'Кол-во', width: '80px', type: 'number', sortable: true },
    { field: 'entityUnit', header: 'Ед.', width: '60px' },
    { field: 'zoneDisplay', header: 'Зона', width: '130px' },
  ];

  movementColumns: TableColumn[] = [
    { field: 'typeLabel', header: 'Тип', width: '120px' },
    { field: 'entityName', header: 'Наименование', width: 'auto', sortable: true },
    { field: 'quantity', header: 'Кол-во', width: '80px', type: 'number' },
    { field: 'dateDisplay', header: 'Дата', width: '170px', sortable: true },
  ];

  inventoryRows = computed<InventoryRow[]>(() =>
    this.inventoryItems().map(i => ({
      ...i,
      zoneDisplay: i.zoneName || '—',
    })),
  );

  movementRows = computed<MovementRow[]>(() =>
    this.movements().map(m => ({
      ...m,
      typeLabel: MOVEMENT_TYPES.find(t => t.value === m.type)?.label || m.type,
      dateDisplay: new Date(m.createdAt).toLocaleString('ru-RU'),
    })),
  );

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/warehouse']); return; }
    this.warehouseId.set(id);

    this.loading.set(true);
    try {
      const whRes = await firstValueFrom(this.warehouseService.getWarehouse(id));
      if (!whRes.success || !whRes.data) {
        this.notification.error('Склад не найден');
        this.router.navigate(['/warehouse']);
        return;
      }
      this.warehouse.set(whRes.data);
      await this.loadData();
    } finally {
      this.loading.set(false);
    }
  }

  private async loadData() {
    const [invRes, movRes] = await Promise.all([
      firstValueFrom(this.inventoryService.getItems(this.warehouseId())),
      firstValueFrom(this.inventoryService.getMovements(this.warehouseId())),
    ]);
    this.inventoryItems.set(invRes.data);
    this.movements.set(movRes.data);
  }

  async saveMovement() {
    if (!this.movForm.entityName.trim()) {
      this.notification.warn('Укажите название');
      return;
    }
    if (!this.movForm.quantity || this.movForm.quantity <= 0) {
      this.notification.warn('Количество должно быть > 0');
      return;
    }
    if (this.movForm.type === 'transfer' && !this.targetWarehouseId.trim()) {
      this.notification.warn('Укажите целевой склад для перемещения');
      return;
    }

    const entityId = this.movForm.entityId || `item-${Date.now()}`;
    const res = await firstValueFrom(this.inventoryService.addMovement({
      type: this.movForm.type,
      warehouseId: this.warehouseId(),
      zoneName: this.movForm.zoneName || undefined,
      toWarehouseId: this.movForm.type === 'transfer' ? this.targetWarehouseId : undefined,
      entityType: this.movForm.entityType,
      entityId,
      entityName: this.movForm.entityName,
      entitySku: this.movForm.entitySku || undefined,
      entityUnit: this.movForm.entityUnit || 'шт',
      quantity: this.movForm.quantity,
      notes: this.movForm.notes || undefined,
    }));

    if (res.success) {
      this.notification.success('Движение записано');
      this.showMovementDialog = false;
      this.targetWarehouseId = '';
      this.movForm = { ...this.movForm, entityName: '', entitySku: '', entityId: '', quantity: 1, notes: '', zoneName: '' };
      await this.loadData();
    } else {
      this.notification.error('Ошибка записи движения');
    }
  }
}
