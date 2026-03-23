'use client';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Theme: ${theme}. Click to cycle.`}
      title={theme === 'light' ? 'Light mode' : theme === 'dark' ? 'Dark mode' : 'Auto (system)'}
      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
    >
      {theme === 'light' && (
        /* Sun */
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      )}
      {theme === 'dark' && (
        /* Moon */
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
        </svg>
      )}
      {theme === 'system' && (
        /* Half sun / half moon — auto mode */
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          {/* Left half: sun rays */}
          <path strokeLinecap="round" d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M4.93 19.07l1.41-1.41M12 20v2" />
          {/* Circle split: left filled (dark), right open (light) */}
          <path d="M12 6a6 6 0 0 1 0 12V6z" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="6" />
          {/* Right half: moon-style tick */}
          <path strokeLinecap="round" d="M19.07 4.93l-1.41 1.41M22 12h-2M19.07 19.07l-1.41-1.41" />
        </svg>
      )}
    </button>
  );
}
