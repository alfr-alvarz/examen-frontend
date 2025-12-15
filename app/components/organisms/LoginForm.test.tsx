import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it('debe renderizar el formulario de login', () => {
    renderWithRouter(<LoginForm onSubmit={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('debe renderizar los campos de correo y contraseña', () => {
    renderWithRouter(<LoginForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  it('debe mostrar error cuando el correo está vacío', async () => {
    renderWithRouter(<LoginForm onSubmit={vi.fn()} />);
    
    const form = screen.getByRole('button', { name: /Iniciar Sesión/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    expect(await screen.findByText('El correo electrónico es requerido')).toBeInTheDocument();
  });

  it('debe mostrar error cuando la contraseña está vacía', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm onSubmit={vi.fn()} />);
    
    const correoInput = screen.getByLabelText(/Correo Electrónico/i);
    await user.type(correoInput, 'test@example.com');
    
    const form = screen.getByRole('button', { name: /Iniciar Sesión/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    expect(await screen.findByText('La contraseña es requerida')).toBeInTheDocument();
  });

  it('debe mostrar error cuando el correo no es válido', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm onSubmit={vi.fn()} />);
    
    const correoInput = screen.getByLabelText(/Correo Electrónico/i);
    await user.type(correoInput, 'correo-invalido');
    
    const form = screen.getByRole('button', { name: /Iniciar Sesión/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    expect(await screen.findByText(/correo electrónico válido/i)).toBeInTheDocument();
  });

  it('debe llamar onSubmit con los valores correctos cuando el formulario es válido', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithRouter(<LoginForm onSubmit={handleSubmit} />);
    
    const correoInput = screen.getByLabelText(/Correo Electrónico/i);
    const contrasenaInput = screen.getByLabelText(/Contraseña/i);
    
    await user.type(correoInput, 'test@example.com');
    await user.type(contrasenaInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    await user.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('debe mostrar el estado de carga cuando isLoading es true', () => {
    renderWithRouter(<LoginForm onSubmit={vi.fn()} isLoading={true} />);
    expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('debe mostrar error cuando onSubmit lanza una excepción', async () => {
    const handleSubmit = vi.fn().mockRejectedValue(new Error('Credenciales inválidas'));
    const user = userEvent.setup();
    renderWithRouter(<LoginForm onSubmit={handleSubmit} />);
    
    const correoInput = screen.getByLabelText(/Correo Electrónico/i);
    const contrasenaInput = screen.getByLabelText(/Contraseña/i);
    
    await user.type(correoInput, 'test@example.com');
    await user.type(contrasenaInput, 'wrongpassword');
    
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    await user.click(submitButton);
    
    await screen.findByText(/Credenciales inválidas/i);
  });

  it('debe tener un enlace a la página de registro', () => {
    renderWithRouter(<LoginForm onSubmit={vi.fn()} />);
    const link = screen.getByText(/Regístrate aquí/i);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/register');
  });
});

