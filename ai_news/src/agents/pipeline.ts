import fs from 'fs';
import path from 'path';
import { fetchArticles } from './fetchAgent';
import { filterArticles } from './filterAgent';
import { summarizeArticles } from './summarizeAgent';
import { buildRssFeed } from './rssFeedBuilder';
import { Article } from '@/types/article';

const DATA_PATH = path.join(process.cwd(), 'data', 'articles.json');

export async function runPipeline(): Promise<Article[]> {
  console.log('[pipeline] Starting...');

  const fetched = await fetchArticles();
  console.log(`[pipeline] Fetched ${fetched.length} articles`);

  const filtered = await filterArticles(fetched);
  console.log(`[pipeline] Filtered to ${filtered.length} articles`);

  const summarized = await summarizeArticles(filtered);
  console.log(`[pipeline] Summarized ${summarized.length} articles`);

  await buildRssFeed(summarized);

  fs.writeFileSync(DATA_PATH, JSON.stringify(summarized, null, 2), 'utf-8');
  console.log(`[pipeline] Saved to ${DATA_PATH}`);

  return summarized;
}
