'use client';
import { useState, useEffect, useCallback } from 'react';
import { Article } from '@/types/article';

const STORAGE_KEY = 'ai-news-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (articles: Article[]) => {
    setBookmarks(articles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  };

  const addBookmark = useCallback((article: Article) => {
    setBookmarks((prev) => {
      if (prev.some((a) => a.sourceUrl === article.sourceUrl)) return prev;
      const next = [...prev, article];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeBookmark = useCallback((sourceUrl: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((a) => a.sourceUrl !== sourceUrl);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback((sourceUrl: string) => bookmarks.some((a) => a.sourceUrl === sourceUrl), [bookmarks]);

  const clearAll = useCallback(() => persist([]), []);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, clearAll };
}
