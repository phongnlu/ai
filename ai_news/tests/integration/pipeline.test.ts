import { runPipeline } from '@/agents/pipeline';
import { createArticle } from '../mocks/articleFactory';
import fs from 'fs';

jest.mock('fs');
jest.mock('@/agents/fetchAgent', () => ({ fetchArticles: jest.fn() }));
jest.mock('@/agents/filterAgent', () => ({ filterArticles: jest.fn() }));
jest.mock('@/agents/summarizeAgent', () => ({ summarizeArticles: jest.fn() }));
jest.mock('@/agents/rssFeedBuilder', () => ({ buildRssFeed: jest.fn() }));

import { fetchArticles } from '@/agents/fetchAgent';
import { filterArticles } from '@/agents/filterAgent';
import { summarizeArticles } from '@/agents/summarizeAgent';
import { buildRssFeed } from '@/agents/rssFeedBuilder';

const fetched = [createArticle(), createArticle(), createArticle()];
const filtered = fetched.slice(0, 2);
const summarized = filtered.map((a) => ({ ...a, summary: 'AI summary.' }));

beforeEach(() => {
  (fetchArticles as jest.Mock).mockResolvedValue(fetched);
  (filterArticles as jest.Mock).mockResolvedValue(filtered);
  (summarizeArticles as jest.Mock).mockResolvedValue(summarized);
  (buildRssFeed as jest.Mock).mockResolvedValue(undefined);
  (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
});

describe('pipeline', () => {
  it('runs agents in correct order', async () => {
    const order: string[] = [];
    (fetchArticles as jest.Mock).mockImplementation(async () => { order.push('fetch'); return fetched; });
    (filterArticles as jest.Mock).mockImplementation(async () => { order.push('filter'); return filtered; });
    (summarizeArticles as jest.Mock).mockImplementation(async () => { order.push('summarize'); return summarized; });
    (buildRssFeed as jest.Mock).mockImplementation(async () => { order.push('build'); });

    await runPipeline();
    expect(order).toEqual(['fetch', 'filter', 'summarize', 'build']);
  });

  it('saves articles to data/articles.json', async () => {
    await runPipeline();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('articles.json'),
      expect.any(String),
      'utf-8'
    );
  });

  it('returns the summarized articles', async () => {
    const result = await runPipeline();
    expect(result).toEqual(summarized);
  });
});
