import { fetchArticles } from './fetchAgent';
import { filterArticles } from './filterAgent';
import { summarizeArticles } from './summarizeAgent';
import { buildRssFeed } from './rssFeedBuilder';
import { saveArticles } from '@/lib/storage';
import { Article } from '@/types/article';

export async function runPipeline(): Promise<Article[]> {
  console.log('[pipeline] Starting...');

  const fetched = await fetchArticles();
  console.log(`[pipeline] Fetched ${fetched.length} articles`);

  const filtered = await filterArticles(fetched);
  console.log(`[pipeline] Filtered to ${filtered.length} articles`);

  const summarized = await summarizeArticles(filtered);
  console.log(`[pipeline] Summarized ${summarized.length} articles`);

  await buildRssFeed(summarized);
  await saveArticles(summarized);
  console.log(`[pipeline] Saved ${summarized.length} articles`);

  return summarized;
}
