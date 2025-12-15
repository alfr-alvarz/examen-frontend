import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { MainLayout } from '~/components/templates';
import { productosService } from '~/lib/services/productos.service';
import { carritoService } from '~/lib/services/carrito.service';
import { useAuth } from '~/contexts/AuthContext';
import { Button, Input, Alert, LoadingSpinner } from '~/components/atoms';
import { FormField } from '~/components/molecules';
import type { Producto } from '~/lib/types';

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, usuario } = useAuth();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      loadProducto();
    }
  }, [id]);

  const loadProducto = async () => {
    try {
      setIsLoading(true);
      const data = await productosService.getById(Number(id));
      setProducto(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgregarAlCarrito = async () => {
    if (!isAuthenticated || !usuario?.id) {
      navigate('/login');
      return;
    }

    if (!producto) return;

    try {
      setIsAdding(true);
      setSuccess('');
      await carritoService.agregarProducto(usuario.id, {
        producto_id: producto.id,
        cantidad,
      });
      setSuccess('Producto agregado al carrito');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al agregar al carrito');
    } finally {
      setIsAdding(false);
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

  if (error && !producto) {
    return (
      <MainLayout>
        <Alert variant="error">{error}</Alert>
        <Link to="/productos" className="block text-center mt-4">
          <Button variant="outline">Volver a productos</Button>
        </Link>
      </MainLayout>
    );
  }

  if (!producto) {
    return (
      <MainLayout>
        <div className="text-center text-gray-900">Producto no encontrado</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Link to="/productos" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
        ← Volver a productos
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {producto.rutaImagen ? (
              <img
                src={producto.rutaImagen}
                alt={producto.nombre}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{producto.nombre}</h1>
            <p className="text-gray-600 mb-6">{producto.descripcion}</p>

            <div className="mb-6">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-3xl font-bold text-blue-600">
                  ${(producto.precio_con_iva || 0).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  IVA incluido (${producto.iva || 0}%)
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Precio base: ${(producto.precio_base || 0).toLocaleString()}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Stock disponible:</strong> {producto.stock_actual}
              </div>
              {producto.stock_actual <= producto.stock_minimo && (
                <div className="text-sm text-orange-600">
                  ⚠️ Stock bajo
                </div>
              )}
            </div>

            {producto.stock_actual > 0 ? (
              <div className="space-y-4">
                <FormField label="Cantidad" htmlFor="cantidad">
                  <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    max={producto.stock_actual}
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    className="w-20"
                  />
                </FormField>

                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="error">{error}</Alert>}

                <Button
                  fullWidth
                  onClick={handleAgregarAlCarrito}
                  disabled={isAdding || cantidad < 1 || cantidad > producto.stock_actual}
                >
                  {isAdding ? 'Agregando...' : 'Agregar al Carrito'}
                </Button>
              </div>
            ) : (
              <Alert variant="warning">Producto sin stock</Alert>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
