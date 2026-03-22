'use client';
import Link from 'next/link';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import PushNotificationButton from './PushNotificationButton';

interface FeedHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  onSearchClear: () => void;
}

export default function FeedHeader({ search, onSearchChange, onSearchClear }: FeedHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-blue-600 dark:text-blue-400">
            AI News
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/bookmarks"
              aria-label="Saved bookmarks"
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" d="M5 3h14a1 1 0 0 1 1 1v17.27a.5.5 0 0 1-.78.42L12 17.27l-7.22 4.42A.5.5 0 0 1 4 21.27V4a1 1 0 0 1 1-1z" />
              </svg>
            </Link>
            <PushNotificationButton />
            <ThemeToggle />
          </nav>
        </div>
        <div className="pb-2">
          <SearchBar value={search} onChange={onSearchChange} onClear={onSearchClear} />
        </div>
      </div>
    </header>
  );
}
