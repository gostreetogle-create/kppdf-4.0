// ========================================
// Worker Model — работники
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IWorker extends Document {
  lastName: string;
  firstName: string;
  patronymic?: string;
  grade: number;
  ratePerHour: number;
  workTypeIds: string[];
  isActive: boolean;
}

const workerSchema = new Schema<IWorker>({
  lastName: { type: String, required: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  patronymic: { type: String, trim: true, default: '' },
  grade: { type: Number, required: true, min: 1, max: 10 },
  ratePerHour: { type: Number, required: true, min: 0 },
  workTypeIds: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

workerSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const Worker = mongoose.model<IWorker>('Worker', workerSchema);
