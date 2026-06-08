// ========================================
// Client Model — физические лица (клиенты)
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  lastName: string;
  firstName: string;
  patronymic?: string;
  phone: string;
  email?: string;
  inn?: string;
  address?: string;
  organizationId?: string;
  personalMarkupPercent?: number;
  notes?: string;
  isActive: boolean;
}

const clientSchema = new Schema<IClient>({
  lastName: { type: String, required: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  patronymic: { type: String, trim: true, default: '' },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  inn: { type: String, trim: true, default: '' },
  address: { type: String, trim: true, default: '' },
  organizationId: { type: String, trim: true, default: '' },
  personalMarkupPercent: { type: Number, default: undefined },
  notes: { type: String, trim: true, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

clientSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const Client = mongoose.model<IClient>('Client', clientSchema);
