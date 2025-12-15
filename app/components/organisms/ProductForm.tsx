import { useState, useEffect } from 'react';
import { Button, Input, Textarea, Select, Alert } from '../atoms';
import { FormField } from '../molecules';
import { categoriasService } from '~/lib/services/categorias.service';
import type { Producto, Categoria } from '~/lib/types';

interface ProductFormProps {
  producto?: Producto | null;
  onSubmit: (producto: Partial<Producto>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function ProductForm({ producto, onSubmit, onCancel, isLoading, isEditing = false }: ProductFormProps) {
  const [nombre, setNombre] = useState(producto?.nombre || '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '');
  const [precioBase, setPrecioBase] = useState(producto?.precio_base?.toString() || '');
  const [iva, setIva] = useState(producto?.iva?.toString() || '19');
  const [stockActual, setStockActual] = useState(producto?.stock_actual?.toString() || '0');
  const [stockMinimo, setStockMinimo] = useState(producto?.stock_minimo?.toString() || '0');
  const [categoriaId, setCategoriaId] = useState<number | ''>(producto?.categoria_id || '');
  const [rutaImagen, setRutaImagen] = useState(producto?.rutaImagen || '');
  const [activo, setActivo] = useState(producto?.activo !== undefined ? producto.activo : true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await categoriasService.getAll();
      setCategorias(data.filter((c) => c.activo !== false));
    } catch (err: any) {
      setError('Error al cargar categorías');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    const precioBaseNum = Number(precioBase);
    if (isNaN(precioBaseNum) || precioBaseNum < 0) {
      setError('El precio base debe ser un número válido mayor o igual a 0');
      return;
    }

    const stockActualNum = Number(stockActual);
    if (isNaN(stockActualNum) || stockActualNum < 0 || !Number.isInteger(stockActualNum)) {
      setError('El stock actual debe ser un número entero válido mayor o igual a 0');
      return;
    }

    const stockMinimoNum = Number(stockMinimo);
    if (isNaN(stockMinimoNum) || stockMinimoNum < 0 || !Number.isInteger(stockMinimoNum)) {
      setError('El stock mínimo debe ser un número entero válido mayor o igual a 0');
      return;
    }

    try {
      const productoData: any = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precioBase: precioBaseNum,
        iva: Number(iva) || 0,
        stockActual: Math.floor(stockActualNum),
      };

      if (isEditing) {
        productoData.stockMinimo = Math.floor(stockMinimoNum);
      }

      if (categoriaId && !isNaN(Number(categoriaId))) {
        productoData.categoriaId = Math.floor(Number(categoriaId));
      }

      if (rutaImagen.trim()) {
        productoData.rutaImagen = rutaImagen.trim();
      }

      if (isEditing) {
        productoData.activo = activo;
      }

      await onSubmit(productoData);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto');
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
        />
      </FormField>

      <FormField label="Descripción" htmlFor="descripcion">
        <Textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Precio Base" required htmlFor="precioBase">
          <Input
            id="precioBase"
            type="number"
            step="0.01"
            min="0"
            value={precioBase}
            onChange={(e) => setPrecioBase(e.target.value)}
            required
          />
        </FormField>

        <FormField label="IVA (%)" htmlFor="iva">
          <Input
            id="iva"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={iva}
            onChange={(e) => setIva(e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Stock Actual" htmlFor="stockActual">
          <Input
            id="stockActual"
            type="number"
            min="0"
            value={stockActual}
            onChange={(e) => setStockActual(e.target.value)}
          />
        </FormField>

        <FormField label="Stock Mínimo" htmlFor="stockMinimo">
          <Input
            id="stockMinimo"
            type="number"
            min="0"
            value={stockMinimo}
            onChange={(e) => setStockMinimo(e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Categoría" htmlFor="categoriaId">
        <Select
          id="categoriaId"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : '')}
          options={[
            { value: '', label: 'Sin categoría' },
            ...categorias.map((cat) => ({ value: cat.id, label: cat.nombre })),
          ]}
        />
      </FormField>

      <FormField label="URL de Imagen" htmlFor="rutaImagen">
        <Input
          id="rutaImagen"
          type="url"
          value={rutaImagen}
          onChange={(e) => setRutaImagen(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </FormField>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="activo"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="activo" className="text-gray-900">Producto activo</label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Guardando...' : producto ? 'Actualizar Producto' : 'Crear Producto'}
        </Button>
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
