import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { MainLayout } from '~/components/templates';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { CartSummary } from '~/components/organisms';
import { Input, Select, Textarea, Alert, LoadingSpinner, Button, Label } from '~/components/atoms';
import { FormField } from '~/components/molecules';
import { useAuth } from '~/contexts/AuthContext';
import { carritoService } from '~/lib/services/carrito.service';
import { pedidosService } from '~/lib/services/pedidos.service';
import { metodosEnvioService } from '~/lib/services/metodos-envio.service';
import { formatPrice } from '~/lib/utils/formatPrice';
import type { CarritoItem, MetodoEnvio, MetodoPago } from '~/lib/types';

export default function Checkout() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}

function CheckoutContent() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CarritoItem[]>([]);
  const [metodosEnvio, setMetodosEnvio] = useState<MetodoEnvio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [nuevaDireccion, setNuevaDireccion] = useState({
    nombre_completo: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    codigo_postal: '',
  });
  const [metodoEnvioId, setMetodoEnvioId] = useState<number | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('TARJETA');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (usuario?.id) {
      loadData();
    }
  }, [usuario?.id]);

  const loadData = async () => {
    if (!usuario?.id) return;
    try {
      setIsLoading(true);
      const [carritoData, metodosData] = await Promise.all([
        carritoService.getCarrito(usuario.id),
        metodosEnvioService.getActivos(),
      ]);

      if (carritoData.length === 0) {
        navigate('/carrito');
        return;
      }

      setItems(carritoData);
      setMetodosEnvio(metodosData);

      // Seleccionar primer método de envío por defecto
      if (metodosData.length > 0) {
        setMetodoEnvioId(metodosData[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const calcularSubtotal = () => {
    return items.reduce((total, item) => {
      // Intentar obtener el precio de diferentes formas posibles y convertir a número
      const precio = Number(
        item.producto?.precio_con_iva 
        || 0
      );
      const cantidad = Number(item.cantidad || 0);
      return total + (precio * cantidad);
    }, 0);
  };

  const calcularCostoEnvio = () => {
    const metodo = metodosEnvio.find((m) => m.id === metodoEnvioId);
    return Number(metodo?.costo || 0);
  };

  const calcularTotal = () => {
    const subtotal = Number(calcularSubtotal());
    const costoEnvio = Number(calcularCostoEnvio());
    return subtotal + costoEnvio;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!metodoEnvioId || isNaN(Number(metodoEnvioId))) {
      setError('Selecciona un método de envío');
      return;
    }

    if (!nuevaDireccion.nombre_completo || !nuevaDireccion.telefono || !nuevaDireccion.direccion || !nuevaDireccion.ciudad || !nuevaDireccion.region) {
      setError('Completa todos los campos obligatorios de la dirección');
      return;
    }

    try {
      setIsSubmitting(true);

      // Asegurar que metodoEnvioId sea un número válido
      const metodoEnvioIdNumero = Number(metodoEnvioId);
      if (isNaN(metodoEnvioIdNumero)) {
        setError('El método de envío seleccionado no es válido');
        return;
      }

      // El backend espera camelCase y un array de items
      const pedidoData: any = {
        direccionEnvioId: metodoEnvioIdNumero,
        metodoPago: metodoPago,
        notasCliente: notas || undefined,
        nombreDestinatario: nuevaDireccion.nombre_completo,
        telefono: nuevaDireccion.telefono,
        direccion: nuevaDireccion.direccion,
        ciudad: nuevaDireccion.ciudad,
        region: nuevaDireccion.region,
        items: items.map((item) => {
          // Obtener productoId de diferentes formas posibles
          const productoId = item.producto_id 
            || item.producto?.id;
          
          if (!productoId) {
            console.error('No se pudo obtener productoId del item:', item);
          }
          
          return {
            productoId: Number(productoId),
            cantidad: Number(item.cantidad || 0),
          };
        }),
      };

      const pedido = await pedidosService.create(pedidoData);
      if (usuario?.id) {
        await carritoService.vaciarCarrito(usuario.id);
      }
      navigate(`/pedidos/${pedido.id}`);
    } catch (err: any) {
      setError(err.message || 'Error al crear el pedido');
    } finally {
      setIsSubmitting(false);
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
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Checkout</h1>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Dirección de envío */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-white">Dirección de Envío</h2>

            <div className="space-y-4">
                <Input
                  placeholder="Nombre completo"
                  value={nuevaDireccion.nombre_completo}
                  onChange={(e) =>
                    setNuevaDireccion({ ...nuevaDireccion, nombre_completo: e.target.value })
                  }
                  required
                />
                <Input
                  type="tel"
                  placeholder="Teléfono"
                  value={nuevaDireccion.telefono}
                  onChange={(e) =>
                    setNuevaDireccion({ ...nuevaDireccion, telefono: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Dirección"
                  value={nuevaDireccion.direccion}
                  onChange={(e) =>
                    setNuevaDireccion({ ...nuevaDireccion, direccion: e.target.value })
                  }
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Ciudad"
                    value={nuevaDireccion.ciudad}
                    onChange={(e) =>
                      setNuevaDireccion({ ...nuevaDireccion, ciudad: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Región"
                    value={nuevaDireccion.region}
                    onChange={(e) =>
                      setNuevaDireccion({ ...nuevaDireccion, region: e.target.value })
                    }
                    required
                  />
                </div>
                <Input
                  placeholder="Código postal"
                  value={nuevaDireccion.codigo_postal}
                  onChange={(e) =>
                    setNuevaDireccion({ ...nuevaDireccion, codigo_postal: e.target.value })
                  }
                />
              </div>
          </div>

          {/* Método de envío */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-white">Método de Envío</h2>
            <div className="space-y-2">
              {metodosEnvio.map((metodo) => (
                <label key={metodo.id} className="flex items-center p-3 border border-slate-600/50 rounded-lg hover:bg-slate-700/30 hover:border-blue-500/50 transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="metodoEnvio"
                    value={metodo.id}
                    checked={metodoEnvioId === metodo.id}
                    onChange={() => setMetodoEnvioId(metodo.id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-white">{metodo.nombre}</div>
                    <div className="text-sm text-gray-400">{metodo.descripcion}</div>
                    <div className="text-sm text-cyan-400">
                      {metodo.tiempo_estimado} - ${(metodo.costo || 0).toLocaleString()}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Método de pago */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-white">Método de Pago</h2>
            <Select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
              options={[
                { value: 'TARJETA', label: 'Tarjeta' },
                { value: 'TRANSFERENCIA', label: 'Transferencia' },
                { value: 'EFECTIVO', label: 'Efectivo' },
                { value: 'OTRO', label: 'Otro' },
              ]}
            />
          </div>

          {/* Notas */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-white">Notas (Opcional)</h2>
            <Textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Instrucciones especiales para la entrega..."
              rows={4}
            />
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 h-fit border border-slate-700/50 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4 text-white">Resumen</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-300">
                  {item.producto?.nombre} × {item.cantidad}
                </span>
                <span className="text-gray-300 font-semibold">
                  ${formatPrice(((item.producto?.precio_con_iva || 0) * (item.cantidad || 0)))}
                </span>
              </div>
            ))}
          </div>
          <CartSummary
            subtotal={calcularSubtotal()}
            costoEnvio={calcularCostoEnvio()}
            total={calcularTotal()}
            onCheckout={() => {}}
            isLoading={isSubmitting}
          />
          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
            className="mt-6"
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
          </Button>
        </div>
      </form>
    </MainLayout>
  );
}
