import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './Label';

describe('Label', () => {
  it('debe renderizar el label con el texto proporcionado', () => {
    render(<Label>Nombre</Label>);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
  });

  it('debe mostrar el asterisco cuando required es true', () => {
    render(<Label required>Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('no debe mostrar el asterisco cuando required es false', () => {
    render(<Label required={false}>Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('debe aplicar htmlFor cuando se especifica', () => {
    render(<Label htmlFor="email-input">Email</Label>);
    const label = screen.getByText('Email').closest('label');
    expect(label).toHaveAttribute('for', 'email-input');
  });

  it('debe aplicar className personalizado', () => {
    const { container } = render(<Label className="custom-class">Test</Label>);
    const label = container.querySelector('label');
    expect(label?.className).toContain('custom-class');
  });

  it('debe pasar props HTML adicionales', () => {
    render(<Label data-testid="test-label">Test</Label>);
    const label = screen.getByTestId('test-label');
    expect(label).toBeInTheDocument();
  });
});

