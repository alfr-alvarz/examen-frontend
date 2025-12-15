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
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      {item.producto?.rutaImagen && (
        <img
          src={item.producto.rutaImagen}
          alt={item.producto.nombre}
          className="w-24 h-24 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-gray-900">{item.producto?.nombre}</h3>
        <p className="text-gray-600 text-sm mb-2">
          ${formatPrice(precioUnitario)} c/u
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
              className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
            >
              -
            </button>
            <span className="w-12 text-center text-gray-900">{item.cantidad}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
              disabled={item.cantidad >= (item.producto?.stock_actual || 0)}
              className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
          </div>
          <span className="font-semibold text-gray-900">${formatPrice(precioTotal)}</span>
          <button
            onClick={() => onRemove(item.id)}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
