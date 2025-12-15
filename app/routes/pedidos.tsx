import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { MainLayout } from '~/components/templates';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { OrderCard } from '~/components/molecules';
import { Alert, LoadingSpinner, Button } from '~/components/atoms';
import { pedidosService } from '~/lib/services/pedidos.service';
import type { Pedido } from '~/lib/types';

export default function Pedidos() {
  return (
    <ProtectedRoute>
      <PedidosContent />
    </ProtectedRoute>
  );
}

function PedidosContent() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      setIsLoading(true);
      const data = await pedidosService.getMisPedidos();
      setPedidos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar pedidos');
    } finally {
      setIsLoading(false);
    }
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

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Mis Pedidos</h1>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      {pedidos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No tienes pedidos aún</p>
          <Link to="/productos">
            <Button>Ver Productos</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <OrderCard key={pedido.id} pedido={pedido} />
          ))}
        </div>
      )}
    </MainLayout>
  );
}
