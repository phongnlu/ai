'use client';
import BookmarkButton from './BookmarkButton';
import { useBookmarks } from '@/hooks/useBookmarks';

interface ArticleActionsProps {
  articleId: string;
  sourceUrl: string;
}

export default function ArticleActions({ articleId, sourceUrl }: ArticleActionsProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const bookmarked = isBookmarked(articleId);

  const handleToggle = () => {
    if (bookmarked) removeBookmark(articleId);
    else addBookmark(articleId);
  };

  return (
    <div className="mt-8 flex items-center gap-3">
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Read Original Article →
      </a>
      <BookmarkButton
        articleId={articleId}
        isBookmarked={bookmarked}
        onToggle={handleToggle}
      />
    </div>
  );
}
