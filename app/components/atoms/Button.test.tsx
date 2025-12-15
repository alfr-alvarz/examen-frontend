import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('debe renderizar el botón con el texto proporcionado', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('debe aplicar la variante primary por defecto', () => {
    const { container } = render(<Button>Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('from-blue-600');
  });

  it('debe aplicar la variante secondary cuando se especifica', () => {
    const { container } = render(<Button variant="secondary">Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('from-slate-700');
  });

  it('debe aplicar la variante danger cuando se especifica', () => {
    const { container } = render(<Button variant="danger">Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('from-red-600');
  });

  it('debe aplicar la variante outline cuando se especifica', () => {
    const { container } = render(<Button variant="outline">Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('border-2');
  });

  it('debe aplicar el tamaño sm cuando se especifica', () => {
    const { container } = render(<Button size="sm">Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('px-3');
    expect(button?.className).toContain('text-sm');
  });

  it('debe aplicar el tamaño lg cuando se especifica', () => {
    const { container } = render(<Button size="lg">Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('px-6');
    expect(button?.className).toContain('text-lg');
  });

  it('debe aplicar fullWidth cuando se especifica', () => {
    const { container } = render(<Button fullWidth>Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('w-full');
  });

  it('debe estar deshabilitado cuando se pasa la prop disabled', () => {
    render(<Button disabled>Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('debe llamar onClick cuando se hace clic', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('debe pasar props HTML adicionales al botón', () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
    const button = screen.getByTestId('submit-btn');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('debe aplicar className personalizado', () => {
    const { container } = render(<Button className="custom-class">Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('custom-class');
  });
});

