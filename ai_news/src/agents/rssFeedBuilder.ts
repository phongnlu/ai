import { Feed } from 'feed';
import { Article } from '@/types/article';
import { BASE_URL } from '@/config/env';
import { saveFeedXml } from '@/lib/storage';

export async function buildRssFeed(articles: Article[]): Promise<void> {
  const feed = new Feed({
    title: 'AI News Feed',
    description: 'Curated AI news with Claude-powered summaries',
    id: BASE_URL,
    link: BASE_URL,
    language: 'en',
    updated: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: { rss2: `${BASE_URL}/api/feed/xml` },
  });

  for (const article of articles) {
    feed.addItem({
      title: article.title,
      id: article.sourceUrl,
      link: article.sourceUrl,
      description: article.summary,
      date: new Date(article.publishedAt),
      category: [{ name: article.category }],
    });
  }

  await saveFeedXml(feed.rss2());
  console.log(`[rssFeedBuilder] Saved ${articles.length} articles to feed`);
}
