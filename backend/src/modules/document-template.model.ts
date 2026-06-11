// ========================================
// DocumentTemplate Model — шаблоны документов
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

// Локальные типы для вложенных блоков документов
// Соответствуют DocBlock / DocTextColumn из shared/types

interface IDocTextColumn {
  id: string;
  content: string;
  width?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  color?: string;
}

interface IDocBlockSettings {
  padding?: string;
  fontSize?: string;
  align?: 'left' | 'center' | 'right';
}

interface IDocBlock {
  id: string;
  type: 'text' | 'table' | 'separator';
  order: number;
  title?: string;
  content?: string;
  columns?: IDocTextColumn[];
  tableTemplateId?: string;
  height?: number;
  showLine?: boolean;
  settings?: IDocBlockSettings;
}

/** Вложенная схема для DocBlock */
const docTextColumnSchema = new Schema({
  id: { type: String, required: true },
  content: { type: String, default: '' },
  width: { type: String, default: '' },
  textAlign: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
  fontWeight: { type: String, enum: ['normal', 'bold'], default: 'normal' },
  fontStyle: { type: String, enum: ['normal', 'italic'], default: 'normal' },
  textDecoration: { type: String, enum: ['none', 'underline'], default: 'none' },
  color: { type: String, default: '' },
}, { _id: false });

const docBlockSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['text', 'table', 'separator'], required: true },
  order: { type: Number, required: true },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  columns: { type: [docTextColumnSchema], default: [] },
  tableTemplateId: { type: String, default: '' },
  height: { type: Number, default: undefined },
  showLine: { type: Boolean, default: false },
  settings: {
    type: new Schema({
      padding: { type: String, default: '' },
      fontSize: { type: String, default: '' },
      align: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
    }, { _id: false }),
    default: {},
  },
}, { _id: false });

export interface IDocumentTemplate extends Document {
  name: string;
  description?: string;
  docType: string;
  pageSize?: string;
  backgroundImages?: string[];
  organizationId?: string;
  isDefault?: boolean;
  blocks: IDocBlock[];
}

const documentTemplateSchema = new Schema<IDocumentTemplate>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  docType: { type: String, required: true, trim: true },
  pageSize: { type: String, enum: ['A4', 'A5', 'letter'], default: 'A4' },
  backgroundImages: { type: [String], default: [] },
  organizationId: { type: String, default: '' },
  isDefault: { type: Boolean, default: false },
  blocks: { type: [docBlockSchema], default: [] },
}, { timestamps: true });

documentTemplateSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const DocumentTemplate = mongoose.model<IDocumentTemplate>('DocumentTemplate', documentTemplateSchema);
