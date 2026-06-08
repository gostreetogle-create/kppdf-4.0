// ========================================
// ReconciliationAct Model — акты сверки
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IReconciliationAct extends Document {
  organizationId: string;
  organizationName: string;
  number: string;
  periodStart: string;
  periodEnd: string;
  ourDebt?: number;
  theirDebt?: number;
  balance?: number;
  status: 'draft' | 'sent' | 'signed' | 'disputed';
  signDate?: string;
  fileUrl?: string;
  notes?: string;
}

const reconciliationActSchema = new Schema<IReconciliationAct>({
  organizationId: { type: String, required: true, trim: true },
  organizationName: { type: String, required: true, trim: true },
  number: { type: String, required: true, trim: true },
  periodStart: { type: String, required: true, trim: true },
  periodEnd: { type: String, required: true, trim: true },
  ourDebt: { type: Number, default: undefined },
  theirDebt: { type: Number, default: undefined },
  balance: { type: Number, default: undefined },
  status: { type: String, enum: ['draft', 'sent', 'signed', 'disputed'], required: true },
  signDate: { type: String, trim: true, default: '' },
  fileUrl: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

reconciliationActSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const ReconciliationAct = mongoose.model<IReconciliationAct>('ReconciliationAct', reconciliationActSchema);
