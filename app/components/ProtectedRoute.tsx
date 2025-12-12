import { Navigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import type { Rol } from '~/lib/types';
import { LoadingSpinner } from './atoms';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Rol;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
