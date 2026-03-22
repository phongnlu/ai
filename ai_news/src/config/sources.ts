export interface RssSource {
  name: string;
  url: string;
}

export const RSS_SOURCES: RssSource[] = [
  {
    name: 'Hacker News AI',
    url: 'https://hnrss.org/newest?q=AI+LLM&count=50',
  },
  {
    name: 'ArXiv cs.AI',
    url: 'https://rss.arxiv.org/rss/cs.AI',
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  },
  // Claude / Anthropic
  {
    name: 'Anthropic News',
    url: 'https://www.anthropic.com/rss.xml',
  },
  {
    name: 'Hacker News Claude',
    url: 'https://hnrss.org/newest?q=Claude+Anthropic&count=30',
  },
  // OpenAI / ChatGPT / Codex
  {
    name: 'OpenAI News',
    url: 'https://openai.com/news/rss.xml',
  },
  {
    name: 'Hacker News ChatGPT',
    url: 'https://hnrss.org/newest?q=ChatGPT+OpenAI+Codex&count=30',
  },
  // Google Gemini
  {
    name: 'Google DeepMind Blog',
    url: 'https://deepmind.google/blog/rss.xml',
  },
  {
    name: 'Hacker News Gemini',
    url: 'https://hnrss.org/newest?q=Gemini+Google+AI&count=30',
  },
];
