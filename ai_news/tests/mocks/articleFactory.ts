import { Article } from '@/types/article';

let counter = 0;

export function createArticle(overrides: Partial<Article> = {}): Article {
  counter++;
  return {
    id: `article-${counter}`,
    title: `Test Article ${counter}: Advances in Large Language Models`,
    summary: 'Researchers have released a new benchmark showing significant improvements in AI reasoning tasks. The study evaluates multiple frontier models across diverse problem domains.',
    category: 'research',
    source: 'MIT Tech Review',
    sourceUrl: `https://example.com/article-${counter}`,
    publishedAt: new Date(Date.now() - counter * 3_600_000).toISOString(),
    readTimeMinutes: 3,
    imageUrl: null,
    tags: ['llm', 'benchmark', 'research'],
    ...overrides,
  };
}
