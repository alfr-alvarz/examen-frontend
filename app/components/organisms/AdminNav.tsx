import { Link, useLocation } from 'react-router';
import { Button } from '../atoms';

export function AdminNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-4 mb-6 border border-slate-700/50 backdrop-blur-sm">
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
        <Link to="/admin/categorias">
          <Button
            variant={isActive('/admin/categorias') ? 'primary' : 'secondary'}
            size="sm"
          >
            Categorías
          </Button>
        </Link>
      </div>
    </nav>
  );
}
