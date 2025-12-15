import { useEffect, useState } from 'react';
import { MainLayout } from '~/components/templates';
import { ProductList, CategoryFilter } from '~/components';
import { productosService } from '~/lib/services/productos.service';
import { categoriasService } from '~/lib/services/categorias.service';
import type { Producto, Categoria } from '~/lib/types';

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
      
      // Log temporal para debugging
      console.log('Productos recibidos:', productosData);
      console.log('Primer producto:', productosData[0]);
      
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

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Productos</h1>
        <CategoryFilter
          categorias={categorias}
          categoriaSeleccionada={categoriaFiltro}
          onSelectCategoria={setCategoriaFiltro}
        />
      </div>
      <ProductList productos={productos} isLoading={isLoading} error={error} />
    </MainLayout>
  );
}
