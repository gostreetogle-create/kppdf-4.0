// ========================================
// PurchaseRequest Model — заявки на закупку
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchaseRequest extends Document {
  number: string;
  sourceType: 'manual' | 'production_order';
  sourceId?: string;
  entityType: string;
  entityId: string;
  entityName: string;
  entitySku?: string;
  entityUnit: string;
  quantity: number;
  warehouseId?: string;
  zoneName?: string;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'fulfilled' | 'cancelled';
  notes?: string;
}

const purchaseRequestSchema = new Schema<IPurchaseRequest>({
  number: { type: String, required: true, trim: true },
  sourceType: { type: String, enum: ['manual', 'production_order'], required: true },
  sourceId: { type: String, trim: true, default: '' },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true, trim: true },
  entityName: { type: String, required: true, trim: true },
  entitySku: { type: String, trim: true, default: '' },
  entityUnit: { type: String, required: true },
  quantity: { type: Number, required: true },
  warehouseId: { type: String, trim: true, default: '' },
  zoneName: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['draft', 'pending', 'approved', 'ordered', 'fulfilled', 'cancelled'], required: true, default: 'draft' },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

purchaseRequestSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const PurchaseRequest = mongoose.model<IPurchaseRequest>('PurchaseRequest', purchaseRequestSchema);
