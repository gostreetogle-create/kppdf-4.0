// ========================================
// ProductionOrder Model — производственные заказы
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export type ProductionOrderStatus = 'accepted' | 'in_design' | 'in_production' | 'ready' | 'shipped' | 'closed';

export interface IProductionOrder extends Document {
  number: string;
  contractId: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  status: ProductionOrderStatus;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  notes?: string;
}

const productionOrderSchema = new Schema<IProductionOrder>({
  number: { type: String, required: true, unique: true, trim: true },
  contractId: { type: String, required: true, trim: true },
  productId: { type: String, required: true, trim: true },
  productName: { type: String, required: true, trim: true },
  productSku: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: ['accepted', 'in_design', 'in_production', 'ready', 'shipped', 'closed'],
    default: 'accepted',
  },
  plannedStartDate: { type: Date, default: undefined },
  plannedEndDate: { type: Date, default: undefined },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

productionOrderSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const ProductionOrder = mongoose.model<IProductionOrder>('ProductionOrder', productionOrderSchema);
