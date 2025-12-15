import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { MainLayout } from '~/components/templates';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { CartItem, CartSummary } from '~/components';
import { Button, Alert, LoadingSpinner } from '~/components/atoms';
import { useAuth } from '~/contexts/AuthContext';
import { carritoService } from '~/lib/services/carrito.service';
import type { CarritoItem } from '~/lib/types';

export default function Carrito() {
  return (
    <ProtectedRoute>
      <CarritoContent />
    </ProtectedRoute>
  );
}

function CarritoContent() {
  const { usuario } = useAuth();
  const [items, setItems] = useState<CarritoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario?.id) {
      loadCarrito();
    }
  }, [usuario?.id]);

  const loadCarrito = async () => {
    if (!usuario?.id) return;
    try {
      setIsLoading(true);
      const data = await carritoService.getCarrito(usuario.id);
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el carrito');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActualizarCantidad = async (id: number, nuevaCantidad: number) => {
    if (!usuario?.id) return;
    if (nuevaCantidad < 1) {
      handleEliminarItem(id);
      return;
    }

    try {
      await carritoService.actualizarCantidad(usuario.id, id, nuevaCantidad);
      await loadCarrito();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar cantidad');
    }
  };

  const handleEliminarItem = async (id: number) => {
    if (!usuario?.id) return;
    try {
      await carritoService.eliminarItem(usuario.id, id);
      await loadCarrito();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar item');
    }
  };

  const handleVaciarCarrito = async () => {
    if (!usuario?.id) return;
    if (!confirm('¿Estás seguro de vaciar el carrito?')) return;

    try {
      await carritoService.vaciarCarrito(usuario.id);
      await loadCarrito();
    } catch (err: any) {
      setError(err.message || 'Error al vaciar carrito');
    }
  };

  const calcularTotal = () => {
    return items.reduce((total, item) => {
      const precio = item.producto?.precio_con_iva || 0;
      return total + precio * item.cantidad;
    }, 0);
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
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Mi Carrito</h1>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
          <Link to="/productos">
            <Button>Ver Productos</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleActualizarCantidad}
                onRemove={handleEliminarItem}
              />
            ))}
            <Button variant="danger" size="sm" onClick={handleVaciarCarrito}>
              Vaciar Carrito
            </Button>
          </div>

          <CartSummary
            subtotal={calcularTotal()}
            costoEnvio={0}
            total={calcularTotal()}
            onCheckout={() => navigate('/checkout')}
          />
        </div>
      )}
    </MainLayout>
  );
}
