import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { MainLayout } from '~/components/templates';
import { productosService } from '~/lib/services/productos.service';
import { carritoService } from '~/lib/services/carrito.service';
import { resenasService } from '~/lib/services/resenas.service';
import { pedidosService } from '~/lib/services/pedidos.service';
import { useAuth } from '~/contexts/AuthContext';
import { Button, Input, Alert, LoadingSpinner, Select } from '~/components/atoms';
import { FormField } from '~/components/molecules';
import { ProductForm, ReviewList, ReviewForm } from '~/components/organisms';
import type { Producto, Resena, CrearResenaRequest, Pedido } from '~/lib/types';
import { formatPrice } from '~/lib/utils/formatPrice';

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, usuario, hasRole } = useAuth();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [isLoadingResenas, setIsLoadingResenas] = useState(false);
  const [isCreatingResena, setIsCreatingResena] = useState(false);
  const [resenaEditando, setResenaEditando] = useState<Resena | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      loadProducto();
      loadResenas();
      if (isAuthenticated) {
        loadPedidos();
      }
    }
  }, [id, isAuthenticated]);

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

  const loadResenas = async () => {
    if (!id) return;
    try {
      setIsLoadingResenas(true);
      const data = await resenasService.getByProducto(Number(id));
      setResenas(data);
    } catch (err: any) {
      console.error('Error al cargar reseñas:', err);
    } finally {
      setIsLoadingResenas(false);
    }
  };

  const loadPedidos = async () => {
    try {
      const data = await pedidosService.getMisPedidos();
      if (id) {
        const pedidosConProducto = data.filter((pedido) => {
          const tieneProducto = pedido.detalles?.some(
            (detalle) => detalle.producto_id === Number(id)
          );
          return tieneProducto && pedido.estado !== 'CANCELADO';
        });
        setPedidos(pedidosConProducto);
        if (pedidosConProducto.length > 0 && !pedidoSeleccionado) {
          setPedidoSeleccionado(pedidosConProducto[0].id);
        }
      }
    } catch (err: any) {
      console.error('Error al cargar pedidos:', err);
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
        productoId: producto.id,
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

  const handleUpdateProducto = async (productoData: Partial<Producto>) => {
    if (!producto) return;

    try {
      setIsAdding(true);
      setError('');
      const updated = await productosService.update(producto.id, productoData);
      setProducto(updated);
      setIsEditing(false);
      setSuccess('Producto actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el producto');
    } finally {
      setIsAdding(false);
    }
  };

  const handleCreateResena = async (data: CrearResenaRequest | Partial<Pick<Resena, 'calificacion' | 'comentario'>>) => {
    if (!producto || !isAuthenticated) {
      console.error('No se puede crear reseña: producto o usuario no disponible');
      return;
    }

    try {
      setError('');
      
      if (resenaEditando) {
        await resenasService.update(resenaEditando.id, data as Partial<Pick<Resena, 'calificacion' | 'comentario'>>);
        setSuccess('Reseña actualizada correctamente');
        setResenaEditando(null);
        setIsCreatingResena(false);
      } else {
        if (!pedidoSeleccionado || pedidoSeleccionado <= 0) {
          setError('Por favor selecciona un pedido');
          setIsCreatingResena(false);
          return;
        }
        
        const resenaData: CrearResenaRequest = {
          productoId: producto.id,
          pedidoId: pedidoSeleccionado,
          calificacion: (data as CrearResenaRequest).calificacion,
        };
        
        if ((data as CrearResenaRequest).comentario) {
          resenaData.comentario = (data as CrearResenaRequest).comentario;
        }
        
        console.log('Enviando reseña:', resenaData);
        await resenasService.create(resenaData);
        setSuccess('Reseña creada correctamente. Estará visible una vez sea aprobada.');
        setIsCreatingResena(false);
      }
      
      try {
        await loadResenas();
      } catch (err) {
        console.error('Error al recargar reseñas:', err);
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error al crear/actualizar reseña:', err);
      setError(err.message || 'Error al guardar la reseña');
      setIsCreatingResena(false);
      throw err;
    }
  };

  const handleEditResena = (resena: Resena) => {
    setResenaEditando(resena);
    setIsCreatingResena(true);
  };

  const handleDeleteResena = async (id: number) => {
    try {
      await resenasService.delete(id);
      setSuccess('Reseña eliminada correctamente');
      await loadResenas();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la reseña');
    }
  };

  const handleCancelResena = () => {
    setIsCreatingResena(false);
    setResenaEditando(null);
    setError('');
    setSuccess('');
  };

  const isAdmin = hasRole('ADMIN');

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
        <div className="text-center text-gray-300 text-lg">Producto no encontrado</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-4">
        <Link to="/productos" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
          ← Volver a productos
        </Link>
        {isAdmin && !isEditing && (
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            Editar Producto
          </Button>
        )}
      </div>

      {isEditing && producto ? (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4 text-white">Editar Producto</h2>
          {success && <Alert variant="success" className="mb-4">{success}</Alert>}
          {error && <Alert variant="error" className="mb-4">{error}</Alert>}
          <ProductForm
            producto={producto}
            onSubmit={handleUpdateProducto}
            onCancel={() => {
              setIsEditing(false);
              setError('');
              setSuccess('');
            }}
            isLoading={isAdding}
            isEditing={true}
          />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl overflow-hidden border border-slate-700/50 backdrop-blur-sm">
        <div className="md:flex">
          <div className="md:w-1/2">
            {producto.rutaImagen ? (
              <img
                src={producto.rutaImagen}
                alt={producto.nombre}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-slate-700/50 flex items-center justify-center border-r border-slate-700/50">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-4 text-white">{producto.nombre}</h1>
            <p className="text-gray-300 mb-6">{producto.descripcion}</p>

            <div className="mb-6">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ${formatPrice(producto.precio_con_iva)}
                </span>
                <span className="text-sm text-gray-400">
                  IVA incluido (${producto.iva || 0}%)
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Precio base: ${formatPrice(producto.precio_base)}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-300 mb-2">
                <strong>Stock disponible:</strong> <span className="text-cyan-400">{producto.stock_actual}</span>
              </div>
              {producto.stock_actual <= producto.stock_minimo && (
                <div className="text-sm text-orange-400">
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
      )}

      <div className="mt-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-white">Reseñas</h2>
        
        {isAuthenticated && !isCreatingResena && !resenaEditando && (
          <div className="mb-6">
            {pedidos.length > 0 ? (
              <Button onClick={() => setIsCreatingResena(true)}>
                Escribir una Reseña
              </Button>
            ) : (
              <Alert variant="info">
                Debes tener un pedido entregado con este producto para poder dejar una reseña.
              </Alert>
            )}
          </div>
        )}

        {isCreatingResena && (
          <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
            <h3 className="text-lg font-semibold mb-4 text-white">
              {resenaEditando ? 'Editar Reseña' : 'Nueva Reseña'}
            </h3>
            {!resenaEditando && pedidos.length > 0 && (
              <div className="mb-4">
                <FormField label="Seleccionar Pedido" required htmlFor="pedido">
                  <Select
                    id="pedido"
                    value={pedidoSeleccionado?.toString() || ''}
                    onChange={(e) => setPedidoSeleccionado(e.target.value ? Number(e.target.value) : null)}
                    options={[
                      { value: '', label: 'Selecciona un pedido' },
                      ...pedidos.map((pedido) => ({
                        value: pedido.id,
                        label: `Pedido #${pedido.numero_pedido} - ${new Date(pedido.fecha_hora).toLocaleDateString('es-ES')}`,
                      })),
                    ]}
                  />
                </FormField>
              </div>
            )}
            <ReviewForm
              productoId={producto.id}
              pedidoId={pedidoSeleccionado || undefined}
              resena={resenaEditando || undefined}
              onSubmit={handleCreateResena}
              onCancel={handleCancelResena}
              isEditing={!!resenaEditando}
            />
          </div>
        )}

        {success && <Alert variant="success" className="mb-4">{success}</Alert>}
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}

        <ReviewList
          resenas={resenas}
          isLoading={isLoadingResenas}
          onEdit={isAuthenticated ? handleEditResena : undefined}
          onDelete={isAuthenticated ? handleDeleteResena : undefined}
          showActions={isAuthenticated}
        />
      </div>
    </MainLayout>
  );
}
