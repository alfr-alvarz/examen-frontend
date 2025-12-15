import { useState } from 'react';
import { Button, Input, Textarea, Alert } from '../atoms';
import { FormField } from '../molecules';
import type { Categoria } from '~/lib/types';

interface CategoryFormProps {
  categoria?: Categoria | null;
  onSubmit: (categoria: Partial<Categoria>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryForm({ categoria, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const [nombre, setNombre] = useState(categoria?.nombre || '');
  const [descripcion, setDescripcion] = useState(categoria?.descripcion || '');
  const [orden, setOrden] = useState(categoria?.orden?.toString() || '0');
  const [activo, setActivo] = useState(categoria?.activo !== undefined ? categoria.activo : true);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nombreTrimmed = nombre.trim();
    if (!nombreTrimmed) {
      setError('El nombre es requerido');
      return;
    }

    if (nombreTrimmed.length > 100) {
      setError('El nombre no puede exceder 100 caracteres');
      return;
    }

    const ordenNum = Number(orden);
    if (isNaN(ordenNum) || ordenNum < 0 || !Number.isInteger(ordenNum)) {
      setError('El orden debe ser un número entero válido mayor o igual a 0');
      return;
    }

    try {
      const categoriaData: Partial<Categoria> = {
        nombre: nombreTrimmed,
        orden: Math.floor(ordenNum),
        activo,
      };

      // Solo agregar descripcion si tiene valor (es opcional)
      const descripcionTrimmed = descripcion.trim();
      if (descripcionTrimmed) {
        categoriaData.descripcion = descripcionTrimmed;
      }

      await onSubmit(categoriaData);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la categoría');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      <FormField label="Nombre" required htmlFor="nombre">
        <Input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          maxLength={100}
        />
        <p className="mt-1 text-sm text-gray-400">{nombre.length}/100 caracteres</p>
      </FormField>

      <FormField label="Descripción" htmlFor="descripcion">
        <Textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
        />
      </FormField>

      <FormField label="Orden" htmlFor="orden">
        <Input
          id="orden"
          type="number"
          min="0"
          step="1"
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
        />
        <p className="mt-1 text-sm text-gray-400">El orden determina la posición de la categoría en la lista</p>
      </FormField>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="activo"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="activo" className="text-white">Categoría activa</label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Guardando...' : categoria ? 'Actualizar Categoría' : 'Crear Categoría'}
        </Button>
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

