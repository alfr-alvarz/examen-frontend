import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as authService from '~/lib/services/auth.service';
import * as jwtUtils from '~/lib/utils/jwt';

vi.mock('~/lib/services/auth.service', () => ({
  authService: {
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getToken: vi.fn(),
  },
}));

vi.mock('~/lib/utils/jwt', () => ({
  getUserFromToken: vi.fn(),
}));

function TestComponent() {
  const { usuario, isAuthenticated, isLoading, login, register, logout, hasRole } = useAuth();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="usuario">{usuario ? usuario.nombre : 'no-user'}</div>
      <div data-testid="has-admin-role">{hasRole('ADMIN') ? 'yes' : 'no'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => register('Test', 'test@example.com', 'password')}>Register</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debe inicializar con usuario no autenticado cuando no hay token', async () => {
    vi.mocked(authService.authService.isAuthenticated).mockReturnValue(false);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('usuario')).toHaveTextContent('no-user');
  });

  it('debe cargar el usuario cuando hay un token válido', async () => {
    const mockUsuario = {
      id: 1,
      nombre: 'Test User',
      correo: 'test@example.com',
      rol: 'CLIENTE' as const,
      fecha_registro: new Date().toISOString(),
      activo: true,
    };

    vi.mocked(authService.authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.authService.getCurrentUser).mockResolvedValue(mockUsuario);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('usuario')).toHaveTextContent('Test User');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
  });

  it('debe realizar login correctamente', async () => {
    const mockUsuario = {
      id: 1,
      nombre: 'Test User',
      correo: 'test@example.com',
      rol: 'CLIENTE' as const,
      fecha_registro: new Date().toISOString(),
      activo: true,
    };

    vi.mocked(authService.authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.authService.login).mockResolvedValue({
      token: 'mock-token',
      usuario: mockUsuario,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(authService.authService.login).toHaveBeenCalledWith({
        correo: 'test@example.com',
        contrasena: 'password',
      });
    });
  });

  it('debe realizar registro correctamente', async () => {
    const mockUsuario = {
      id: 1,
      nombre: 'Test User',
      correo: 'test@example.com',
      rol: 'CLIENTE' as const,
      fecha_registro: new Date().toISOString(),
      activo: true,
    };

    vi.mocked(authService.authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.authService.register).mockResolvedValue({
      token: 'mock-token',
      usuario: mockUsuario,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = screen.getByText('Register');
    registerButton.click();

    await waitFor(() => {
      expect(authService.authService.register).toHaveBeenCalledWith({
        nombre: 'Test',
        correo: 'test@example.com',
        contrasena: 'password',
      });
    });
  });

  it('debe realizar logout correctamente', async () => {
    vi.mocked(authService.authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.authService.logout).mockResolvedValue();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByText('Logout');
    logoutButton.click();

    await waitFor(() => {
      expect(authService.authService.logout).toHaveBeenCalled();
    });
  });

  it('debe verificar correctamente el rol del usuario', async () => {
    const mockUsuario = {
      id: 1,
      nombre: 'Admin User',
      correo: 'admin@example.com',
      rol: 'ADMIN' as const,
      fecha_registro: new Date().toISOString(),
      activo: true,
    };

    vi.mocked(authService.authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.authService.getCurrentUser).mockResolvedValue(mockUsuario);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('has-admin-role')).toHaveTextContent('yes');
    });
  });

  it('debe lanzar error cuando useAuth se usa fuera del provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth debe ser usado dentro de un AuthProvider');

    consoleError.mockRestore();
  });
});

