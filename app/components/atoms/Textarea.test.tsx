import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('debe renderizar el textarea', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('debe renderizar con el valor proporcionado', () => {
    render(<Textarea value="test value" onChange={() => {}} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('test value');
  });

  it('debe aplicar el estado de error cuando se especifica', () => {
    const { container } = render(<Textarea error />);
    const textarea = container.querySelector('textarea');
    expect(textarea?.className).toContain('border-red-500/50');
  });

  it('debe aplicar className personalizado', () => {
    const { container } = render(<Textarea className="custom-class" />);
    const textarea = container.querySelector('textarea');
    expect(textarea?.className).toContain('custom-class');
  });

  it('debe llamar onChange cuando se escribe', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Textarea onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('debe pasar props HTML adicionales', () => {
    render(<Textarea placeholder="Enter text" rows={5} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('placeholder', 'Enter text');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('debe estar deshabilitado cuando se pasa disabled', () => {
    render(<Textarea disabled />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('debe funcionar con ref', () => {
    const ref = { current: null };
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});

