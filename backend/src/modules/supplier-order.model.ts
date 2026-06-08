// ========================================
// SupplierOrder Model — заказы поставщикам
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplierOrderItem {
  id: string;
  entityType: string;
  entityId: string;
  entityName: string;
  entitySku?: string;
  entityUnit: string;
  quantity: number;
  price?: number;
}

export interface ISupplierOrder extends Document {
  number: string;
  supplierOrgId: string;
  status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled';
  items: ISupplierOrderItem[];
  totalAmount?: number;
  expectedDate?: string;
  notes?: string;
}

const orderItemSchema = new Schema<ISupplierOrderItem>({
  id: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  entityName: { type: String, required: true },
  entitySku: { type: String, default: '' },
  entityUnit: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, default: undefined },
}, { _id: false });

const supplierOrderSchema = new Schema<ISupplierOrder>({
  number: { type: String, required: true, trim: true },
  supplierOrgId: { type: String, required: true, trim: true },
  status: { type: String, enum: ['draft', 'sent', 'confirmed', 'partial', 'received', 'cancelled'], required: true, default: 'draft' },
  items: [orderItemSchema],
  totalAmount: { type: Number, default: undefined },
  expectedDate: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

supplierOrderSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const SupplierOrder = mongoose.model<ISupplierOrder>('SupplierOrder', supplierOrderSchema);
