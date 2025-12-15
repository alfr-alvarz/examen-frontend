import { Link, useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { Button } from '../atoms';

export function Header() {
  const { usuario, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50 glow-effect">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent hover:from-blue-300 hover:via-purple-300 hover:to-cyan-300 transition-all">
              TechStore
            </Link>
            <div className="flex space-x-4">
              <Link to="/productos" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Productos
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/carrito" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                    Carrito
                  </Link>
                  <Link to="/pedidos" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                    Mis Pedidos
                  </Link>
                  {hasRole('ADMIN') && (
                    <Link to="/admin" className="text-gray-300 hover:text-purple-400 transition-colors font-medium">
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300 text-sm">
                  {usuario?.nombre} <span className="text-purple-400">({usuario?.rol})</span>
                </span>
                <Button variant="danger" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
