import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@repo/api/lib/db';
import { PayPeriodModel } from '@repo/api/models/PayPeriod';
import type { CreatePayPeriodInput } from '@repo/types/src/payroll';

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const periods = await PayPeriodModel.find().sort({ startDate: -1 }).lean();

  return NextResponse.json({ data: periods.map((p) => ({ ...p, id: String(p._id) })) });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const body: CreatePayPeriodInput = await request.json();
  const period = await PayPeriodModel.create(body);

  return NextResponse.json({ data: { ...period.toObject(), id: String(period._id) } }, { status: 201 });
}
