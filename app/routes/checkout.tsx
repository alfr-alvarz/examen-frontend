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
import { direccionesService } from '~/lib/services/direcciones.service';
import { metodosEnvioService } from '~/lib/services/metodos-envio.service';
import type { CarritoItem, DireccionEnvio, MetodoEnvio, MetodoPago } from '~/lib/types';

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
  const [direcciones, setDirecciones] = useState<DireccionEnvio[]>([]);
  const [metodosEnvio, setMetodosEnvio] = useState<MetodoEnvio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [direccionId, setDireccionId] = useState<number | null>(null);
  const [usarNuevaDireccion, setUsarNuevaDireccion] = useState(false);
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
      const [carritoData, direccionesData, metodosData] = await Promise.all([
        carritoService.getCarrito(usuario.id),
        direccionesService.getAll(),
        metodosEnvioService.getActivos(),
      ]);

      if (carritoData.length === 0) {
        navigate('/carrito');
        return;
      }

      setItems(carritoData);
      setDirecciones(direccionesData);
      setMetodosEnvio(metodosData);

      // Seleccionar dirección principal por defecto
      const principal = direccionesData.find((d) => d.es_principal);
      if (principal) {
        setDireccionId(principal.id);
      } else if (direccionesData.length > 0) {
        setDireccionId(direccionesData[0].id);
      } else {
        setUsarNuevaDireccion(true);
      }

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
      const precio = item.producto?.precio_con_iva || 0;
      return total + precio * item.cantidad;
    }, 0);
  };

  const calcularCostoEnvio = () => {
    const metodo = metodosEnvio.find((m) => m.id === metodoEnvioId);
    return metodo?.costo || 0;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularCostoEnvio();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!metodoEnvioId) {
      setError('Selecciona un método de envío');
      return;
    }

    if (!usarNuevaDireccion && !direccionId) {
      setError('Selecciona una dirección de envío');
      return;
    }

    if (usarNuevaDireccion && !nuevaDireccion.nombre_completo) {
      setError('Completa todos los campos de la dirección');
      return;
    }

    try {
      setIsSubmitting(true);

      let direccionSeleccionada: DireccionEnvio | null = null;
      if (!usarNuevaDireccion && direccionId) {
        direccionSeleccionada = direcciones.find((d) => d.id === direccionId) || null;
      }

      const pedidoData = {
        direccion_envio_id: direccionSeleccionada?.id,
        metodo_envio_id: metodoEnvioId,
        metodo_pago: metodoPago,
        notas_cliente: notas || undefined,
        nombre_destinatario: direccionSeleccionada?.nombre_completo || nuevaDireccion.nombre_completo,
        telefono: direccionSeleccionada?.telefono || nuevaDireccion.telefono,
        direccion: direccionSeleccionada
          ? `${direccionSeleccionada.calle} ${direccionSeleccionada.numero}`
          : nuevaDireccion.direccion,
        ciudad: direccionSeleccionada?.ciudad || nuevaDireccion.ciudad,
        region: direccionSeleccionada?.region || nuevaDireccion.region,
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
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Checkout</h1>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Dirección de envío */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Dirección de Envío</h2>

            {direcciones.length > 0 && (
              <div className="mb-4">
                <label className="flex items-center mb-2">
                  <input
                    type="radio"
                    checked={!usarNuevaDireccion}
                    onChange={() => setUsarNuevaDireccion(false)}
                    className="mr-2"
                  />
                  <span className="text-gray-900">Usar dirección guardada</span>
                </label>
                {!usarNuevaDireccion && (
                  <Select
                    value={direccionId || ''}
                    onChange={(e) => setDireccionId(Number(e.target.value))}
                    options={direcciones.map((dir) => ({
                      value: dir.id,
                      label: `${dir.alias} - ${dir.calle} ${dir.numero}, ${dir.ciudad}`,
                    }))}
                    className="mt-2"
                  />
                )}
              </div>
            )}

            <label className="flex items-center mb-4">
              <input
                type="radio"
                checked={usarNuevaDireccion}
                onChange={() => setUsarNuevaDireccion(true)}
                className="mr-2"
              />
              <span className="text-gray-900">Nueva dirección</span>
            </label>

            {usarNuevaDireccion && (
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
            )}
          </div>

          {/* Método de envío */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Método de Envío</h2>
            <div className="space-y-2">
              {metodosEnvio.map((metodo) => (
                <label key={metodo.id} className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="metodoEnvio"
                    value={metodo.id}
                    checked={metodoEnvioId === metodo.id}
                    onChange={() => setMetodoEnvioId(metodo.id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{metodo.nombre}</div>
                    <div className="text-sm text-gray-600">{metodo.descripcion}</div>
                    <div className="text-sm text-gray-600">
                      {metodo.tiempo_estimado} - ${(metodo.costo || 0).toLocaleString()}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Método de pago */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Método de Pago</h2>
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Notas (Opcional)</h2>
            <Textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Instrucciones especiales para la entrega..."
              rows={4}
            />
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Resumen</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-900">
                  {item.producto?.nombre} × {item.cantidad}
                </span>
                <span className="text-gray-900">
                  ${((item.producto?.precio_con_iva || 0) * item.cantidad).toLocaleString()}
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
