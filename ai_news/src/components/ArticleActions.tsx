'use client';
import BookmarkButton from './BookmarkButton';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Article } from '@/types/article';

interface ArticleActionsProps {
  article: Article;
}

export default function ArticleActions({ article }: ArticleActionsProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const bookmarked = isBookmarked(article.sourceUrl);

  const handleToggle = () => {
    if (bookmarked) removeBookmark(article.sourceUrl);
    else addBookmark(article);
  };

  return (
    <div className="mt-8 flex items-center gap-3">
      <a
        href={article.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Read Original Article →
      </a>
      <BookmarkButton
        articleId={article.id}
        isBookmarked={bookmarked}
        onToggle={handleToggle}
      />
    </div>
  );
}
