import { render, screen, fireEvent } from '@testing-library/react';
import BookmarkButton from '@/components/BookmarkButton';

const onToggle = jest.fn();

describe('BookmarkButton', () => {
  it('aria-pressed=false when not bookmarked', () => {
    render(<BookmarkButton articleId="a1" isBookmarked={false} onToggle={onToggle} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('aria-pressed=true when bookmarked', () => {
    render(<BookmarkButton articleId="a1" isBookmarked={true} onToggle={onToggle} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('aria-label is "Bookmark article" when not bookmarked', () => {
    render(<BookmarkButton articleId="a1" isBookmarked={false} onToggle={onToggle} />);
    expect(screen.getByRole('button', { name: /bookmark article/i })).toBeInTheDocument();
  });

  it('aria-label is "Remove bookmark" when bookmarked', () => {
    render(<BookmarkButton articleId="a1" isBookmarked={true} onToggle={onToggle} />);
    expect(screen.getByRole('button', { name: /remove bookmark/i })).toBeInTheDocument();
  });

  it('clicking calls onToggle with articleId', () => {
    render(<BookmarkButton articleId="a1" isBookmarked={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith('a1');
  });
});
