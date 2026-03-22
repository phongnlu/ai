'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Article, FeedResponse } from '@/types/article';
import FeedHeader from '@/components/FeedHeader';
import CategoryFilter from '@/components/CategoryFilter';
import BrandFilter from '@/components/BrandFilter';
import ArticleCard from '@/components/ArticleCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';
import { useBookmarks } from '@/hooks/useBookmarks';

interface ToastState { message: string; type: 'success' | 'info' | 'error'; id: number; }

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchFeed = useCallback(async (p: number, cat: string, q: string, b: string, append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), pageSize: '12' });
      if (cat && cat !== 'all') params.set('category', cat);
      const query = [q, b].filter(Boolean).join(' ');
      if (query) params.set('q', query);
      const res = await fetch(`/api/feed?${params}`);
      const data: FeedResponse = await res.json();
      setArticles((prev) => append ? [...prev, ...data.articles] : data.articles);
      setTotal(data.total);
      setHasMore(data.hasMore);
      if (!append) setCategoryCounts(data.categoryCounts);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchFeed(1, category, search, brand);
  }, [category, search, brand, fetchFeed]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchFeed(next, category, search, brand, true);
  }, [loadingMore, hasMore, page, category, search, brand, fetchFeed]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const showToast = (message: string, type: ToastState['type']) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
  };

  const handleBookmark = (id: string) => {
    if (isBookmarked(id)) {
      removeBookmark(id);
      showToast('Article removed from bookmarks', 'info');
    } else {
      addBookmark(id);
      showToast('Article saved to bookmarks', 'success');
    }
  };

  return (
    <div className="min-h-screen">
      <FeedHeader
        search={search}
        onSearchChange={setSearch}
        onSearchClear={() => setSearch('')}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
        <div className="mb-4 flex flex-col gap-2">
          <CategoryFilter active={category} counts={categoryCounts} onChange={setCategory} />
          <BrandFilter active={brand} onChange={setBrand} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">No articles found.</p>
            {search && <button onClick={() => setSearch('')} className="text-blue-500 hover:underline">Clear search</button>}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <ArticleCard
                  key={a.id}
                  article={a}
                  isBookmarked={isBookmarked(a.id)}
                  onBookmarkToggle={handleBookmark}
                />
              ))}
            </div>
            <div className="flex flex-col items-center gap-3 mt-10">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {articles.length} of {total} articles
              </p>
              {loadingMore && (
                <p className="text-sm text-gray-400 dark:text-gray-500 animate-pulse">Loading more...</p>
              )}
              <div ref={sentinelRef} className="h-1" />
            </div>
          </>
        )}
      </main>

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onDismiss={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
          />
        ))}
      </div>
    </div>
  );
}
