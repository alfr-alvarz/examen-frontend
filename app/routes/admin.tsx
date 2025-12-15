import { Outlet } from 'react-router';
import { MainLayout } from '~/components/templates';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { AdminNav } from '~/components/organisms';

export default function Admin() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        </div>
        <AdminNav />
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
  );
}
