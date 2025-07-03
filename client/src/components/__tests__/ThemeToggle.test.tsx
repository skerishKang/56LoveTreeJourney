import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/contexts/theme-context';

// Mock the useTheme hook
vi.mock('@/contexts/theme-context', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
  it('renders correctly', () => {
    const mockToggleTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    const mockToggleTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('shows correct aria-label for dark mode', () => {
    const mockToggleTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /switch to light mode/i });
    expect(button).toBeInTheDocument();
  });
});