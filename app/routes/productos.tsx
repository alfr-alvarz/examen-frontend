import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { MainLayout } from '~/components/templates';
import { ProductList, CategoryFilter } from '~/components';
import { ProductForm } from '~/components/organisms';
import { Button, Alert } from '~/components/atoms';
import { productosService } from '~/lib/services/productos.service';
import { categoriasService } from '~/lib/services/categorias.service';
import { useAuth } from '~/contexts/AuthContext';
import type { Producto, Categoria } from '~/lib/types';

export default function Productos() {
  const { hasRole } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categoriaFiltro) {
      loadProductosByCategoria(categoriaFiltro);
    } else {
      loadProductos();
    }
  }, [categoriaFiltro]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        productosService.getAll(),
        categoriasService.getAll(),
      ]);
      
      setProductos(productosData.filter((p) => p.activo !== false));
      setCategorias(categoriasData.filter((c) => c.activo !== false));
    } catch (err: any) {
      console.error('Error al cargar productos:', err);
      setError(err.message || 'Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProductos = async () => {
    try {
      const data = await productosService.getAll();
      setProductos(data.filter((p) => p.activo));
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
    }
  };

  const loadProductosByCategoria = async (categoriaId: number) => {
    try {
      const data = await productosService.getByCategoria(categoriaId);
      setProductos(data.filter((p) => p.activo));
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
    }
  };

  const handleCreateProducto = async (productoData: Partial<Producto>) => {
    try {
      setIsSaving(true);
      setError('');
      await productosService.create(productoData);
      setIsCreating(false);
      await loadProductos(); // Recargar productos
    } catch (err: any) {
      setError(err.message || 'Error al crear el producto');
    } finally {
      setIsSaving(false);
    }
  };

  const isAdmin = hasRole('ADMIN');

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Productos</h1>
          {isAdmin && (
            <Button
              onClick={() => setIsCreating(true)}
              size="lg"
              className="flex items-center gap-2"
            >
              <span className="text-2xl">+</span>
              Agregar Producto
            </Button>
          )}
        </div>
        <CategoryFilter
          categorias={categorias}
          categoriaSeleccionada={categoriaFiltro}
          onSelectCategoria={setCategoriaFiltro}
        />
      </div>

      {isCreating ? (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 mb-6 border border-slate-700/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4 text-white">Nuevo Producto</h2>
          {error && <Alert variant="error" className="mb-4">{error}</Alert>}
          <ProductForm
            onSubmit={handleCreateProducto}
            onCancel={() => {
              setIsCreating(false);
              setError('');
            }}
            isLoading={isSaving}
            isEditing={false}
          />
        </div>
      ) : (
        <ProductList productos={productos} isLoading={isLoading} error={error} />
      )}
    </MainLayout>
  );
}
