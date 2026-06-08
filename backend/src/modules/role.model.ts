// ========================================
// Role Model — роли пользователей
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description?: string;
  sectionIds: string[];
  isActive: boolean;
}

const roleSchema = new Schema<IRole>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  sectionIds: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

roleSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const Role = mongoose.model<IRole>('Role', roleSchema);
