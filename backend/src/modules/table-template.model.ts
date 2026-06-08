// ========================================
// TableTemplate Model — шаблоны таблиц для документов
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

/** Колонка шаблона таблицы */
interface ITemplateColumn {
  tableName: string;
  fieldName: string;
  label: string;
  width?: string;
  order: number;
}

const templateColumnSchema = new Schema({
  tableName: { type: String, required: true },
  fieldName: { type: String, required: true },
  label: { type: String, required: true },
  width: { type: String, default: '' },
  order: { type: Number, required: true },
}, { _id: false });

export interface ITableTemplate extends Document {
  name: string;
  columns: ITemplateColumn[];
}

const tableTemplateSchema = new Schema<ITableTemplate>({
  name: { type: String, required: true, trim: true },
  columns: { type: [templateColumnSchema], default: [] },
}, { timestamps: true });

tableTemplateSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const TableTemplate = mongoose.model<ITableTemplate>('TableTemplate', tableTemplateSchema);
