'use client';
import { useRef } from 'react';

const CATEGORIES = ['all', 'research', 'product', 'policy', 'open-source'] as const;
type Cat = (typeof CATEGORIES)[number];

interface CategoryFilterProps {
  active: string;
  counts: Record<string, number>;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ active, counts, onChange }: CategoryFilterProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (index + 1) % CATEGORIES.length;
      buttonRefs.current[next]?.focus();
      onChange(CATEGORIES[next]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (index - 1 + CATEGORIES.length) % CATEGORIES.length;
      buttonRefs.current[prev]?.focus();
      onChange(CATEGORIES[prev]);
    }
  };

  return (
    <div role="tablist" aria-label="Filter by category" className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((cat, i) => {
        const isActive = active === cat;
        const count = counts[cat] ?? 0;
        return (
          <button
            key={cat}
            ref={(el) => { buttonRefs.current[i] = el; }}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(cat)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-md transition-all duration-150 ${
              isActive
                ? 'font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            {count > 0 && (
              <span className="ml-1.5 text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
