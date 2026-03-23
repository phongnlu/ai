'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Language } from './LanguageSelector';

interface RelatedArticle {
  id: string;
  sourceUrl: string;
  title: string;
  source: string;
}

interface Props {
  articleId: string;
  sourceUrl: string;
  title: string;
  summary: string;
  related?: RelatedArticle[];
}

export default function ArticleTranslated({ articleId, sourceUrl, title, summary, related = [] }: Props) {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, { title: string; summary: string }>>({});
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && saved !== 'en') setLanguage(saved);
  }, []);

  useEffect(() => {
    if (language === 'en') { setTranslations({}); return; }
    setTranslating(true);
    const toTranslate = [
      { id: articleId, sourceUrl, title, summary },
      ...related.map((r) => ({ id: r.id, sourceUrl: r.sourceUrl, title: r.title, summary: '' })),
    ];
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles: toTranslate, targetLang: language }),
    })
      .then((r) => r.json())
      .then(({ translations: t }) => setTranslations(t ?? {}))
      .finally(() => setTranslating(false));
  }, [language, articleId, title, summary]); // eslint-disable-line react-hooks/exhaustive-deps

  const mainKey = sourceUrl || articleId;
  const displayTitle = translations[mainKey]?.title ?? title;
  const displaySummary = translations[mainKey]?.summary ?? summary;

  return (
    <>
      <div className="mt-4">
        {translating ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        ) : (
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            {displayTitle}
          </h1>
        )}
      </div>

      <div className="mt-8 p-5 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/40 rounded-r-lg">
        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
          AI Summary
        </p>
        {translating ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-full" />
            <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-4/5" />
            <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-3/5" />
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{displaySummary}</p>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/article/${r.id}`}
                className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
              >
                {translating ? (
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full mb-2" />
                ) : (
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                    {translations[r.sourceUrl || r.id]?.title ?? r.title}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">{r.source}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
