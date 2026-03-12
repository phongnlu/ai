'use client';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ai-news-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (ids: string[]) => {
    setBookmarks(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  };

  const addBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  const clearAll = useCallback(() => persist([]), []);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, clearAll };
}
