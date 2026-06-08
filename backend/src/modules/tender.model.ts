// ========================================
// Tender Model — тендеры
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface ITenderDocument {
  id: string;
  tenderId: string;
  name: string;
  type: 'request' | 'clarification' | 'protocol' | 'contract' | 'other';
  url?: string;
  createdAt: string;
}

export interface ITender extends Document {
  number: string;
  title: string;
  type: '44fz' | '223fz' | 'commercial';
  status: 'draft' | 'published' | 'submission' | 'evaluation' | 'won' | 'lost' | 'cancelled';
  customerOrgId: string;
  customerName: string;
  noticeNumber?: string;
  platformUrl?: string;
  startPrice?: number;
  ourPrice?: number;
  publishDate?: string;
  submissionDeadline?: string;
  resultDate?: string;
  notes?: string;
  documents: ITenderDocument[];
}

const docSchema = new Schema<ITenderDocument>({
  id: { type: String, required: true },
  tenderId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['request', 'clarification', 'protocol', 'contract', 'other'], required: true },
  url: { type: String, default: '' },
  createdAt: { type: String, required: true },
}, { _id: false });

const tenderSchema = new Schema<ITender>({
  number: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['44fz', '223fz', 'commercial'], required: true },
  status: { type: String, enum: ['draft', 'published', 'submission', 'evaluation', 'won', 'lost', 'cancelled'], required: true, default: 'draft' },
  customerOrgId: { type: String, required: true, trim: true },
  customerName: { type: String, required: true, trim: true },
  noticeNumber: { type: String, trim: true, default: '' },
  platformUrl: { type: String, trim: true, default: '' },
  startPrice: { type: Number, default: undefined },
  ourPrice: { type: Number, default: undefined },
  publishDate: { type: String, trim: true, default: '' },
  submissionDeadline: { type: String, trim: true, default: '' },
  resultDate: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
  documents: [docSchema],
}, { timestamps: true });

tenderSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const Tender = mongoose.model<ITender>('Tender', tenderSchema);
