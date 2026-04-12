import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@repo/api/lib/db';
import { PayStubModel } from '@repo/api/models/PayStub';
import type { CreatePayStubInput } from '@repo/types/src/payroll';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const payPeriodId = searchParams.get('payPeriodId');

  const query: Record<string, string> = {};
  if (employeeId) query['employeeId'] = employeeId;
  if (payPeriodId) query['payPeriodId'] = payPeriodId;

  const stubs = await PayStubModel.find(query).lean();

  return NextResponse.json({ data: stubs.map((s) => ({ ...s, id: String(s._id) })) });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const body: CreatePayStubInput = await request.json();
  const stub = await PayStubModel.create(body);

  return NextResponse.json({ data: { ...stub.toObject(), id: String(stub._id) } }, { status: 201 });
}
