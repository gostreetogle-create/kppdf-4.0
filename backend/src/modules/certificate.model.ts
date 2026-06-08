// ========================================
// Certificate Model — сертификаты ЕАЭС
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  productIds: string[];
  productNames: string;
  number: string;
  certType: 'declaration' | 'certificate';
  status: 'valid' | 'expiring' | 'expired' | 'revoked';
  issuedBy?: string;
  issueDate?: string;
  expiryDate?: string;
  fileUrl?: string;
  notes?: string;
}

const certificateSchema = new Schema<ICertificate>({
  productIds: [{ type: String }],
  productNames: { type: String, required: true, trim: true },
  number: { type: String, required: true, trim: true },
  certType: { type: String, enum: ['declaration', 'certificate'], required: true },
  status: { type: String, enum: ['valid', 'expiring', 'expired', 'revoked'], required: true },
  issuedBy: { type: String, trim: true, default: '' },
  issueDate: { type: String, trim: true, default: '' },
  expiryDate: { type: String, trim: true, default: '' },
  fileUrl: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

certificateSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);
