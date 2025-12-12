import { useEffect, useState } from 'react';
import { UserCard } from '~/components/molecules';
import { Alert, LoadingSpinner } from '~/components/atoms';
import { usuariosService } from '~/lib/services/usuarios.service';
import type { Usuario } from '~/lib/types';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setIsLoading(true);
      const data = await usuariosService.getAll();
      setUsuarios(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await usuariosService.delete(id);
      await loadUsuarios();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar usuario');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administra todos los usuarios del sistema</p>
      </div>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      {usuarios.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Total de usuarios: <strong>{usuarios.length}</strong>
            </p>
          </div>
          {usuarios.map((usuario) => (
            <UserCard
              key={usuario.id}
              usuario={usuario}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
