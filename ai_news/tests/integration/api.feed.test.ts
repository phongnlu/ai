import { NextRequest } from 'next/server';
import { GET } from '@/app/api/feed/route';
import { createArticle } from '../mocks/articleFactory';
import fs from 'fs';

jest.mock('fs');

const articles = [
  createArticle({ category: 'research', title: 'Transformer benchmark study' }),
  createArticle({ category: 'research', title: 'LLM training efficiency' }),
  createArticle({ category: 'product', title: 'OpenAI launches new API' }),
  createArticle({ category: 'policy', title: 'EU regulates AI systems' }),
];

beforeEach(() => {
  (fs.existsSync as jest.Mock).mockReturnValue(true);
  (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(articles));
});

function makeRequest(params: Record<string, string> = {}) {
  const url = new URL('http://localhost:3000/api/feed');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url);
}

describe('GET /api/feed', () => {
  it('returns 200 with articles array', async () => {
    const res = await GET(makeRequest());
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data.articles)).toBe(true);
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('hasMore');
  });

  it('filters by category', async () => {
    const res = await GET(makeRequest({ category: 'research' }));
    const data = await res.json();
    expect(data.articles.every((a: { category: string }) => a.category === 'research')).toBe(true);
  });

  it('searches titles and summaries', async () => {
    const res = await GET(makeRequest({ q: 'transformer' }));
    const data = await res.json();
    expect(data.articles.length).toBeGreaterThan(0);
    expect(data.articles[0].title.toLowerCase()).toContain('transformer');
  });

  it('paginates correctly', async () => {
    const manyArticles = Array.from({ length: 15 }, () => createArticle());
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(manyArticles));
    const res = await GET(makeRequest({ page: '2', pageSize: '10' }));
    const data = await res.json();
    expect(data.articles.length).toBe(5);
    expect(data.page).toBe(2);
  });

  it('returns empty array when no data file exists', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const res = await GET(makeRequest());
    const data = await res.json();
    expect(data.articles).toEqual([]);
    expect(data.total).toBe(0);
  });
});
