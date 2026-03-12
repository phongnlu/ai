'use client';

interface BookmarkButtonProps {
  articleId: string;
  isBookmarked: boolean;
  onToggle: (id: string) => void;
}

export default function BookmarkButton({ articleId, isBookmarked, onToggle }: BookmarkButtonProps) {
  return (
    <button
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(articleId);
      }}
      className="p-1.5 rounded-md text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-150 active:scale-90"
    >
      {isBookmarked ? (
        <svg className="w-4 h-4 fill-yellow-500" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 3h14a1 1 0 0 1 1 1v17.27a.5.5 0 0 1-.78.42L12 17.27l-7.22 4.42A.5.5 0 0 1 4 21.27V4a1 1 0 0 1 1-1z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a1 1 0 0 1 1 1v17.27a.5.5 0 0 1-.78.42L12 17.27l-7.22 4.42A.5.5 0 0 1 4 21.27V4a1 1 0 0 1 1-1z" />
        </svg>
      )}
    </button>
  );
}
