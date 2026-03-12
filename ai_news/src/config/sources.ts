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
];
