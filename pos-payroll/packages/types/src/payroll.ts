export interface PayPeriod {
  id: string;
  startDate: string; // ISO 8601
  endDate: string;
  payDate: string;
  status: 'draft' | 'approved' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export interface Deduction {
  name: string;
  amount: number;
  type: 'pre-tax' | 'post-tax';
}

export interface TaxWithholding {
  federalIncomeTax: number;
  stateIncomeTax: number;
  socialSecurity: number;
  medicare: number;
  caSDI: number; // California State Disability Insurance
  caVDI?: number; // Voluntary Disability Insurance
}

export interface PayStub {
  id: string;
  employeeId: string;
  payPeriodId: string;
  grossPay: number;
  regularHours?: number;
  overtimeHours?: number;
  regularPay: number;
  overtimePay: number;
  deductions: Deduction[];
  taxes: TaxWithholding;
  netPay: number;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export type CreatePayPeriodInput = Omit<PayPeriod, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
export type CreatePayStubInput = Omit<PayStub, 'id' | 'createdAt' | 'updatedAt'>;
