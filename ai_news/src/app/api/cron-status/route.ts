import { NextResponse } from 'next/server';
import { getCronStatus } from '@/lib/cronStatus';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(getCronStatus());
}
