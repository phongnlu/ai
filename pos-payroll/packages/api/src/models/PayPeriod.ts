import mongoose, { Schema, Document } from 'mongoose';
import type { PayPeriod } from '@repo/types/src/payroll';

export type PayPeriodDocument = Omit<PayPeriod, 'id'> & Document;

const PayPeriodSchema = new Schema<PayPeriodDocument>(
  {
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    payDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'approved', 'paid'],
      default: 'draft',
    },
  },
  { timestamps: true },
);

export const PayPeriodModel =
  mongoose.models['PayPeriod'] ?? mongoose.model<PayPeriodDocument>('PayPeriod', PayPeriodSchema);
