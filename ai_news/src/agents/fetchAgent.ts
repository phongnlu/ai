import RSSParser from 'rss-parser';
import { v4 as uuidv4 } from 'uuid';
import { Article } from '@/types/article';
import { RSS_SOURCES } from '@/config/sources';

const parser = new RSSParser();

export async function fetchArticles(): Promise<Article[]> {
  const allArticles: Article[] = [];
  const seenUrls = new Set<string>();

  await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        for (const item of feed.items ?? []) {
          const url = item.link ?? item.guid;
          if (!url || seenUrls.has(url)) continue;
          seenUrls.add(url);

          allArticles.push({
            id: uuidv4(),
            title: item.title ?? 'Untitled',
            summary: item.contentSnippet ?? item.content ?? '',
            category: 'product', // default; overridden by summarizeAgent
            source: source.name,
            sourceUrl: url,
            publishedAt: item.pubDate
              ? new Date(item.pubDate).toISOString()
              : new Date().toISOString(),
            readTimeMinutes: 0,
            imageUrl: item.enclosure?.url ?? null,
            tags: [],
          });
        }
      } catch (err) {
        console.error(`[fetchAgent] Failed to fetch ${source.name}:`, err);
      }
    })
  );

  return allArticles;
}
