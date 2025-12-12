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
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Tienda Online
            </Link>
            <div className="flex space-x-4">
              <Link to="/productos" className="text-gray-700 hover:text-blue-600">
                Productos
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/carrito" className="text-gray-700 hover:text-blue-600">
                    Carrito
                  </Link>
                  <Link to="/pedidos" className="text-gray-700 hover:text-blue-600">
                    Mis Pedidos
                  </Link>
                  {hasRole('ADMIN') && (
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600">
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
                <span className="text-gray-700">
                  {usuario?.nombre} ({usuario?.rol})
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
