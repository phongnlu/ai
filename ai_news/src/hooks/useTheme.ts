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

    // When in system mode, follow OS dark/light changes in real time
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const current = (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'system';
      if (current === 'system') applyTheme('system');
    };
    const visHandler = () => { if (document.visibilityState === 'visible') handler(); };
    try { mq.addEventListener('change', handler); }
    catch { try { (mq as unknown as { addListener: (h: () => void) => void }).addListener(handler); } catch { /* noop */ } }
    document.addEventListener('visibilitychange', visHandler);
    return () => {
      try { mq.removeEventListener('change', handler); }
      catch { try { (mq as unknown as { removeListener: (h: () => void) => void }).removeListener(handler); } catch { /* noop */ } }
      document.removeEventListener('visibilitychange', visHandler);
    };
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
