import { NextResponse } from 'next/server';
import { VAPID_PUBLIC_KEY } from '@/lib/webPush';

export async function GET(): Promise<NextResponse> {
  if (!VAPID_PUBLIC_KEY) {
    return NextResponse.json({ error: 'Push not configured' }, { status: 503 });
  }
  return NextResponse.json({ key: VAPID_PUBLIC_KEY });
}
