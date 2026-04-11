import mongoose, { Schema, Document } from 'mongoose';
import type { Employee } from '@repo/types/src/employee';

export type EmployeeDocument = Omit<Employee, 'id'> & Document;

const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
});

const EmployeeSchema = new Schema<EmployeeDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    address: { type: AddressSchema },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contractor'],
      required: true,
    },
    paymentFrequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'semimonthly', 'monthly'],
      required: true,
    },
    hourlyRate: { type: Number },
    salary: { type: Number },
    startDate: { type: String, required: true },
    endDate: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive', 'terminated'],
      default: 'active',
    },
    department: { type: String },
    position: { type: String },
  },
  { timestamps: true },
);

export const EmployeeModel =
  mongoose.models['Employee'] ?? mongoose.model<EmployeeDocument>('Employee', EmployeeSchema);
