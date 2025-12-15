import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const mockOptions = [
  { value: '1', label: 'Opción 1' },
  { value: '2', label: 'Opción 2' },
  { value: '3', label: 'Opción 3' },
];

describe('Select', () => {
  it('debe renderizar el select', () => {
    render(<Select options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('debe renderizar todas las opciones', () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByText('Opción 1')).toBeInTheDocument();
    expect(screen.getByText('Opción 2')).toBeInTheDocument();
    expect(screen.getByText('Opción 3')).toBeInTheDocument();
  });

  it('debe aplicar el estado de error cuando se especifica', () => {
    const { container } = render(<Select options={mockOptions} error />);
    const select = container.querySelector('select');
    expect(select?.className).toContain('border-red-500/50');
  });

  it('debe aplicar className personalizado', () => {
    const { container } = render(<Select options={mockOptions} className="custom-class" />);
    const select = container.querySelector('select');
    expect(select?.className).toContain('custom-class');
  });

  it('debe llamar onChange cuando se cambia la selección', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Select options={mockOptions} onChange={handleChange} />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '2');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('debe pasar props HTML adicionales', () => {
    render(<Select options={mockOptions} name="test-select" data-testid="test-select" />);
    const select = screen.getByTestId('test-select');
    expect(select).toHaveAttribute('name', 'test-select');
  });

  it('debe estar deshabilitado cuando se pasa disabled', () => {
    render(<Select options={mockOptions} disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('debe funcionar con ref', () => {
    const ref = { current: null };
    render(<Select options={mockOptions} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('debe seleccionar el valor por defecto', () => {
    render(<Select options={mockOptions} defaultValue="2" />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('2');
  });
});

