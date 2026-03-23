import Link from 'next/link';
import { Article } from '@/types/article';
import BookmarkButton from './BookmarkButton';

const CATEGORY_COLORS: Record<string, string> = {
  research: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  product: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  policy: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'open-source': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface ArticleCardProps {
  article: Article;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string) => void;
  translation?: { title: string; summary: string };
  translating?: boolean;
}

export default function ArticleCard({ article, isBookmarked, onBookmarkToggle, translation, translating }: ArticleCardProps) {
  const title = translation?.title ?? article.title;
  const summary = translation?.summary ?? article.summary;
  const pending = translating && !translation;
  return (
    <article className="relative flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 overflow-hidden">
      <Link href={`/article/${article.id}`} className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between mb-3 pr-7">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category] ?? ''}`}>
            {article.category}
          </span>
          {article.readTimeMinutes > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {article.readTimeMinutes} min read
            </span>
          )}
        </div>

        {pending ? (
          <div className="mb-2 space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
          </div>
        ) : (
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 leading-snug">
            {title}
          </h2>
        )}

        {pending ? (
          <div className="flex-1 mb-4 space-y-2 animate-pulse">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5" />
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-1 mb-4">
            {summary}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium truncate max-w-[60%]">{article.source}</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
      </Link>

      <div className="absolute top-4 right-4">
        <BookmarkButton
          articleId={article.id}
          isBookmarked={isBookmarked}
          onToggle={onBookmarkToggle}
        />
      </div>
    </article>
  );
}
