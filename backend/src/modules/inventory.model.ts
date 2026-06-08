// ========================================
// Inventory Model — остатки и движения на складах
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

// ─── InventoryItem ───

export interface IInventoryItem extends Document {
  warehouseId: string;
  zoneName?: string;
  entityType: string;
  entityId: string;
  entityName: string;
  entitySku?: string;
  entityUnit: string;
  quantity: number;
  minQuantity?: number;
  updatedAt: string;
}

const inventoryItemSchema = new Schema<IInventoryItem>({
  warehouseId: { type: String, required: true, trim: true, index: true },
  zoneName: { type: String, trim: true, default: '' },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true, trim: true },
  entityName: { type: String, required: true, trim: true },
  entitySku: { type: String, trim: true, default: '' },
  entityUnit: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  minQuantity: { type: Number, default: undefined },
  updatedAt: { type: String, required: true },
});

inventoryItemSchema.index({ warehouseId: 1, entityType: 1, entityId: 1, zoneName: 1 });

inventoryItemSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', inventoryItemSchema);

// ─── InventoryMovement ───

export interface IInventoryMovement extends Document {
  type: 'in' | 'out' | 'transfer' | 'write_off' | 'adjustment';
  warehouseId: string;
  zoneName?: string;
  toWarehouseId?: string;
  toZoneName?: string;
  entityType: string;
  entityId: string;
  entityName: string;
  entitySku?: string;
  entityUnit: string;
  quantity: number;
  documentRef?: string;
  notes?: string;
  createdAt: string;
}

const inventoryMovementSchema = new Schema<IInventoryMovement>({
  type: { type: String, enum: ['in', 'out', 'transfer', 'write_off', 'adjustment'], required: true },
  warehouseId: { type: String, required: true, trim: true, index: true },
  zoneName: { type: String, trim: true, default: '' },
  toWarehouseId: { type: String, trim: true, default: '' },
  toZoneName: { type: String, trim: true, default: '' },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true, trim: true },
  entityName: { type: String, required: true, trim: true },
  entitySku: { type: String, trim: true, default: '' },
  entityUnit: { type: String, required: true },
  quantity: { type: Number, required: true },
  documentRef: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
  createdAt: { type: String, required: true },
});

inventoryMovementSchema.index({ warehouseId: 1, createdAt: -1 });

inventoryMovementSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const InventoryMovement = mongoose.model<IInventoryMovement>('InventoryMovement', inventoryMovementSchema);
