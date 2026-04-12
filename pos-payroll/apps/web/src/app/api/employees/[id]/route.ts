import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@repo/api/lib/db';
import { EmployeeModel } from '@repo/api/models/Employee';
import type { UpdateEmployeeInput } from '@repo/types/src/employee';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const employee = await EmployeeModel.findById(params.id).lean();
  if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ data: { ...employee, id: String(employee._id) } });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const body: UpdateEmployeeInput = await request.json();
  const employee = await EmployeeModel.findByIdAndUpdate(params.id, body, { new: true }).lean();
  if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ data: { ...employee, id: String(employee._id) } });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  await EmployeeModel.findByIdAndDelete(params.id);

  return NextResponse.json({ data: null });
}
