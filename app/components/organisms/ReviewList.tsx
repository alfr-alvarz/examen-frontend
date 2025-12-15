import type { Resena } from '~/lib/types';
import { ReviewCard } from '../molecules';
import { LoadingSpinner, Alert } from '../atoms';

interface ReviewListProps {
  resenas: Resena[];
  isLoading?: boolean;
  error?: string;
  onEdit?: (resena: Resena) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export function ReviewList({
  resenas,
  isLoading = false,
  error,
  onEdit,
  onDelete,
  showActions = false,
}: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (resenas.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No hay reseñas aún. Sé el primero en dejar una reseña.</p>
      </div>
    );
  }

  // Filtrar solo reseñas aprobadas para mostrar
  const resenasAprobadas = resenas.filter((r) => r.aprobada);
  const resenasPendientes = resenas.filter((r) => !r.aprobada && showActions);

  return (
    <div className="space-y-4">
      {resenasPendientes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Tus reseñas pendientes</h3>
          <div className="space-y-3">
            {resenasPendientes.map((resena) => (
              <ReviewCard
                key={resena.id}
                resena={resena}
                onEdit={onEdit}
                onDelete={onDelete}
                showActions={showActions}
              />
            ))}
          </div>
        </div>
      )}
      {resenasAprobadas.length > 0 && (
        <div>
          {resenasPendientes.length > 0 && (
            <h3 className="text-lg font-semibold mb-3 text-gray-900 mt-6">Reseñas aprobadas</h3>
          )}
          <div className="space-y-3">
            {resenasAprobadas.map((resena) => (
              <ReviewCard
                key={resena.id}
                resena={resena}
                onEdit={onEdit}
                onDelete={onDelete}
                showActions={showActions}
              />
            ))}
          </div>
        </div>
      )}
      {resenasAprobadas.length === 0 && resenasPendientes.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No hay reseñas aprobadas aún.</p>
        </div>
      )}
    </div>
  );
}

