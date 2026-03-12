import { buildRssFeed } from '@/agents/rssFeedBuilder';
import { createArticle } from '../mocks/articleFactory';
import fs from 'fs';
import path from 'path';

jest.mock('@/config/env', () => ({ BASE_URL: 'http://localhost:3000' }));
jest.mock('fs');

describe('rssFeedBuilder', () => {
  const mockWriteFileSync = fs.writeFileSync as jest.Mock;
  let writtenContent = '';

  beforeEach(() => {
    mockWriteFileSync.mockImplementation((_p: string, content: string) => {
      writtenContent = content;
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('generates valid RSS 2.0 XML', async () => {
    await buildRssFeed([createArticle()]);
    expect(writtenContent).toContain('<?xml');
    expect(writtenContent).toContain('<rss');
    expect(writtenContent).toContain('<channel>');
  });

  it('includes all articles as items', async () => {
    const articles = [createArticle(), createArticle(), createArticle()];
    await buildRssFeed(articles);
    const itemCount = (writtenContent.match(/<item>/g) ?? []).length;
    expect(itemCount).toBe(3);
  });

  it('each item has required fields', async () => {
    await buildRssFeed([createArticle({ title: 'Test Title', sourceUrl: 'https://example.com/test' })]);
    expect(writtenContent).toContain('<title>');
    expect(writtenContent).toContain('<link>');
    expect(writtenContent).toContain('<pubDate>');
    expect(writtenContent).toContain('<description>');
  });

  it('writes to public/feed.xml', async () => {
    await buildRssFeed([createArticle()]);
    const calledPath = mockWriteFileSync.mock.calls[0][0] as string;
    expect(calledPath).toContain(path.join('public', 'feed.xml'));
  });
});
