import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { RegisterForm } from './RegisterForm';

describe('RegisterForm', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it('debe renderizar el formulario de registro', () => {
    renderWithRouter(<RegisterForm onSubmit={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Registrarse' })).toBeInTheDocument();
  });

  it('debe renderizar todos los campos del formulario', () => {
    renderWithRouter(<RegisterForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  it('debe mostrar error cuando el nombre está vacío', async () => {
    renderWithRouter(<RegisterForm onSubmit={vi.fn()} />);
    
    const form = screen.getByRole('button', { name: /Registrarse/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    expect(await screen.findByText('El nombre es requerido')).toBeInTheDocument();
  });

  it('debe mostrar error cuando el correo no es válido', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm onSubmit={vi.fn()} />);
    
    const nombreInput = screen.getByLabelText(/Nombre Completo/i);
    await user.type(nombreInput, 'Juan Pérez');
    
    const correoInput = screen.getByLabelText(/Correo Electrónico/i);
    await user.type(correoInput, 'correo-invalido');
    
    const form = screen.getByRole('button', { name: /Registrarse/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    expect(await screen.findByText(/correo electrónico válido/i)).toBeInTheDocument();
  });

  it('debe mostrar error cuando la contraseña es muy corta', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm onSubmit={vi.fn()} />);
    
    const nombreInput = screen.getByLabelText(/Nombre Completo/i);
    await user.type(nombreInput, 'Juan Pérez');
    
    const correoInput = screen.getByLabelText(/Correo Electrónico/i);
    await user.type(correoInput, 'test@example.com');
    
    const contrasenaInput = screen.getByLabelText(/Contraseña/i);
    await user.type(contrasenaInput, '123');
    
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument();
  });

  it('debe llamar onSubmit con los valores correctos cuando el formulario es válido', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm onSubmit={handleSubmit} />);
    
    const nombreInput = screen.getByLabelText(/Nombre Completo/i);
    const correoInput = screen.getByLabelText(/Correo Electrónico/i);
    const contrasenaInput = screen.getByLabelText(/Contraseña/i);
    
    await user.type(nombreInput, 'Juan Pérez');
    await user.type(correoInput, 'test@example.com');
    await user.type(contrasenaInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    await user.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalledWith('Juan Pérez', 'test@example.com', 'password123', undefined);
  });

  it('debe incluir el teléfono cuando se proporciona', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm onSubmit={handleSubmit} />);
    
    const nombreInput = screen.getByLabelText(/Nombre Completo/i);
    const correoInput = screen.getByLabelText(/Correo Electrónico/i);
    const telefonoInput = screen.getByLabelText(/Teléfono/i);
    const contrasenaInput = screen.getByLabelText(/Contraseña/i);
    
    await user.type(nombreInput, 'Juan Pérez');
    await user.type(correoInput, 'test@example.com');
    await user.type(telefonoInput, '123456789');
    await user.type(contrasenaInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    await user.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalledWith('Juan Pérez', 'test@example.com', 'password123', '123456789');
  });

  it('debe mostrar el estado de carga cuando isLoading es true', () => {
    renderWithRouter(<RegisterForm onSubmit={vi.fn()} isLoading={true} />);
    expect(screen.getByText('Registrando...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('debe tener un enlace a la página de login', () => {
    renderWithRouter(<RegisterForm onSubmit={vi.fn()} />);
    const link = screen.getByText(/Inicia sesión aquí/i);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/login');
  });
});

