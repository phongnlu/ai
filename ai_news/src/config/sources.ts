import { Category } from '@/types/article';

export interface RssSource {
  name: string;
  url: string;
  category: Category;
}

export const RSS_SOURCES: RssSource[] = [
  {
    name: 'Hacker News AI',
    url: 'https://hnrss.org/newest?q=AI+LLM&count=50',
    category: 'product',
  },
  {
    name: 'ArXiv cs.AI',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    category: 'research',
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'research',
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    category: 'product',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    category: 'product',
  },
  // Claude / Anthropic
  {
    name: 'Anthropic News',
    url: 'https://www.anthropic.com/rss.xml',
    category: 'policy',
  },
  {
    name: 'Hacker News Claude',
    url: 'https://hnrss.org/newest?q=Claude+Anthropic&count=30',
    category: 'product',
  },
  // OpenAI / ChatGPT / Codex
  {
    name: 'OpenAI News',
    url: 'https://openai.com/news/rss.xml',
    category: 'product',
  },
  {
    name: 'Hacker News ChatGPT',
    url: 'https://hnrss.org/newest?q=ChatGPT+OpenAI+Codex&count=30',
    category: 'product',
  },
  // Google Gemini
  {
    name: 'Google DeepMind Blog',
    url: 'https://deepmind.google/blog/rss.xml',
    category: 'research',
  },
  {
    name: 'Hacker News Gemini',
    url: 'https://hnrss.org/newest?q=Gemini+Google+AI&count=30',
    category: 'product',
  },
];
