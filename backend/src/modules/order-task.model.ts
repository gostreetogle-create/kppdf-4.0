// ========================================
// OrderTask Model — задачи производственного заказа
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'done' | 'cancelled';

export interface IOrderTask extends Document {
  productionOrderId: string;
  componentId: string;
  componentName: string;
  workTypeId: string;
  workTypeName: string;
  workerId?: string;
  status: TaskStatus;
  plannedHours: number;
  actualHours?: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  dependsOnTaskIds: string[];
  sortOrder: number;
  notes?: string;
}

const orderTaskSchema = new Schema<IOrderTask>({
  productionOrderId: { type: String, required: true, trim: true, index: true },
  componentId: { type: String, required: true, trim: true },
  componentName: { type: String, required: true, trim: true },
  workTypeId: { type: String, required: true, trim: true },
  workTypeName: { type: String, required: true, trim: true },
  workerId: { type: String, trim: true, default: undefined },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'done', 'cancelled'],
    default: 'pending',
  },
  plannedHours: { type: Number, required: true, min: 0 },
  actualHours: { type: Number, default: undefined },
  plannedStartDate: { type: String, default: undefined },
  plannedEndDate: { type: String, default: undefined },
  actualStartDate: { type: String, default: undefined },
  actualEndDate: { type: String, default: undefined },
  dependsOnTaskIds: { type: [{ type: String, trim: true }], default: [] },
  sortOrder: { type: Number, default: 0 },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

orderTaskSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const OrderTask = mongoose.model<IOrderTask>('OrderTask', orderTaskSchema);
