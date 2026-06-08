// ========================================
// Product Model — товары и услуги
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: string;
  categoryId: string;
  productType: 'purchased' | 'manufactured';
  description?: string;
  basePrice?: number;
  defaultMarkupPercent?: number;
  unit: string;
  weightKg?: number;
  dimensions?: string;
  material?: string;
  hasPassport: boolean;
  hasDrawing: boolean;
  isActive: boolean;
}

const productSchema = new Schema<IProduct>({
  sku: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  categoryId: { type: String, required: true, trim: true },
  productType: { type: String, enum: ['purchased', 'manufactured'], required: true },
  description: { type: String, trim: true, default: '' },
  basePrice: { type: Number, default: undefined },
  defaultMarkupPercent: { type: Number, default: undefined },
  unit: { type: String, required: true, trim: true, default: 'шт' },
  weightKg: { type: Number, default: undefined },
  dimensions: { type: String, trim: true, default: '' },
  material: { type: String, trim: true, default: '' },
  hasPassport: { type: Boolean, default: false },
  hasDrawing: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
