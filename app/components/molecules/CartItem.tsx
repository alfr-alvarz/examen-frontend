import type { CarritoItem } from '~/lib/types';
import { formatPrice } from '~/lib/utils/formatPrice';
import { Button } from '../atoms';

interface CartItemProps {
  item: CarritoItem;
  onUpdateQuantity: (id: number, cantidad: number) => void;
  onRemove: (id: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  // Intentar obtener el precio de diferentes formas posibles
  const precioUnitario = item.producto?.precio_con_iva 
    || item.producto?.precioConIva 
    || item.precio_con_iva 
    || item.precioConIva 
    || 0;
  const precioTotal = precioUnitario * (item.cantidad || 0);

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-lg p-4 flex gap-4 border border-slate-700/50 backdrop-blur-sm hover:border-blue-500/50 transition-all">
      {item.producto?.rutaImagen && (
        <img
          src={item.producto.rutaImagen}
          alt={item.producto.nombre}
          className="w-24 h-24 object-cover rounded-lg border border-slate-700/50"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-white mb-1">{item.producto?.nombre}</h3>
        <p className="text-gray-400 text-sm mb-3">
          ${formatPrice(precioUnitario)} c/u
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
              className="w-8 h-8 border border-slate-600 rounded-lg hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
            >
              -
            </button>
            <span className="w-12 text-center text-white font-semibold">{item.cantidad}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
              disabled={item.cantidad >= (item.producto?.stock_actual || 0)}
              className="w-8 h-8 border border-slate-600 rounded-lg hover:bg-slate-700 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">${formatPrice(precioTotal)}</span>
          <button
            onClick={() => onRemove(item.id)}
            className="ml-auto text-red-400 hover:text-red-300 transition-colors font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
