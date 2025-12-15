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
      className="block bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-slate-700/50 hover:border-blue-500/50 backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Pedido #{pedido.numero_pedido}</h3>
          <p className="text-sm text-gray-400 mt-1">
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
          <p className="text-sm text-gray-400">
            {pedido.detalles?.length || 0} producto(s)
          </p>
          {pedido.numero_seguimiento && (
            <p className="text-sm text-cyan-400 mt-1">
              Seguimiento: {pedido.numero_seguimiento}
            </p>
          )}
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          ${(pedido.total || 0).toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
