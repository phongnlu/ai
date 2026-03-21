import { NextRequest, NextResponse } from 'next/server';
import { FeedResponse } from '@/types/article';
import { loadArticles } from '@/lib/storage';

export async function GET(req: NextRequest): Promise<NextResponse<FeedResponse>> {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const pageSize = Math.max(1, parseInt(searchParams.get('pageSize') ?? '12', 10));
  const category = searchParams.get('category');
  const q = searchParams.get('q')?.toLowerCase();
  const sort = searchParams.get('sort') ?? 'latest';

  let articles = await loadArticles();

  if (q) {
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    );
  }

  // Compute per-category counts after search filter, before category filter
  const categoryCounts: Record<string, number> = { all: articles.length };
  for (const a of articles) {
    categoryCounts[a.category] = (categoryCounts[a.category] ?? 0) + 1;
  }

  if (category && category !== 'all') {
    articles = articles.filter((a) => a.category === category);
  }

  if (sort === 'latest') {
    articles = articles.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  const total = articles.length;
  const start = (page - 1) * pageSize;
  const paginated = articles.slice(start, start + pageSize);

  return NextResponse.json({
    articles: paginated,
    total,
    page,
    pageSize,
    hasMore: start + pageSize < total,
    categoryCounts,
  });
}
