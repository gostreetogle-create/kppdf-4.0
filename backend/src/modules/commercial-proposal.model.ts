// ========================================
// CommercialProposal Model — коммерческие предложения
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IProposalItem {
  id: string;
  sourceProductId: string;
  productSku: string;
  productName: string;
  productUnit: string;
  productDescription?: string;
  quantity: number;
  unitPrice: number;
  markupPercent: number;
  total: number;
}

export interface ICommercialProposal extends Document {
  number: string;
  organizationId?: string;
  clientId?: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  items: IProposalItem[];
  totalAmount: number;
  notes?: string;
  templateId?: string;
}

const proposalItemSchema = new Schema<IProposalItem>({
  id: { type: String, required: true },
  sourceProductId: { type: String, required: true },
  productSku: { type: String, required: true },
  productName: { type: String, required: true },
  productUnit: { type: String, required: true },
  productDescription: { type: String, default: '' },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  markupPercent: { type: Number, default: 0 },
  total: { type: Number, required: true },
}, { _id: false });

const commercialProposalSchema = new Schema<ICommercialProposal>({
  number: { type: String, required: true, trim: true },
  organizationId: { type: String, trim: true, default: '' },
  clientId: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['draft', 'sent', 'approved', 'rejected'], required: true, default: 'draft' },
  items: [proposalItemSchema],
  totalAmount: { type: Number, required: true, default: 0 },
  notes: { type: String, trim: true, default: '' },
  templateId: { type: String, trim: true, default: '' },
}, { timestamps: true });

commercialProposalSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const CommercialProposal = mongoose.model<ICommercialProposal>('CommercialProposal', commercialProposalSchema);
