import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '~/lib/services/auth.service';
import { getUserFromToken } from '~/lib/utils/jwt';
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
    } catch (error: any) {
      // Solo limpiar el token si es un error de autenticación (401 o 403)
      if (error?.status === 401 || error?.status === 403) {
        console.log('Token inválido o expirado, limpiando sesión');
        authService.logout();
        setUsuario(null);
      } else {
        // Para errores del servidor (500, etc.), intentar obtener info básica del token
        console.warn('Error al cargar usuario desde el servidor, usando información del token:', error);
        const token = authService.getToken();
        if (token) {
          const userFromToken = getUserFromToken(token);
          if (userFromToken && userFromToken.id) {
            // Crear un usuario básico desde el token
            const basicUser: Usuario = {
              id: userFromToken.id,
              nombre: userFromToken.correo || 'Usuario',
              correo: userFromToken.correo || '',
              rol: (userFromToken.rol as Rol) || 'CLIENTE',
              fecha_registro: new Date().toISOString(),
              activo: true,
            };
            setUsuario(basicUser);
            console.log('Usuario cargado desde token:', basicUser);
          } else {
            // Si no se puede obtener info del token, mantener autenticado pero sin usuario
            setUsuario(null);
          }
        } else {
          setUsuario(null);
        }
      }
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

  // Si hay token en localStorage, consideramos al usuario autenticado
  // incluso si no se pudo cargar el usuario por un error del servidor
  const isAuthenticated = !!usuario || authService.isAuthenticated();

  const value: AuthContextType = {
    usuario,
    isAuthenticated,
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
