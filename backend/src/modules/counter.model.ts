// ========================================
// Counter Model — автоинкремент для номеров документов
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface ICounter extends Document {
  /** Название счётчика (например 'cp') */
  name: string;
  /** Текущее значение */
  value: number;
}

const counterSchema = new Schema<ICounter>({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true, default: 0 },
});

export const Counter = mongoose.model<ICounter>('Counter', counterSchema);

/** Получить следующий номер для счётчика */
export async function nextCounter(name: string): Promise<number> {
  const doc = await Counter.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } },
    { upsert: true, new: true },
  );
  return doc.value;
}
