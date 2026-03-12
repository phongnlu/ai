'use client';
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'system';
    setTheme(stored);
    applyTheme(stored);
  }, []);

  const setAndPersist = (t: Theme) => {
    setTheme(t);
    localStorage.setItem(STORAGE_KEY, t);
    applyTheme(t);
  };

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setAndPersist(next);
  };

  return { theme, toggle, setTheme: setAndPersist };
}
