import mongoose, { Document, Schema } from 'mongoose';

/** Настройки интеграции с 1С */
export interface IOneCSettings extends Document {
  enabled: boolean;
  baseUrl: string;
  username: string;
  password: string;
  mode: 'http' | 'odata' | 'file';
  syncIntervalMinutes: number;
  lastSyncAt?: Date;
  lastSyncStatus?: 'ok' | 'error';
  lastSyncMessage?: string;
}

const oneCSettingsSchema = new Schema<IOneCSettings>(
  {
    enabled: { type: Boolean, default: false },
    baseUrl: { type: String, default: '' },
    username: { type: String, default: '' },
    password: { type: String, default: '' },
    mode: { type: String, enum: ['http', 'odata', 'file'], default: 'http' },
    syncIntervalMinutes: { type: Number, default: 0 },
    lastSyncAt: { type: Date },
    lastSyncStatus: { type: String, enum: ['ok', 'error'] },
    lastSyncMessage: { type: String },
  },
  { timestamps: true }
);

export const OneCSettings = mongoose.model<IOneCSettings>('OneCSettings', oneCSettingsSchema);

/** Журнал синхронизаций с 1С */
export interface IOneCSyncLog extends Document {
  direction: 'import' | 'export';
  entities: string[];
  processed: number;
  errors: number;
  messages: string[];
  status: 'ok' | 'error';
}

const oneCSyncLogSchema = new Schema<IOneCSyncLog>(
  {
    direction: { type: String, enum: ['import', 'export'], required: true },
    entities: [{ type: String }],
    processed: { type: Number, default: 0 },
    errors: { type: Number, default: 0 },
    messages: [{ type: String }],
    status: { type: String, enum: ['ok', 'error'], required: true },
  },
  { timestamps: true }
);

export const OneCSyncLog = mongoose.model<IOneCSyncLog>('OneCSyncLog', oneCSyncLogSchema);
