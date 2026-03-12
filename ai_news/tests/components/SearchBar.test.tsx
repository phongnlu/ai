import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

jest.useFakeTimers();

const onChange = jest.fn();
const onClear = jest.fn();

describe('SearchBar', () => {
  afterEach(() => jest.clearAllMocks());

  it('input has aria-label="Search articles"', () => {
    render(<SearchBar value="" onChange={onChange} onClear={onClear} />);
    expect(screen.getByRole('searchbox', { name: /search articles/i })).toBeInTheDocument();
  });

  it('clear button is not visible when value is empty', () => {
    render(<SearchBar value="" onChange={onChange} onClear={onClear} />);
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('clear button appears when value is non-empty', () => {
    render(<SearchBar value="transformer" onChange={onChange} onClear={onClear} />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('clear button calls onClear', () => {
    render(<SearchBar value="gpt" onChange={onChange} onClear={onClear} />);
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(onClear).toHaveBeenCalled();
  });

  it('onChange is debounced by 300ms', () => {
    render(<SearchBar value="" onChange={onChange} onClear={onClear} />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'llm' } });
    expect(onChange).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(300));
    expect(onChange).toHaveBeenCalledWith('llm');
  });
});
