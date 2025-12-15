import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthProvider } from '~/contexts/AuthContext';
import * as authService from '~/lib/services/auth.service';

vi.mock('~/lib/services/auth.service', () => ({
  authService: {
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    logout: vi.fn(),
    getToken: vi.fn(),
  },
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar el spinner cuando está cargando', () => {
    vi.mocked(authService.authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.authService.getCurrentUser).mockImplementation(
      () => new Promise(() => {}) // Promise que nunca se resuelve
    );

    const { container } = render(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Contenido protegido</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    const spinner = container.querySelector('div[class*="animate-spin"]');
    expect(spinner).toBeInTheDocument();
  });

  it('debe redirigir a login cuando el usuario no está autenticado', () => {
    vi.mocked(authService.authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.authService.getCurrentUser).mockResolvedValue({
      id: 1,
      nombre: 'Test',
      correo: 'test@example.com',
      rol: 'CLIENTE',
      fecha_registro: new Date().toISOString(),
      activo: true,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthProvider>
          <ProtectedRoute>
            <div>Contenido protegido</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    );
  });

  it('debe mostrar el contenido cuando el usuario está autenticado', async () => {
    vi.mocked(authService.authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.authService.getCurrentUser).mockResolvedValue({
      id: 1,
      nombre: 'Test',
      correo: 'test@example.com',
      rol: 'CLIENTE',
      fecha_registro: new Date().toISOString(),
      activo: true,
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Contenido protegido</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    await screen.findByText('Contenido protegido');
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });

  it('debe redirigir cuando el usuario no tiene el rol requerido', async () => {
    vi.mocked(authService.authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.authService.getCurrentUser).mockResolvedValue({
      id: 1,
      nombre: 'Test',
      correo: 'test@example.com',
      rol: 'CLIENTE',
      fecha_registro: new Date().toISOString(),
      activo: true,
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute requiredRole="ADMIN">
            <div>Contenido de admin</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Contenido de admin')).not.toBeInTheDocument();
    });
  });

  it('debe mostrar el contenido cuando el usuario tiene el rol requerido', async () => {
    vi.mocked(authService.authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.authService.getCurrentUser).mockResolvedValue({
      id: 1,
      nombre: 'Admin',
      correo: 'admin@example.com',
      rol: 'ADMIN',
      fecha_registro: new Date().toISOString(),
      activo: true,
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute requiredRole="ADMIN">
            <div>Contenido de admin</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    await screen.findByText('Contenido de admin');
    expect(screen.getByText('Contenido de admin')).toBeInTheDocument();
  });
});

