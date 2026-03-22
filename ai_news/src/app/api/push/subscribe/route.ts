import { NextRequest, NextResponse } from 'next/server';
import { loadSubscriptions, saveSubscriptions, PushSubscriptionRecord } from '@/lib/storage';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const sub = (await req.json()) as PushSubscriptionRecord;
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
  }

  const subs = await loadSubscriptions();
  const exists = subs.some((s) => s.endpoint === sub.endpoint);
  if (!exists) {
    subs.push(sub);
    await saveSubscriptions(subs);
  }

  return NextResponse.json({ ok: true, total: subs.length });
}
