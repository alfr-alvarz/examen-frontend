import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { MainLayout } from '~/components/templates';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { Badge, LoadingSpinner, Alert, Button } from '~/components/atoms';
import { pedidosService } from '~/lib/services/pedidos.service';
import type { Pedido } from '~/lib/types';

export default function PedidoDetalle() {
  return (
    <ProtectedRoute>
      <PedidoDetalleContent />
    </ProtectedRoute>
  );
}

function PedidoDetalleContent() {
  const { id } = useParams();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadPedido();
    }
  }, [id]);

  const loadPedido = async () => {
    try {
      setIsLoading(true);
      const data = await pedidosService.getById(Number(id));
      setPedido(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error || !pedido) {
    return (
      <MainLayout>
        <Alert variant="error">{error || 'Pedido no encontrado'}</Alert>
        <Link to="/pedidos" className="block text-center mt-4">
          <Button variant="outline">Volver a pedidos</Button>
        </Link>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Link to="/pedidos" className="mb-4 inline-block">
        <Button variant="outline" size="sm">← Volver a pedidos</Button>
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Pedido #{pedido.numero_pedido}
            </h1>
            <p className="text-gray-600">
              Fecha: {new Date(pedido.fecha_hora).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <Badge variant={getEstadoVariant(pedido.estado)}>
            {pedido.estado}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Dirección de Envío</h2>
            <div className="text-gray-600">
              <p>{pedido.nombre_destinatario}</p>
              <p>{pedido.direccion}</p>
              <p>
                {pedido.ciudad}, {pedido.region}
              </p>
              <p>Tel: {pedido.telefono}</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Información del Pedido</h2>
            <div className="text-gray-600 space-y-1">
              <p>Método de pago: {pedido.metodo_pago}</p>
              {pedido.numero_seguimiento && (
                <p>Número de seguimiento: {pedido.numero_seguimiento}</p>
              )}
              {pedido.fecha_confirmacion && (
                <p>
                  Confirmado: {new Date(pedido.fecha_confirmacion).toLocaleDateString('es-ES')}
                </p>
              )}
              {pedido.fecha_envio && (
                <p>
                  Enviado: {new Date(pedido.fecha_envio).toLocaleDateString('es-ES')}
                </p>
              )}
              {pedido.fecha_entrega && (
                <p>
                  Entregado: {new Date(pedido.fecha_entrega).toLocaleDateString('es-ES')}
                </p>
              )}
            </div>
          </div>
        </div>

        {pedido.notas_cliente && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Notas del Cliente</h3>
            <p className="text-gray-600">{pedido.notas_cliente}</p>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Productos</h2>
          <div className="space-y-3">
            {pedido.detalles?.map((detalle) => (
              <div
                key={detalle.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div className="flex-1">
                  <p className="font-semibold">{detalle.producto?.nombre}</p>
                  <p className="text-sm text-gray-600">
                    Cantidad: {detalle.cantidad} × ${(detalle.precio_unitario_con_iva || 0).toLocaleString()}
                  </p>
                </div>
                <span className="font-semibold">
                  ${(detalle.subtotal_con_iva || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>${(pedido.subtotal || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>IVA:</span>
            <span>${(pedido.total_iva || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Costo de envío:</span>
            <span>${(pedido.costo_envio || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-2 border-t">
            <span>Total:</span>
            <span>${(pedido.total || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
