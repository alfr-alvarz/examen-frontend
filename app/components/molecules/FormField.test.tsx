import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';
import { Input } from '../atoms/Input';

describe('FormField', () => {
  it('debe renderizar el label', () => {
    render(
      <FormField label="Email">
        <Input />
      </FormField>
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('debe mostrar el asterisco cuando required es true', () => {
    render(
      <FormField label="Email" required>
        <Input />
      </FormField>
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('no debe mostrar el asterisco cuando required es false', () => {
    render(
      <FormField label="Email" required={false}>
        <Input />
      </FormField>
    );
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('debe mostrar el mensaje de error cuando se proporciona', () => {
    render(
      <FormField label="Email" error="Este campo es requerido">
        <Input />
      </FormField>
    );
    expect(screen.getByText('Este campo es requerido')).toBeInTheDocument();
  });

  it('debe pasar la prop error al Input cuando hay error', () => {
    const { container } = render(
      <FormField label="Email" error="Error">
        <Input />
      </FormField>
    );
    const input = container.querySelector('input');
    expect(input?.className).toContain('border-red-500/50');
  });

  it('debe aplicar htmlFor al label y al input', () => {
    render(
      <FormField label="Email" htmlFor="email-input">
        <Input />
      </FormField>
    );
    const label = screen.getByText('Email').closest('label');
    expect(label).toHaveAttribute('for', 'email-input');
  });

  it('debe renderizar el children correctamente', () => {
    render(
      <FormField label="Email">
        <Input data-testid="test-input" />
      </FormField>
    );
    expect(screen.getByTestId('test-input')).toBeInTheDocument();
  });
});

