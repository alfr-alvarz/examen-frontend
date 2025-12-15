import type { Usuario } from '~/lib/types';
import { Badge, Button } from '../atoms';

interface UserCardProps {
  usuario: Usuario;
  onDelete?: (id: number) => void;
}

export function UserCard({ usuario, onDelete }: UserCardProps) {
  const getRolVariant = (rol: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    return rol === 'ADMIN' ? 'danger' : 'info';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{usuario.nombre}</h3>
          <p className="text-sm text-gray-600">{usuario.correo}</p>
          {usuario.telefono && (
            <p className="text-sm text-gray-600">Tel: {usuario.telefono}</p>
          )}
        </div>
        <Badge variant={getRolVariant(usuario.rol)}>{usuario.rol}</Badge>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <p>
            Registrado: {usuario.fecha_registro ? (() => {
              try {
                // La fecha ya debería estar en formato ISO después de la transformación
                const fecha = new Date(usuario.fecha_registro);
                if (isNaN(fecha.getTime())) {
                  return usuario.fecha_registro; // Mostrar el string original si no se puede parsear
                }
                return fecha.toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
              } catch {
                return usuario.fecha_registro || 'No disponible';
              }
            })() : 'No disponible'}
          </p>
          <p className={usuario.activo ? 'text-green-600' : 'text-red-600'}>
            {usuario.activo ? '✓ Activo' : '✗ Inactivo'}
          </p>
        </div>
        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre}?`)) {
                onDelete(usuario.id);
              }
            }}
          >
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );
}
