import { fetchArticles } from '@/agents/fetchAgent';

jest.mock('rss-parser', () => {
  return jest.fn().mockImplementation(() => ({
    parseURL: jest.fn().mockImplementation((url: string) => {
      if (url.includes('error')) throw new Error('Network error');
      return Promise.resolve({
        items: [
          { title: 'AI Article 1', link: `${url}/1`, contentSnippet: 'Summary 1', pubDate: new Date().toISOString() },
          { title: 'AI Article 2', link: `${url}/2`, contentSnippet: 'Summary 2', pubDate: new Date().toISOString() },
        ],
      });
    }),
  }));
});

jest.mock('@/config/sources', () => ({
  RSS_SOURCES: [
    { name: 'Source A', url: 'https://source-a.com/feed' },
    { name: 'Source B', url: 'https://source-b.com/feed' },
  ],
}));

describe('fetchAgent', () => {
  it('fetches articles from all configured sources', async () => {
    const articles = await fetchArticles();
    expect(articles.length).toBe(4); // 2 sources × 2 items
  });

  it('maps RSS items to Article shape', async () => {
    const articles = await fetchArticles();
    const a = articles[0];
    expect(a).toHaveProperty('id');
    expect(a).toHaveProperty('title');
    expect(a).toHaveProperty('summary');
    expect(a).toHaveProperty('sourceUrl');
    expect(a).toHaveProperty('publishedAt');
    expect(a).toHaveProperty('category');
  });

  it('deduplicates articles by sourceUrl', async () => {
    const RSSParser = require('rss-parser');
    RSSParser.mockImplementationOnce(() => ({
      parseURL: jest.fn().mockResolvedValue({
        items: [{ title: 'Dup', link: 'https://same-url.com', contentSnippet: 'x', pubDate: new Date().toISOString() }],
      }),
    }));
    // Both sources return same URL — should deduplicate
    const articles = await fetchArticles();
    const urls = articles.map((a) => a.sourceUrl);
    const unique = new Set(urls);
    expect(unique.size).toBe(urls.length);
  });

  it('handles HTTP errors gracefully and returns partial results', async () => {
    jest.mock('@/config/sources', () => ({
      RSS_SOURCES: [
        { name: 'Good Source', url: 'https://good.com/feed' },
        { name: 'Bad Source', url: 'https://error.com/feed' },
      ],
    }));
    const articles = await fetchArticles();
    expect(articles.length).toBeGreaterThan(0);
  });
});
