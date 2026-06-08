// ========================================
// StatusWorkflow Model — статусные модели
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IStatusTransition {
  from: string;
  to: string;
  label: string;
  allowedRoleIds: string[];
}

export interface IStatusWorkflow extends Document {
  entityType: string;
  name: string;
  statuses: string[];
  transitions: IStatusTransition[];
}

const transitionSchema = new Schema<IStatusTransition>({
  from: { type: String, required: true },
  to: { type: String, required: true },
  label: { type: String, required: true },
  allowedRoleIds: [{ type: String }],
}, { _id: false });

const statusWorkflowSchema = new Schema<IStatusWorkflow>({
  entityType: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  statuses: [{ type: String }],
  transitions: [transitionSchema],
}, { timestamps: true });

statusWorkflowSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const StatusWorkflow = mongoose.model<IStatusWorkflow>('StatusWorkflow', statusWorkflowSchema);
