import { render, screen, fireEvent } from '@testing-library/react';
import ArticleCard from '@/components/ArticleCard';
import { createArticle } from '../mocks/articleFactory';

jest.mock('next/link', () => ({ __esModule: true, default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a> }));

const article = createArticle({ title: 'GPT-5 Achieves Human-Level Reasoning', category: 'research' });
const onToggle = jest.fn();

describe('ArticleCard', () => {
  it('renders article title', () => {
    render(<ArticleCard article={article} isBookmarked={false} onBookmarkToggle={onToggle} />);
    expect(screen.getByText(article.title)).toBeInTheDocument();
  });

  it('renders article summary', () => {
    render(<ArticleCard article={article} isBookmarked={false} onBookmarkToggle={onToggle} />);
    expect(screen.getByText(article.summary)).toBeInTheDocument();
  });

  it('shows correct category badge', () => {
    render(<ArticleCard article={article} isBookmarked={false} onBookmarkToggle={onToggle} />);
    expect(screen.getByText('research')).toBeInTheDocument();
  });

  it('has role=article', () => {
    render(<ArticleCard article={article} isBookmarked={false} onBookmarkToggle={onToggle} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('bookmark button calls onBookmarkToggle when clicked', () => {
    render(<ArticleCard article={article} isBookmarked={false} onBookmarkToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button', { name: /bookmark/i }));
    expect(onToggle).toHaveBeenCalledWith(article.id);
  });
});
