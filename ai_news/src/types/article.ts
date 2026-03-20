export type Category = 'research' | 'product' | 'policy' | 'open-source';

export interface Article {
  id: string;
  title: string;
  summary: string;
  category: Category;
  source: string;
  sourceUrl: string;
  publishedAt: string; // ISO 8601
  readTimeMinutes: number;
  imageUrl: string | null;
  tags: string[];
}

export interface FeedResponse {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  categoryCounts: Record<string, number>;
}
