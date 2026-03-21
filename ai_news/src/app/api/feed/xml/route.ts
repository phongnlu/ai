import { NextResponse } from 'next/server';
import { loadFeedXml } from '@/lib/storage';

export async function GET(): Promise<NextResponse> {
  try {
    const xml = await loadFeedXml();
    if (!xml) {
      return new NextResponse('Feed not yet generated. POST /api/refresh to build.', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    });
  } catch {
    return new NextResponse('Failed to read feed', { status: 500 });
  }
}
