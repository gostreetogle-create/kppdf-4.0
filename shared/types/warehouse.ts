// ========================================
// Модуль «Склад и Закупки» (Фаза 3)
// ========================================

/**
 * Универсальный инвентарь (StorageItem).
 * Всё, что НЕ продаётся: станки, инструменты, запчасти, оснастка.
 * Создаётся на лету, не попадает в витрину, остаётся в БД навсегда.
 */
export interface StorageItem {
  id: string;
  name: string;
  description?: string;
  photos?: string[];
  weightKg?: number;
  dimensions?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Склад.
 * zoneNames — подразделения без жёсткой иерархии (теги-подразделения).
 * roleIds — ID ролей, которые имеют доступ (ролевая изоляция).
 */
export interface Warehouse {
  id: string;
  name: string;
  address?: string;
  zoneNames: string[];
  roleIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Тип сущности на складе (открытый для расширения) */
export type InventoryEntityType = 'product' | 'storage_item' | 'material' | 'component' | string;

/**
 * Полиморфный остаток на складе.
 * entityType + entityId — любая сущность может быть на складе.
 * Snapshot-поля (entityName, entitySku, entityUnit) — копии для быстрого отображения.
 */
export interface InventoryItem {
  id: string;
  warehouseId: string;
  zoneName?: string;
  entityType: InventoryEntityType;
  entityId: string;
  entityName: string;
  entitySku?: string;
  entityUnit: string;
  quantity: number;
  minQuantity?: number;
  updatedAt: string;
}

/** Тип движения */
export type MovementType = 'in' | 'out' | 'transfer' | 'write_off' | 'adjustment';

/**
 * Движение по складу (аудит).
 */
export interface InventoryMovement {
  id: string;
  type: MovementType;
  warehouseId: string;
  zoneName?: string;
  toWarehouseId?: string;
  toZoneName?: string;
  entityType: InventoryEntityType;
  entityId: string;
  entityName: string;
  entitySku?: string;
  entityUnit: string;
  quantity: number;
  documentRef?: string;
  notes?: string;
  createdAt: string;
}

/** Статус заявки на закупку */
export type PurchaseRequestStatus = 'draft' | 'pending' | 'approved' | 'ordered' | 'fulfilled' | 'cancelled';

/**
 * Заявка на закупку.
 * sourceType: 'manual' сейчас → 'production_order' в Фазе 2.
 */
export interface PurchaseRequest {
  id: string;
  number: string;
  sourceType: 'manual' | 'production_order';
  sourceId?: string;
  entityType: InventoryEntityType;
  entityId: string;
  entityName: string;
  entitySku?: string;
  entityUnit: string;
  quantity: number;
  warehouseId?: string;
  zoneName?: string;
  status: PurchaseRequestStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Статус заказа поставщику */
export type SupplierOrderStatus = 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled';

/** Позиция заказа поставщику */
export interface SupplierOrderItem {
  id: string;
  entityType: InventoryEntityType;
  entityId: string;
  entityName: string;
  entitySku?: string;
  entityUnit: string;
  quantity: number;
  price?: number;
}

/**
 * Заказ поставщику.
 */
export interface SupplierOrder {
  id: string;
  number: string;
  supplierOrgId: string;
  status: SupplierOrderStatus;
  items: SupplierOrderItem[];
  totalAmount?: number;
  expectedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Статус входящего счёта */
export type InvoiceStatus = 'pending' | 'paid' | 'cancelled';

/**
 * Входящий счёт от поставщика.
 */
export interface IncomingInvoice {
  id: string;
  number: string;
  date: string;
  supplierOrgId: string;
  supplierOrderId?: string;
  amount: number;
  paid: number;
  status: InvoiceStatus;
  fileUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
