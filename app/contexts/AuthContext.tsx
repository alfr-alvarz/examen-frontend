import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '~/lib/services/auth.service';
import type { Usuario, Rol } from '~/lib/types';

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (correo: string, contrasena: string) => Promise<void>;
  register: (nombre: string, correo: string, contrasena: string, telefono?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (rol: Rol) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token y cargar el usuario
    if (authService.isAuthenticated()) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setUsuario(user);
    } catch (error) {
      // Si falla, limpiar el token
      authService.logout();
      setUsuario(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (correo: string, contrasena: string) => {
    const response = await authService.login({ correo, contrasena });
    setUsuario(response.usuario);
  };

  const register = async (nombre: string, correo: string, contrasena: string, telefono?: string) => {
    const response = await authService.register({ nombre, correo, contrasena, telefono });
    setUsuario(response.usuario);
  };

  const logout = async () => {
    await authService.logout();
    setUsuario(null);
  };

  const refreshUser = async () => {
    if (authService.isAuthenticated()) {
      await loadUser();
    }
  };

  const hasRole = (rol: Rol): boolean => {
    return usuario?.rol === rol;
  };

  const value: AuthContextType = {
    usuario,
    isAuthenticated: !!usuario,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
