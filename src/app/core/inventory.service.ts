import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';
import type { ApiResponse, InventoryItem, InventoryMovement, InventoryEntityType } from '../../../shared/types/index.js';

@Injectable({ providedIn: 'root' })
export class InventoryService extends BaseCrudService<InventoryItem> {
  private movements: InventoryMovement[] = [];

  constructor() {
    super();
    this.items = [];
    this.seed();
  }

  private seed(): void {
    const now = nowISO();

    const seedMovements: Omit<InventoryMovement, 'id' | 'createdAt'>[] = [
      // Трубный склад
      { type: 'in', warehouseId: 'wh-1', zoneName: 'Трубный', entityType: 'product', entityId: 'prod-tube-40x40', entityName: 'Труба 40×40×2', entitySku: 'MF0003', entityUnit: 'м.п', quantity: 200 },
      { type: 'in', warehouseId: 'wh-1', zoneName: 'Трубный', entityType: 'product', entityId: 'prod-tube-25x25', entityName: 'Труба 25×25×1.5', entitySku: 'MF0004', entityUnit: 'м.п', quantity: 350 },
      { type: 'in', warehouseId: 'wh-1', zoneName: 'Трубный', entityType: 'product', entityId: 'prod-tube-50x50', entityName: 'Труба 50×50×3', entitySku: 'MF0005', entityUnit: 'м.п', quantity: 120 },
      // Листовой склад
      { type: 'in', warehouseId: 'wh-1', zoneName: 'Листовой', entityType: 'product', entityId: 'prod-sheet-2mm', entityName: 'Лист стальной 2 мм', entitySku: 'MF0001', entityUnit: 'шт', quantity: 50 },
      { type: 'in', warehouseId: 'wh-1', zoneName: 'Листовой', entityType: 'product', entityId: 'prod-sheet-4mm', entityName: 'Лист стальной 4 мм', entitySku: 'MF0002', entityUnit: 'шт', quantity: 30 },
      // Окрасочный склад
      { type: 'in', warehouseId: 'wh-1', zoneName: 'Окрасочный', entityType: 'product', entityId: 'prod-paint-ral9003', entityName: 'Порошковая краска RAL 9003', entitySku: 'PR0002', entityUnit: 'кг', quantity: 25 },
      { type: 'in', warehouseId: 'wh-1', zoneName: 'Окрасочный', entityType: 'product', entityId: 'prod-paint-ral5005', entityName: 'Порошковая краска RAL 5005', entitySku: 'PR0003', entityUnit: 'кг', quantity: 15 },
      // Деревообработка
      { type: 'in', warehouseId: 'wh-1', zoneName: 'Деревообработка', entityType: 'product', entityId: 'prod-wood-oak', entityName: 'Дубовая доска 40 мм', entitySku: 'MB0002', entityUnit: 'м³', quantity: 8 },
      { type: 'in', warehouseId: 'wh-1', zoneName: 'Деревообработка', entityType: 'product', entityId: 'prod-wood-pine', entityName: 'Сосновая доска 25 мм', entitySku: 'MB0003', entityUnit: 'м³', quantity: 12 },
      // Готовая продукция (склад №2)
      { type: 'in', warehouseId: 'wh-2', zoneName: 'Готовая продукция', entityType: 'product', entityId: 'prod-bench', entityName: 'Скамья уличная СК-01', entitySku: 'MF0006', entityUnit: 'шт', quantity: 15 },
      { type: 'in', warehouseId: 'wh-2', zoneName: 'Готовая продукция', entityType: 'product', entityId: 'prod-fence', entityName: 'Ограждение ОГ-02', entitySku: 'OG0001', entityUnit: 'секция', quantity: 40 },
      // Инвентарь (storage_items)
      { type: 'in', warehouseId: 'wh-1', zoneName: 'Трубный', entityType: 'storage_item', entityId: 'si-1', entityName: 'Сварочный аппарат TIG-200', entityUnit: 'шт', quantity: 2 },
      { type: 'in', warehouseId: 'wh-1', zoneName: 'Деревообработка', entityType: 'storage_item', entityId: 'si-2', entityName: 'Токарный станок ТВ-4', entityUnit: 'шт', quantity: 1 },
      { type: 'in', warehouseId: 'wh-1', zoneName: 'Окрасочный', entityType: 'storage_item', entityId: 'si-3', entityName: 'Компрессор воздушный К-24', entityUnit: 'шт', quantity: 1 },
    ];

    seedMovements.forEach(sm => {
      const m: InventoryMovement = { ...sm, id: generateId(), createdAt: now };
      this.movements.push(m);
      this.applyMovement(m);
    });
  }

  getItems(warehouseId?: string): Observable<ApiResponse<InventoryItem[]>> {
    const filtered = warehouseId
      ? this.items.filter(i => i.warehouseId === warehouseId)
      : [...this.items];
    return of({ success: true, data: filtered.map(i => this.cloneItem(i)) }).pipe(delay(this.delayMs));
  }

  getItem(id: string): Observable<ApiResponse<InventoryItem | undefined>> {
    return this.getById(id);
  }

  getMovements(warehouseId?: string, limit: number = 50): Observable<ApiResponse<InventoryMovement[]>> {
    const filtered = warehouseId
      ? this.movements.filter(m => m.warehouseId === warehouseId || m.toWarehouseId === warehouseId)
      : [...this.movements];
    return of({ success: true, data: filtered.slice(-limit).reverse() }).pipe(delay(this.delayMs));
  }

  addMovement(movement: Omit<InventoryMovement, 'id' | 'createdAt'>): Observable<ApiResponse<InventoryMovement>> {
    const m: InventoryMovement = { ...movement, id: generateId(), createdAt: nowISO() };
    this.movements.push(m);
    this.applyMovement(m);
    return of({ success: true, data: { ...m } }).pipe(delay(this.delayMs));
  }

  private applyMovement(m: InventoryMovement): void {
    if (m.type === 'in' || m.type === 'adjustment') {
      this.upsertItem(m.warehouseId, m.zoneName, m.entityType, m.entityId, m.entityName, m.entitySku, m.entityUnit, m.quantity);
    } else if (m.type === 'out' || m.type === 'write_off') {
      this.upsertItem(m.warehouseId, m.zoneName, m.entityType, m.entityId, m.entityName, m.entitySku, m.entityUnit, -m.quantity);
    } else if (m.type === 'transfer' && m.toWarehouseId) {
      this.upsertItem(m.warehouseId, m.zoneName, m.entityType, m.entityId, m.entityName, m.entitySku, m.entityUnit, -m.quantity);
      this.upsertItem(m.toWarehouseId, m.toZoneName, m.entityType, m.entityId, m.entityName, m.entitySku, m.entityUnit, m.quantity);
    }
  }

  private upsertItem(
    warehouseId: string, zoneName: string | undefined,
    entityType: string, entityId: string,
    entityName: string, entitySku: string | undefined,
    entityUnit: string, delta: number,
  ): void {
    const existing = this.items.find(
      i => i.warehouseId === warehouseId && i.entityType === entityType && i.entityId === entityId && i.zoneName === zoneName,
    );
    if (existing) {
      existing.quantity += delta;
      if (existing.quantity <= 0) {
        this.items = this.items.filter(i => i !== existing);
      }
      existing.updatedAt = nowISO();
    } else if (delta > 0) {
      this.items.push({
        id: generateId(),
        warehouseId,
        zoneName,
        entityType: entityType as InventoryEntityType,
        entityId,
        entityName,
        entitySku,
        entityUnit,
        quantity: delta,
        updatedAt: nowISO(),
      });
    }
  }

  protected override cloneItem(i: InventoryItem): InventoryItem {
    return { ...i };
  }
}
