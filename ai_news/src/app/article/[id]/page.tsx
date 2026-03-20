import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { Article } from '@/types/article';
import ArticleActions from '@/components/ArticleActions';

const CATEGORY_COLORS: Record<string, string> = {
  research: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  product: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  policy: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'open-source': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

function loadArticles(): Article[] {
  try {
    const p = path.join(process.cwd(), 'data', 'articles.json');
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch { return []; }
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const articles = loadArticles();
  const article = articles.find((a) => a.id === params.id);
  if (!article) notFound();

  const related = articles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const pubDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
            ← Back to Feed
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[article.category]}`}>
          {article.category}
        </span>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {article.title}
        </h1>

        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
          <span>{article.source}</span>
          <span>·</span>
          <span>{pubDate}</span>
          {article.readTimeMinutes > 0 && <><span>·</span><span>{article.readTimeMinutes} min read</span></>}
        </div>

        {/* AI Summary card */}
        <div className="mt-8 p-5 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/40 rounded-r-lg">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
            AI Summary
          </p>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{article.summary}</p>
        </div>

        <ArticleActions articleId={article.id} sourceUrl={article.sourceUrl} />

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
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">{r.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{r.source}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
