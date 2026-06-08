// ========================================
// Invoice Model — входящие счета от поставщиков
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoice extends Document {
  number: string;
  date: string;
  supplierOrgId: string;
  supplierOrderId?: string;
  amount: number;
  paid: number;
  status: 'pending' | 'paid' | 'cancelled';
  fileUrl?: string;
  notes?: string;
}

const invoiceSchema = new Schema<IInvoice>({
  number: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  supplierOrgId: { type: String, required: true, trim: true },
  supplierOrderId: { type: String, trim: true, default: '' },
  amount: { type: Number, required: true },
  paid: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], required: true, default: 'pending' },
  fileUrl: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

invoiceSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
