import { Outlet, useLocation } from 'react-router';
import { Link } from 'react-router';
import { MainLayout } from '~/components/templates';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { AdminNav } from '~/components/organisms';
import { Button } from '~/components/atoms';

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/usuarios">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-blue-500/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-white">Usuarios</h3>
            </div>
            <p className="text-gray-400">Gestiona usuarios del sistema</p>
          </div>
        </Link>

        <Link to="/admin/reportes">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white">Reportes</h3>
            </div>
            <p className="text-gray-400">Visualiza estadísticas de ventas</p>
          </div>
        </Link>

        <Link to="/admin/categorias">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-green-500/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🏷️</span>
              </div>
              <h3 className="text-xl font-bold text-white">Categorías</h3>
            </div>
            <p className="text-gray-400">Gestiona categorías de productos</p>
          </div>
        </Link>

        <Link to="/productos">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-white">Productos</h3>
            </div>
            <p className="text-gray-400">Administra el catálogo de productos</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function Admin() {
  const location = useLocation();
  const isDashboard = location.pathname === '/admin';

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Panel de Administración
          </h1>
        </div>
        <AdminNav />
        {isDashboard ? <AdminDashboard /> : <Outlet />}
      </MainLayout>
    </ProtectedRoute>
  );
}
