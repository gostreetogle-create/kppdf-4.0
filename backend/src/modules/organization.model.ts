// ========================================
// Organization Model — организации (юр.лица / ИП)
// ========================================

import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  shortName: string;
  legalForm: string;
  inn: string;
  kpp: string;
  ogrn: string;
  phone: string;
  email: string;
  legalAddress: string;
  postalAddress: string;
  bankName: string;
  bankBik: string;
  bankAccount: string;
  signerName: string;
  signerPosition: string;
  /** ID ролей контрагента из справочника "Виды контрагентов" */
  counterpartyRoleIds: string[];
  /** Контактное лицо (для поставщиков) */
  contactPerson: string;
  /** Отсрочка платежа в днях (для поставщиков) */
  paymentTermDays: number;
  isActive: boolean;
}

const organizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true, trim: true },
  shortName: { type: String, trim: true, default: '' },
  legalForm: { type: String, trim: true, default: '' },
  inn: { type: String, trim: true, default: '' },
  kpp: { type: String, trim: true, default: '' },
  ogrn: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, lowercase: true, default: '' },
  legalAddress: { type: String, trim: true, default: '' },
  postalAddress: { type: String, trim: true, default: '' },
  bankName: { type: String, trim: true, default: '' },
  bankBik: { type: String, trim: true, default: '' },
  bankAccount: { type: String, trim: true, default: '' },
  signerName: { type: String, trim: true, default: '' },
  signerPosition: { type: String, trim: true, default: '' },
  counterpartyRoleIds: { type: [String], default: [] },
  contactPerson: { type: String, trim: true, default: '' },
  paymentTermDays: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

organizationSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id: id, __v, ...rest } = ret;
    return { id, ...rest };
  }
});

export const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);
