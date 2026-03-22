import { fetchArticles } from './fetchAgent';
import { filterArticles } from './filterAgent';
import { summarizeArticles } from './summarizeAgent';
import { buildRssFeed } from './rssFeedBuilder';
import { saveArticles, loadArticles } from '@/lib/storage';
import { sendPushToAll } from '@/lib/webPush';
import { Article } from '@/types/article';

export async function runPipeline(): Promise<Article[]> {
  console.log('[pipeline] Starting...');

  const previous = await loadArticles();
  const previousIds = new Set(previous.map((a) => a.id));

  const fetched = await fetchArticles();
  console.log(`[pipeline] Fetched ${fetched.length} articles`);

  const filtered = await filterArticles(fetched);
  console.log(`[pipeline] Filtered to ${filtered.length} articles`);

  const summarized = await summarizeArticles(filtered);
  console.log(`[pipeline] Summarized ${summarized.length} articles`);

  await buildRssFeed(summarized);
  await saveArticles(summarized);
  console.log(`[pipeline] Saved ${summarized.length} articles`);

  // Send push notification for new articles
  const newArticles = summarized.filter((a) => !previousIds.has(a.id));
  if (newArticles.length > 0) {
    const first = newArticles[0];
    await sendPushToAll({
      title: `${newArticles.length} new AI article${newArticles.length > 1 ? 's' : ''}`,
      body: first.title,
      url: `https://ai-news.onesolution365.com/article/${first.id}`,
    });
    console.log(`[pipeline] Push sent for ${newArticles.length} new articles`);
  }

  return summarized;
}
