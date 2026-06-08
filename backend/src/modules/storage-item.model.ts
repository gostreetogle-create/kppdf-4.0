// ========================================
// StorageItem Model — универсальный инвентарь
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IStorageItem extends Document {
  name: string;
  description?: string;
  photos?: string[];
  weightKg?: number;
  dimensions?: string;
  notes?: string;
  isActive: boolean;
}

const storageItemSchema = new Schema<IStorageItem>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  photos: [{ type: String }],
  weightKg: { type: Number, default: undefined },
  dimensions: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

storageItemSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const StorageItem = mongoose.model<IStorageItem>('StorageItem', storageItemSchema);
