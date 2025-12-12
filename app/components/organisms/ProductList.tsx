import type { Producto } from '~/lib/types';
import { ProductCard } from '../molecules';
import { LoadingSpinner, Alert } from '../atoms';

interface ProductListProps {
  productos: Producto[];
  isLoading?: boolean;
  error?: string;
}

export function ProductList({ productos, isLoading, error }: ProductListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (productos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        No se encontraron productos
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
