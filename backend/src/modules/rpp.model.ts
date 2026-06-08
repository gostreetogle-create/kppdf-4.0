// ========================================
// Rpp Model — записи реестра РПП (Минпромторг)
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IRpp extends Document {
  productId: string;
  productName: string;
  productSku: string;
  registryNumber?: string;
  status: 'draft' | 'submitted' | 'registered' | 'expired';
  submissionDate?: string;
  registrationDate?: string;
  expiryDate?: string;
  notes?: string;
}

const rppSchema = new Schema<IRpp>({
  productId: { type: String, required: true, trim: true },
  productName: { type: String, required: true, trim: true },
  productSku: { type: String, required: true, trim: true },
  registryNumber: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['draft', 'submitted', 'registered', 'expired'], required: true },
  submissionDate: { type: String, trim: true, default: '' },
  registrationDate: { type: String, trim: true, default: '' },
  expiryDate: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

rppSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const Rpp = mongoose.model<IRpp>('Rpp', rppSchema);
