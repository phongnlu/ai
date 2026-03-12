import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Article, FeedResponse } from '@/types/article';

const DATA_PATH = path.join(process.cwd(), 'data', 'articles.json');

function loadArticles(): Article[] {
  try {
    if (!fs.existsSync(DATA_PATH)) return [];
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')) as Article[];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest): Promise<NextResponse<FeedResponse>> {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const pageSize = Math.max(1, parseInt(searchParams.get('pageSize') ?? '12', 10));
  const category = searchParams.get('category');
  const q = searchParams.get('q')?.toLowerCase();
  const sort = searchParams.get('sort') ?? 'latest';

  let articles = loadArticles();

  if (category && category !== 'all') {
    articles = articles.filter((a) => a.category === category);
  }

  if (q) {
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    );
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
  });
}
