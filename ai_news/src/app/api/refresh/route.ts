import { NextResponse } from 'next/server';
import { runPipeline } from '@/agents/pipeline';

export async function POST(): Promise<NextResponse> {
  try {
    const articles = await runPipeline();
    return NextResponse.json({
      success: true,
      count: articles.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
