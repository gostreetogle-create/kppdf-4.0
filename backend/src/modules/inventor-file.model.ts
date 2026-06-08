// ========================================
// InventorFile Model — CAD-файлы (метаданные)
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IInventorFile extends Document {
  productId: string;
  productName: string;
  productSku: string;
  fileName: string;
  fileType: 'dwg' | 'idw' | 'step' | 'stl' | 'pdf';
  sizeKb?: number;
  version?: string;
  author?: string;
  notes?: string;
}

const inventorFileSchema = new Schema<IInventorFile>({
  productId: { type: String, required: true, trim: true },
  productName: { type: String, required: true, trim: true },
  productSku: { type: String, required: true, trim: true },
  fileName: { type: String, required: true, trim: true },
  fileType: { type: String, enum: ['dwg', 'idw', 'step', 'stl', 'pdf'], required: true },
  sizeKb: { type: Number, default: undefined },
  version: { type: String, trim: true, default: '' },
  author: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

inventorFileSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const InventorFile = mongoose.model<IInventorFile>('InventorFile', inventorFileSchema);
