// ========================================
// CounterpartyRole Model — справочник «Виды контрагентов»
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface ICounterpartyRole extends Document {
  name: string;
  description: string;
  /** Системный ключ для фильтрации (например: 'supplier', 'buyer') */
  slug: string;
  isActive: boolean;
}

const counterpartyRoleSchema = new Schema<ICounterpartyRole>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

counterpartyRoleSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const CounterpartyRole = mongoose.model<ICounterpartyRole>('CounterpartyRole', counterpartyRoleSchema);
