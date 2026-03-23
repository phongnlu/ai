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

  const sorted = summarized.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  await buildRssFeed(sorted);
  await saveArticles(sorted);
  console.log(`[pipeline] Saved ${summarized.length} articles`);

  // Send push notification for each new article (cap at 5 most recent)
  const newArticles = sorted.filter((a) => !previousIds.has(a.id)).slice(0, 5);
  for (const article of newArticles) {
    await sendPushToAll({
      title: article.source,
      body: article.title,
      url: `https://ai-news.onesolution365.com/article/${article.id}`,
    });
  }
  if (newArticles.length > 0) {
    console.log(`[pipeline] Push sent for ${newArticles.length} new articles`);
  }

  return sorted;
}
