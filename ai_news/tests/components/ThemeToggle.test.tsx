import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('renders a button with aria-label="Toggle theme"', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });

  it('clicking toggles dark class on document.documentElement', () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(btn);
    // After one click from 'system' -> 'light', then another -> 'dark'
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persists theme to localStorage on toggle', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(localStorage.getItem('theme')).toBeTruthy();
  });
});
