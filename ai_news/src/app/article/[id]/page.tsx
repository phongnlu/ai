import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleActions from '@/components/ArticleActions';
import ArticleTranslated from '@/components/ArticleTranslated';
import { loadArticles } from '@/lib/storage';

const CATEGORY_COLORS: Record<string, string> = {
  research: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  product: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  policy: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'open-source': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const articles = await loadArticles();
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

        <ArticleTranslated
          articleId={article.id}
          sourceUrl={article.sourceUrl}
          title={article.title}
          summary={article.summary}
          related={related.map((r) => ({ id: r.id, sourceUrl: r.sourceUrl, title: r.title, source: r.source }))}
        />

        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
          <span>{article.source}</span>
          <span>·</span>
          <span>{pubDate}</span>
          {article.readTimeMinutes > 0 && <><span>·</span><span>{article.readTimeMinutes} min read</span></>}
        </div>

        <ArticleActions articleId={article.id} sourceUrl={article.sourceUrl} />
      </main>
    </div>
  );
}
