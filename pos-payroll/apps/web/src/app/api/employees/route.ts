import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@repo/api/lib/db';
import { EmployeeModel } from '@repo/api/models/Employee';
import type { CreateEmployeeInput } from '@repo/types/src/employee';
import type { PaginatedResponse } from '@repo/types/src/api';
import type { Employee } from '@repo/types/src/employee';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('pageSize') ?? '20');
  const search = searchParams.get('search') ?? '';

  const query = search
    ? {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const [employees, total] = await Promise.all([
    EmployeeModel.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    EmployeeModel.countDocuments(query),
  ]);

  const response: PaginatedResponse<Employee> = {
    data: employees.map((e) => ({ ...e, id: String(e._id) })) as unknown as Employee[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const body: CreateEmployeeInput = await request.json();
  const employee = await EmployeeModel.create(body);

  return NextResponse.json({ data: { ...employee.toObject(), id: String(employee._id) } }, { status: 201 });
}
