'use client';
import { useState } from 'react';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import { useBookmarks } from '@/hooks/useBookmarks';

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, clearAll } = useBookmarks();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">← Feed</Link>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Saved Articles {bookmarks.length > 0 && <span className="text-gray-400">({bookmarks.length})</span>}
            </h1>
          </div>
          {bookmarks.length > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear All
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M5 3h14a1 1 0 0 1 1 1v17.27a.5.5 0 0 1-.78.42L12 17.27l-7.22 4.42A.5.5 0 0 1 4 21.27V4a1 1 0 0 1 1-1z" />
            </svg>
            <p className="text-gray-500 mb-4">No saved articles yet.</p>
            <Link href="/" className="text-blue-600 hover:underline text-sm">Browse Feed →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((a) => (
              <ArticleCard
                key={a.sourceUrl}
                article={a}
                isBookmarked={true}
                onBookmarkToggle={() => removeBookmark(a.sourceUrl)}
              />
            ))}
          </div>
        )}
      </main>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm mx-4 shadow-xl">
            <h2 id="confirm-title" className="text-lg font-semibold mb-2">Clear all bookmarks?</h2>
            <p className="text-sm text-gray-500 mb-6">This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button onClick={() => { clearAll(); setShowConfirm(false); }} className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white">Clear All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
