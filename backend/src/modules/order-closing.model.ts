// ========================================
// OrderClosing Model — акты/счета-фактуры/накладные
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderClosing extends Document {
  productionOrderId: string;
  orderNumber: string;
  closingType: 'act' | 'invoice' | 'waybill';
  number: string;
  date: string;
  amount?: number;
  organizationId?: string;
  organizationName?: string;
  status: 'draft' | 'signed' | 'closed';
  fileUrl?: string;
  notes?: string;
}

const orderClosingSchema = new Schema<IOrderClosing>({
  productionOrderId: { type: String, required: true, trim: true },
  orderNumber: { type: String, required: true, trim: true },
  closingType: { type: String, enum: ['act', 'invoice', 'waybill'], required: true },
  number: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  amount: { type: Number, default: undefined },
  organizationId: { type: String, trim: true, default: '' },
  organizationName: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['draft', 'signed', 'closed'], required: true },
  fileUrl: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

orderClosingSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const OrderClosing = mongoose.model<IOrderClosing>('OrderClosing', orderClosingSchema);
