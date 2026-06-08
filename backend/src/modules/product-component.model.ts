// ========================================
// ProductComponent Model — компоненты товаров (BOM)
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IComponentMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface IComponentWorkType {
  id: string;
  name: string;
  department: string;
  normHours: number;
  sortOrder: number;
}

export interface IProductComponent extends Document {
  productId: string;
  name: string;
  quantityPerProduct: number;
  description?: string;
  drawingUrl?: string;
  sortOrder: number;
  materials: IComponentMaterial[];
  workTypes: IComponentWorkType[];
}

const materialSchema = new Schema<IComponentMaterial>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  notes: { type: String, default: '' },
}, { _id: false });

const workTypeSchema = new Schema<IComponentWorkType>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  normHours: { type: Number, required: true },
  sortOrder: { type: Number, required: true },
}, { _id: false });

const productComponentSchema = new Schema<IProductComponent>({
  productId: { type: String, required: true, trim: true, index: true },
  name: { type: String, required: true, trim: true },
  quantityPerProduct: { type: Number, required: true, default: 1 },
  description: { type: String, trim: true, default: '' },
  drawingUrl: { type: String, trim: true, default: '' },
  sortOrder: { type: Number, required: true, default: 0 },
  materials: [materialSchema],
  workTypes: [workTypeSchema],
}, { timestamps: true });

productComponentSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const ProductComponent = mongoose.model<IProductComponent>('ProductComponent', productComponentSchema);
