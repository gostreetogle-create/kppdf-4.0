// ========================================
// Contract Model — договоры
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IContractItem {
  id: string;
  sourceProductId: string;
  productSku: string;
  productName: string;
  productUnit: string;
  quantity: number;
}

export interface IContract extends Document {
  number: string;
  proposalId?: string;
  organizationId?: string;
  clientId?: string;
  status: 'draft' | 'active' | 'completed' | 'terminated';
  items: IContractItem[];
  notes?: string;
}

const contractItemSchema = new Schema<IContractItem>({
  id: { type: String, required: true },
  sourceProductId: { type: String, required: true },
  productSku: { type: String, required: true },
  productName: { type: String, required: true },
  productUnit: { type: String, required: true },
  quantity: { type: Number, required: true },
}, { _id: false });

const contractSchema = new Schema<IContract>({
  number: { type: String, required: true, trim: true },
  proposalId: { type: String, trim: true, default: '' },
  organizationId: { type: String, trim: true, default: '' },
  clientId: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['draft', 'active', 'completed', 'terminated'], required: true, default: 'draft' },
  items: [contractItemSchema],
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

contractSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const Contract = mongoose.model<IContract>('Contract', contractSchema);
