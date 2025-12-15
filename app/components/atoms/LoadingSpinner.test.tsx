import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('debe renderizar el spinner', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('div[class*="animate-spin"]');
    expect(spinner).toBeInTheDocument();
  });

  it('debe aplicar el tamaño md por defecto', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('div[class*="w-8 h-8"]');
    expect(spinner).toBeInTheDocument();
  });

  it('debe aplicar el tamaño sm cuando se especifica', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector('div[class*="w-4 h-4"]');
    expect(spinner).toBeInTheDocument();
  });

  it('debe aplicar el tamaño lg cuando se especifica', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('div[class*="w-12 h-12"]');
    expect(spinner).toBeInTheDocument();
  });

  it('debe aplicar className personalizado', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom-class');
  });
});

