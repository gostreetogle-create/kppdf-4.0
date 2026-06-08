// ========================================
// WorkCenter Model — рабочие центры / станки
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkCenter extends Document {
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
}

const workCenterSchema = new Schema<IWorkCenter>({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

workCenterSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const WorkCenter = mongoose.model<IWorkCenter>('WorkCenter', workCenterSchema);
