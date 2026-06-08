// ========================================
// FinancialReport Model — финансовые отчёты
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IFinancialReport extends Document {
  title: string;
  reportType: 'profit_loss' | 'cashflow' | 'receivables' | 'payables';
  periodStart: string;
  periodEnd: string;
  data?: Record<string, unknown>;
  totalAmount?: number;
  status: 'draft' | 'final';
  generatedAt?: string;
  notes?: string;
}

const financialReportSchema = new Schema<IFinancialReport>({
  title: { type: String, required: true, trim: true },
  reportType: { type: String, enum: ['profit_loss', 'cashflow', 'receivables', 'payables'], required: true },
  periodStart: { type: String, required: true, trim: true },
  periodEnd: { type: String, required: true, trim: true },
  data: { type: Schema.Types.Mixed, default: {} },
  totalAmount: { type: Number, default: undefined },
  status: { type: String, enum: ['draft', 'final'], required: true },
  generatedAt: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

financialReportSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const FinancialReport = mongoose.model<IFinancialReport>('FinancialReport', financialReportSchema);
