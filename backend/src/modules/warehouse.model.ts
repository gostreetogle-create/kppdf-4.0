// ========================================
// Warehouse Model — склады
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IWarehouse extends Document {
  name: string;
  address?: string;
  zoneNames: string[];
  roleIds: string[];
  isActive: boolean;
}

const warehouseSchema = new Schema<IWarehouse>({
  name: { type: String, required: true, trim: true },
  address: { type: String, trim: true, default: '' },
  zoneNames: [{ type: String }],
  roleIds: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

warehouseSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const Warehouse = mongoose.model<IWarehouse>('Warehouse', warehouseSchema);
