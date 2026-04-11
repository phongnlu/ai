import mongoose, { Schema, Document } from 'mongoose';
import type { PayStub } from '@repo/types/src/payroll';

export type PayStubDocument = Omit<PayStub, 'id'> & Document;

const DeductionSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['pre-tax', 'post-tax'], required: true },
});

const TaxSchema = new Schema({
  federalIncomeTax: { type: Number, required: true },
  stateIncomeTax: { type: Number, required: true },
  socialSecurity: { type: Number, required: true },
  medicare: { type: Number, required: true },
  caSDI: { type: Number, required: true },
  caVDI: { type: Number },
});

const PayStubSchema = new Schema<PayStubDocument>(
  {
    employeeId: { type: String, required: true, index: true },
    payPeriodId: { type: String, required: true, index: true },
    grossPay: { type: Number, required: true },
    regularHours: { type: Number },
    overtimeHours: { type: Number },
    regularPay: { type: Number, required: true },
    overtimePay: { type: Number, required: true, default: 0 },
    deductions: { type: [DeductionSchema], default: [] },
    taxes: { type: TaxSchema, required: true },
    netPay: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const PayStubModel =
  mongoose.models['PayStub'] ?? mongoose.model<PayStubDocument>('PayStub', PayStubSchema);
