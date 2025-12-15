import { useState, useEffect } from 'react';
import type { Resena, CrearResenaRequest } from '~/lib/types';
import { Button, Input, Textarea, Alert } from '../atoms';
import { FormField } from '../molecules';

interface ReviewFormProps {
  productoId: number;
  pedidoId?: number;
  resena?: Resena;
  onSubmit: (data: CrearResenaRequest | Partial<Pick<Resena, 'calificacion' | 'comentario'>>) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function ReviewForm({
  productoId,
  pedidoId,
  resena,
  onSubmit,
  onCancel,
  isEditing = false,
}: ReviewFormProps) {
  const [calificacion, setCalificacion] = useState(resena?.calificacion || 5);
  const [comentario, setComentario] = useState(resena?.comentario || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (resena) {
      setCalificacion(resena.calificacion);
      setComentario(resena.comentario);
    }
  }, [resena]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (calificacion < 1 || calificacion > 5) {
      setError('La calificación debe estar entre 1 y 5');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && resena) {
        await onSubmit({
          calificacion,
          comentario: comentario.trim() || undefined,
        });
      } else {
        if (!pedidoId || pedidoId <= 0) {
          setError('Debes seleccionar un pedido para crear la reseña');
          return;
        }
        
        const submitData: CrearResenaRequest = {
          productoId,
          pedidoId,
          calificacion,
        };
        
        if (comentario.trim()) {
          submitData.comentario = comentario.trim();
        }
        
        await onSubmit(submitData);
      }
      if (!isEditing) {
        setCalificacion(5);
        setComentario('');
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    const canInteract = interactive && !isSubmitting;
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={canInteract ? () => {
          setCalificacion(i + 1);
        } : undefined}
        className={canInteract ? 'cursor-pointer hover:scale-110 transition-transform' : interactive ? 'cursor-not-allowed opacity-50' : 'cursor-default'}
        disabled={!canInteract}
        style={{ pointerEvents: canInteract ? 'auto' : 'none' }}
      >
        <span
          className={i < rating ? 'text-yellow-400 text-2xl' : 'text-gray-300 text-2xl'}
        >
          ★
        </span>
      </button>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      <FormField label="Calificación" required>
        <div className="flex items-center gap-2">
          {renderStars(calificacion, true)}
          <span className="text-sm text-gray-600 ml-2">
            {calificacion} de 5 estrellas
          </span>
        </div>
      </FormField>

      <FormField label="Comentario (opcional)" htmlFor="comentario">
        <Textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe tu opinión sobre el producto (opcional)..."
          rows={4}
          disabled={isSubmitting}
        />
      </FormField>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Reseña' : 'Publicar Reseña'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

