import { Link, useLocation } from 'react-router';
import { Button } from '../atoms';

export function AdminNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex gap-2 flex-wrap">
        <Link to="/admin">
          <Button
            variant={isActive('/admin') ? 'primary' : 'secondary'}
            size="sm"
          >
            Dashboard
          </Button>
        </Link>
        <Link to="/admin/usuarios">
          <Button
            variant={isActive('/admin/usuarios') ? 'primary' : 'secondary'}
            size="sm"
          >
            Usuarios
          </Button>
        </Link>
        <Link to="/admin/reportes">
          <Button
            variant={isActive('/admin/reportes') ? 'primary' : 'secondary'}
            size="sm"
          >
            Reportes
          </Button>
        </Link>
      </div>
    </nav>
  );
}
