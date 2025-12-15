import { useState } from 'react';
import type { Resena } from '~/lib/types';
import { Button, Badge } from '../atoms';
import { useAuth } from '~/contexts/AuthContext';

interface ReviewCardProps {
  resena: Resena;
  onEdit?: (resena: Resena) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export function ReviewCard({ resena, onEdit, onDelete, showActions = false }: ReviewCardProps) {
  const { usuario } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = usuario?.id === resena.usuario_id;

  const handleDelete = async () => {
    if (!onDelete || !window.confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(resena.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">
              {resena.usuario?.nombre || 'Usuario anónimo'}
            </span>
            {!resena.aprobada && (
              <Badge variant="warning" size="sm">Pendiente</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {renderStars(resena.calificacion)}
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(resena.fecha_creacion)}
            </span>
          </div>
        </div>
        {showActions && isOwner && (
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(resena)}
              >
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            )}
          </div>
        )}
      </div>
      {resena.comentario && (
        <p className="text-gray-700 whitespace-pre-wrap">{resena.comentario}</p>
      )}
    </div>
  );
}

