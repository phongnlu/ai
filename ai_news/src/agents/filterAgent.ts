import Anthropic from '@anthropic-ai/sdk';
import { Article } from '@/types/article';
import { ANTHROPIC_API_KEY } from '@/config/env';

const AI_KEYWORDS = [
  'ai', 'llm', 'machine learning', 'neural', 'gpt', 'claude', 'gemini',
  'transformer', 'model', 'artificial intelligence', 'deep learning',
  'openai', 'anthropic', 'hugging face', 'inference', 'training',
  'benchmark', 'agent', 'diffusion', 'multimodal', 'embedding',
  'fine-tun', 'chatbot', 'generative',
  // Additional product-specific keywords
  'claude code', 'codex', 'copilot', 'cursor', 'deepmind', 'gemini',
  'chatgpt', 'gpt-4', 'gpt-5', 'o1', 'o3', 'sonnet', 'opus', 'mistral',
  'llama', 'deepseek', 'reasoning model', 'context window',
];

function scoreArticle(article: Article): number {
  const titleLower = article.title.toLowerCase();
  const summaryLower = article.summary.toLowerCase();
  let score = 0;
  for (const kw of AI_KEYWORDS) {
    if (titleLower.includes(kw)) score += 2;
    if (summaryLower.includes(kw)) score += 1;
  }
  return score;
}

async function checkWithClaude(article: Article): Promise<boolean> {
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 5,
      messages: [
        {
          role: 'user',
          content: `Is this article primarily about AI, machine learning, or related technology? Answer only "yes" or "no".\n\nTitle: ${article.title}\nSummary: ${article.summary.slice(0, 300)}`,
        },
      ],
    });
    const text = (msg.content[0] as { type: string; text: string }).text.toLowerCase().trim();
    return text.startsWith('yes');
  } catch {
    return false;
  }
}

export async function filterArticles(articles: Article[]): Promise<Article[]> {
  const results: Article[] = [];

  await Promise.all(
    articles.map(async (article) => {
      const score = scoreArticle(article);
      if (score >= 3) {
        results.push(article);
      } else if (score >= 1) {
        const relevant = await checkWithClaude(article);
        if (relevant) results.push(article);
      }
      // score === 0: drop silently
    })
  );

  return results;
}
