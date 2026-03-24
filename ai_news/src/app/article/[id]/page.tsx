import { redirect } from 'next/navigation';
import ArticleView from '@/components/ArticleView';
import { loadArticles } from '@/lib/storage';

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const articles = await loadArticles();
  const article = articles.find((a) => a.id === params.id);
  if (!article) redirect('/');

  const related = articles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const pubDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <ArticleView
      article={article}
      related={related.map((r) => ({ id: r.id, sourceUrl: r.sourceUrl, title: r.title, source: r.source }))}
      pubDate={pubDate}
    />
  );
}
