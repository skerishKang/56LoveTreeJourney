import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import { OptimizedImage } from '@/components/optimized-image';

describe('OptimizedImage', () => {
  it('renders with loading state', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />);
    
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('handles image load success', async () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />);
    
    const img = screen.getByAltText('Test image');
    fireEvent.load(img);
    
    await waitFor(() => {
      expect(img).toHaveClass('opacity-100');
    });
  });

  it('handles image load error with fallback', async () => {
    const fallbackSrc = '/fallback.jpg';
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test image" 
        fallback={fallbackSrc}
      />
    );
    
    const img = screen.getByAltText('Test image');
    fireEvent.error(img);
    
    await waitFor(() => {
      expect(img).toHaveAttribute('src', fallbackSrc);
    });
  });

  it('optimizes YouTube thumbnail URLs', () => {
    const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    render(<OptimizedImage src={youtubeUrl} alt="YouTube video" />);
    
    const img = screen.getByAltText('YouTube video');
    expect(img.getAttribute('src')).toContain('img.youtube.com/vi/dQw4w9WgXcQ');
  });

  it('uses eager loading when priority is true', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" priority />);
    
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'eager');
  });
});