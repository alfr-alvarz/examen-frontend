import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
  it('debe renderizar el mensaje de alerta', () => {
    render(<Alert>Este es un mensaje de alerta</Alert>);
    expect(screen.getByText('Este es un mensaje de alerta')).toBeInTheDocument();
  });

  it('debe aplicar la variante info por defecto', () => {
    const { container } = render(<Alert>Test</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert.className).toContain('bg-blue-500/10');
    expect(alert.className).toContain('text-blue-400');
  });

  it('debe aplicar la variante success cuando se especifica', () => {
    const { container } = render(<Alert variant="success">Test</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert.className).toContain('bg-green-500/10');
    expect(alert.className).toContain('text-green-400');
  });

  it('debe aplicar la variante error cuando se especifica', () => {
    const { container } = render(<Alert variant="error">Test</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert.className).toContain('bg-red-500/10');
    expect(alert.className).toContain('text-red-400');
  });

  it('debe aplicar la variante warning cuando se especifica', () => {
    const { container } = render(<Alert variant="warning">Test</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert.className).toContain('bg-yellow-500/10');
    expect(alert.className).toContain('text-yellow-400');
  });

  it('debe aplicar className personalizado', () => {
    const { container } = render(<Alert className="custom-class">Test</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert.className).toContain('custom-class');
  });

  it('debe renderizar contenido complejo', () => {
    render(
      <Alert>
        <strong>Error:</strong> Algo salió mal
      </Alert>
    );
    expect(screen.getByText('Error:')).toBeInTheDocument();
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
  });
});

