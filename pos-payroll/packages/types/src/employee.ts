export type EmploymentType = 'full-time' | 'part-time' | 'contractor';
export type PaymentFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
export type EmployeeStatus = 'active' | 'inactive' | 'terminated';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: Address;
  employmentType: EmploymentType;
  paymentFrequency: PaymentFrequency;
  hourlyRate?: number;
  salary?: number;
  startDate: string; // ISO 8601
  endDate?: string;
  status: EmployeeStatus;
  department?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateEmployeeInput = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
