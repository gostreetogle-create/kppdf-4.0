// ========================================
// DocTypeDef Model — справочник «Типы документов»
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IDocTypeDef extends Document {
  name: string;
  /** Системный ключ (quotation, contract, invoice, shipping) */
  slug: string;
  description?: string;
  isActive: boolean;
}

const docTypeDefSchema = new Schema<IDocTypeDef>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, trim: true, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

docTypeDefSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const DocTypeDef = mongoose.model<IDocTypeDef>('DocTypeDef', docTypeDefSchema);
