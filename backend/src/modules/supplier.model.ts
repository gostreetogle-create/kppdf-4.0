// ========================================
// Supplier Model — поставщики
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  inn: string;
  bankAccount: string;
  paymentTermDays: number;
  isActive: boolean;
}

const supplierSchema = new Schema<ISupplier>({
  name: { type: String, required: true, trim: true },
  contactPerson: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, lowercase: true, default: '' },
  inn: { type: String, trim: true, default: '' },
  bankAccount: { type: String, trim: true, default: '' },
  paymentTermDays: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

supplierSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const Supplier = mongoose.model<ISupplier>('Supplier', supplierSchema);
