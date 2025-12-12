import { Link } from 'react-router';
import type { Pedido } from '~/lib/types';
import { Badge } from '../atoms';

interface OrderCardProps {
  pedido: Pedido;
}

export function OrderCard({ pedido }: OrderCardProps) {
  const getEstadoVariant = (estado: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      PENDIENTE: 'warning',
      CONFIRMADO: 'info',
      PREPARANDO: 'info',
      ENVIADO: 'info',
      ENTREGADO: 'success',
      CANCELADO: 'danger',
    };
    return variants[estado] || 'default';
  };

  return (
    <Link
      to={`/pedidos/${pedido.id}`}
      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Pedido #{pedido.numero_pedido}</h3>
          <p className="text-sm text-gray-600">
            {new Date(pedido.fecha_hora).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <Badge variant={getEstadoVariant(pedido.estado)}>{pedido.estado}</Badge>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            {pedido.detalles?.length || 0} producto(s)
          </p>
          {pedido.numero_seguimiento && (
            <p className="text-sm text-gray-600">
              Seguimiento: {pedido.numero_seguimiento}
            </p>
          )}
        </div>
        <span className="text-xl font-bold text-blue-600">
          ${(pedido.total || 0).toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
