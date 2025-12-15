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
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Mis Pedidos</h1>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      {pedidos.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-8 text-center border border-slate-700/50 backdrop-blur-sm">
          <p className="text-gray-300 mb-4 text-lg">No tienes pedidos aún</p>
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
