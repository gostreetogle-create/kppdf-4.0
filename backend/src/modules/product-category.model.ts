// ========================================
// ProductCategory Model — категории товаров
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IProductCategory extends Document {
  name: string;
  /** Префикс для артикула (SP, MF, OG, OS, MB, NV, PR) */
  prefix: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

const productCategorySchema = new Schema<IProductCategory>({
  name: { type: String, required: true, trim: true },
  prefix: { type: String, required: true, unique: true, trim: true, uppercase: true, minlength: 2, maxlength: 4 },
  description: { type: String, trim: true, default: '' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productCategorySchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const ProductCategory = mongoose.model<IProductCategory>('ProductCategory', productCategorySchema);
