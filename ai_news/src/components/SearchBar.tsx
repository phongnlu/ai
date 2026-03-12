'use client';
import { useRef, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

export default function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(v), 300);
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <div className="relative flex items-center">
      <svg className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        role="searchbox"
        aria-label="Search articles"
        defaultValue={value}
        onChange={handleInput}
        placeholder="Search AI news..."
        className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 rounded-lg outline-none transition-colors"
      />
      {value && (
        <button
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
