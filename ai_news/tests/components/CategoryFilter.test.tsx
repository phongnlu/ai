import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from '@/components/CategoryFilter';

const counts = { all: 48, research: 12, product: 15, policy: 9, 'open-source': 12 };
const onChange = jest.fn();

describe('CategoryFilter', () => {
  it('renders all category tabs', () => {
    render(<CategoryFilter active="all" counts={counts} onChange={onChange} />);
    expect(screen.getByRole('tab', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /research/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /product/i })).toBeInTheDocument();
  });

  it('has role=tablist on container', () => {
    render(<CategoryFilter active="all" counts={counts} onChange={onChange} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('active tab has aria-selected=true', () => {
    render(<CategoryFilter active="research" counts={counts} onChange={onChange} />);
    const researchTab = screen.getByRole('tab', { name: /research/i });
    expect(researchTab).toHaveAttribute('aria-selected', 'true');
  });

  it('inactive tabs have aria-selected=false', () => {
    render(<CategoryFilter active="all" counts={counts} onChange={onChange} />);
    const researchTab = screen.getByRole('tab', { name: /research/i });
    expect(researchTab).toHaveAttribute('aria-selected', 'false');
  });

  it('clicking a tab calls onChange with category', () => {
    render(<CategoryFilter active="all" counts={counts} onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: /product/i }));
    expect(onChange).toHaveBeenCalledWith('product');
  });
});
