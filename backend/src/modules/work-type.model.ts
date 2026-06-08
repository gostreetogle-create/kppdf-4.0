// ========================================
// WorkType Model — виды работ
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkType extends Document {
  name: string;
  department: string;
  defaultDurationHours: number;
  workCenterId?: string;
  isActive: boolean;
}

const workTypeSchema = new Schema<IWorkType>({
  name: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  defaultDurationHours: { type: Number, required: true },
  workCenterId: { type: String, trim: true, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

workTypeSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const WorkType = mongoose.model<IWorkType>('WorkType', workTypeSchema);
