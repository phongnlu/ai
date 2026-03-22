import { NextRequest, NextResponse } from 'next/server';
import { loadSubscriptions, saveSubscriptions } from '@/lib/storage';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { endpoint } = (await req.json()) as { endpoint: string };
  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
  }

  const subs = await loadSubscriptions();
  const filtered = subs.filter((s) => s.endpoint !== endpoint);
  await saveSubscriptions(filtered);

  return NextResponse.json({ ok: true, total: filtered.length });
}
