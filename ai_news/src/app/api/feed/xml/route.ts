import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FEED_PATH = path.join(process.cwd(), 'public', 'feed.xml');

export async function GET(): Promise<NextResponse> {
  try {
    if (!fs.existsSync(FEED_PATH)) {
      return new NextResponse('Feed not yet generated. POST /api/refresh to build.', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    const xml = fs.readFileSync(FEED_PATH, 'utf-8');
    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    });
  } catch {
    return new NextResponse('Failed to read feed', { status: 500 });
  }
}
