import Anthropic from '@anthropic-ai/sdk';
import { Article } from '@/types/article';
import { ANTHROPIC_API_KEY } from '@/config/env';


const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

async function summarizeOne(article: Article): Promise<Article> {
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Summarize this article in 2-3 sentences for a tech-savvy audience.

Title: ${article.title}
Content: ${article.summary.slice(0, 1000)}

Respond with JSON only: {"summary": "..."}`,
        },
      ],
    });

    const raw = (msg.content[0] as { type: string; text: string }).text.trim();
    const json = JSON.parse(raw.replace(/^```json\n?|\n?```$/g, ''));
    const summary: string = json.summary ?? article.summary;

    return {
      ...article,
      summary,
      readTimeMinutes: Math.max(1, Math.ceil(summary.split(' ').length / 200)),
    };
  } catch {
    return {
      ...article,
      readTimeMinutes: Math.max(1, Math.ceil(article.summary.split(' ').length / 200)),
    };
  }
}

export async function summarizeArticles(articles: Article[]): Promise<Article[]> {
  // Process in batches of 5 to avoid rate limits
  const results: Article[] = [];
  for (let i = 0; i < articles.length; i += 5) {
    const batch = articles.slice(i, i + 5);
    const summarized = await Promise.all(batch.map(summarizeOne));
    results.push(...summarized);
  }
  return results;
}
