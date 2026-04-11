import { connectDB } from '../lib/db';
import { EmployeeModel } from '../models/Employee';
import { PayPeriodModel } from '../models/PayPeriod';

async function seed(): Promise<void> {
  await connectDB();

  // Clear existing data
  await EmployeeModel.deleteMany({});
  await PayPeriodModel.deleteMany({});

  // Seed employees
  await EmployeeModel.insertMany([
    {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      employmentType: 'full-time',
      paymentFrequency: 'biweekly',
      salary: 80000,
      startDate: '2023-01-01',
      status: 'active',
      department: 'Engineering',
      position: 'Software Engineer',
    },
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      employmentType: 'part-time',
      paymentFrequency: 'weekly',
      hourlyRate: 25,
      startDate: '2023-06-01',
      status: 'active',
      department: 'Support',
      position: 'Support Specialist',
    },
  ]);

  // Seed a pay period
  await PayPeriodModel.create({
    startDate: '2024-06-01',
    endDate: '2024-06-15',
    payDate: '2024-06-20',
    status: 'draft',
  });

  console.warn('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
