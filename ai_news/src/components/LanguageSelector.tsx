'use client';

export type Language = 'en' | 'zh' | 'vi';

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'vi', label: 'Tiếng Việt' },
];

interface LanguageSelectorProps {
  active: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageSelector({ active, onChange }: LanguageSelectorProps) {
  const activeLabel = LANGUAGES.find((l) => l.code === active)?.label ?? 'EN';

  return (
    <div className="relative">
      <select
        value={active}
        onChange={(e) => onChange(e.target.value as Language)}
        aria-label="Select language"
        className="appearance-none pl-2 pr-6 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {LANGUAGES.map(({ code, label }) => (
          <option key={code} value={code}>{label}</option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400"
        fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
