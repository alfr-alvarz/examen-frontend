import { Link } from 'react-router';
import type { Producto } from '~/lib/types';
import { Button } from '../atoms';

interface ProductCardProps {
  producto: Producto;
}

export function ProductCard({ producto }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {producto.rutaImagen && (
        <img
          src={producto.rutaImagen}
          alt={producto.nombre}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{producto.nombre}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{producto.descripcion}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ${(producto.precio_con_iva || 0).toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">Stock: {producto.stock_actual || 0}</span>
        </div>
        <Link to={`/productos/${producto.id}`}>
          <Button fullWidth>Ver Detalles</Button>
        </Link>
      </div>
    </div>
  );
}
