import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('debe renderizar el badge con el texto proporcionado', () => {
    render(<Badge>Nuevo</Badge>);
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
  });

  it('debe aplicar la variante default por defecto', () => {
    const { container } = render(<Badge>Test</Badge>);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('bg-slate-700/50');
  });

  it('debe aplicar la variante success cuando se especifica', () => {
    const { container } = render(<Badge variant="success">Test</Badge>);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('bg-green-500/10');
    expect(badge?.className).toContain('text-green-400');
  });

  it('debe aplicar la variante danger cuando se especifica', () => {
    const { container } = render(<Badge variant="danger">Test</Badge>);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('bg-red-500/10');
    expect(badge?.className).toContain('text-red-400');
  });

  it('debe aplicar el tamaño sm cuando se especifica', () => {
    const { container } = render(<Badge size="sm">Test</Badge>);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('px-2');
    expect(badge?.className).toContain('text-xs');
  });

  it('debe aplicar el tamaño lg cuando se especifica', () => {
    const { container } = render(<Badge size="lg">Test</Badge>);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('px-4');
    expect(badge?.className).toContain('text-base');
  });

  it('debe aplicar className personalizado', () => {
    const { container } = render(<Badge className="custom-class">Test</Badge>);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('custom-class');
  });
});

