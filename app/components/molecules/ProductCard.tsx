import { useState } from 'react';
import { Link } from 'react-router';
import type { Producto } from '~/lib/types';
import { Button } from '../atoms';
import { formatPrice } from '~/lib/utils/formatPrice';

interface ProductCardProps {
  producto: Producto;
}

export function ProductCard({ producto }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50 group backdrop-blur-sm">
      {producto.rutaImagen && !imageError ? (
        <div className="relative overflow-hidden">
          <img
            src={producto.rutaImagen}
            alt={producto.nombre}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ) : producto.rutaImagen && imageError ? (
        <div className="w-full h-48 bg-slate-700/50 flex items-center justify-center">
          <span className="text-gray-400 text-center px-4">{producto.nombre}</span>
        </div>
      ) : null}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{producto.nombre}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{producto.descripcion}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ${formatPrice(producto.precio_con_iva)}
          </span>
          <span className="text-sm text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-md">Stock: {producto.stock_actual || 0}</span>
        </div>
        <Link to={`/productos/${producto.id}`}>
          <Button fullWidth className="w-full">Ver Detalles</Button>
        </Link>
      </div>
    </div>
  );
}
