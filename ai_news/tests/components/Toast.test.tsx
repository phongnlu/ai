import { render, screen, act } from '@testing-library/react';
import Toast from '@/components/Toast';

jest.useFakeTimers();

describe('Toast', () => {
  const onDismiss = jest.fn();

  afterEach(() => jest.clearAllMocks());

  it('renders the message text', () => {
    render(<Toast message="Article saved" type="success" onDismiss={onDismiss} />);
    expect(screen.getByText('Article saved')).toBeInTheDocument();
  });

  it('has role=status and aria-live=polite', () => {
    render(<Toast message="Test" type="info" onDismiss={onDismiss} />);
    const el = screen.getByRole('status');
    expect(el).toHaveAttribute('aria-live', 'polite');
  });

  it('calls onDismiss after 3 seconds', () => {
    render(<Toast message="Test" type="success" onDismiss={onDismiss} />);
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(3000));
    expect(onDismiss).toHaveBeenCalled();
  });
});
