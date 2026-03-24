'use client';
import { useState, useEffect } from 'react';
import BackButton from './BackButton';
import ArticleTranslated from './ArticleTranslated';
import ArticleActions from './ArticleActions';
import LanguageSelector, { Language } from './LanguageSelector';
import { Article } from '@/types/article';

const CATEGORY_COLORS: Record<string, string> = {
  research: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  product: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  policy: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'open-source': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

interface Props {
  article: Article;
  related: { id: string; sourceUrl: string; title: string; source: string }[];
  pubDate: string;
}

export default function ArticleView({ article, related, pubDate }: Props) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && saved !== 'en') setLanguage(saved);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <BackButton />
          <LanguageSelector active={language} onChange={setLanguage} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[article.category]}`}>
          {article.category}
        </span>

        <ArticleTranslated
          articleId={article.id}
          sourceUrl={article.sourceUrl}
          title={article.title}
          summary={article.summary}
          related={related}
          language={language}
        />

        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
          <span>{article.source}</span>
          <span>·</span>
          <span>{pubDate}</span>
          {article.readTimeMinutes > 0 && <><span>·</span><span>{article.readTimeMinutes} min read</span></>}
        </div>

        <ArticleActions article={article} />
      </main>
    </div>
  );
}
