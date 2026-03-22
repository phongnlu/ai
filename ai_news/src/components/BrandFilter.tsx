'use client';
import { useRef } from 'react';

export const BRANDS = [
  { label: 'All',         keyword: '' },
  { label: 'Claude Code', keyword: 'claude code' },
  { label: 'Anthropic',   keyword: 'anthropic' },
  { label: 'ChatGPT',     keyword: 'chatgpt' },
  { label: 'Gemini',      keyword: 'gemini' },
  { label: 'Codex',       keyword: 'codex' },
] as const;

interface BrandFilterProps {
  active: string;
  onChange: (keyword: string) => void;
}

export default function BrandFilter({ active, onChange }: BrandFilterProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (index + 1) % BRANDS.length;
      buttonRefs.current[next]?.focus();
      onChange(BRANDS[next].keyword);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (index - 1 + BRANDS.length) % BRANDS.length;
      buttonRefs.current[prev]?.focus();
      onChange(BRANDS[prev].keyword);
    }
  };

  return (
    <div role="tablist" aria-label="Filter by brand" className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
      {BRANDS.map(({ label, keyword }, i) => {
        const isActive = active === keyword;
        return (
          <button
            key={label}
            ref={(el) => { buttonRefs.current[i] = el; }}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(keyword)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`flex-shrink-0 px-3 py-1 text-xs rounded-full border transition-all duration-150 ${
              isActive
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
