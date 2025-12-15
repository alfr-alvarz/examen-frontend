import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Alert, LoadingSpinner, Button } from '~/components/atoms';
import { ventasService } from '~/lib/services/ventas.service';
import type { VentaDiaria } from '~/lib/types';

export default function AdminReportes() {
  const [ventasDiarias, setVentasDiarias] = useState<VentaDiaria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReportes();
  }, []);

  const loadReportes = async () => {
    try {
      setIsLoading(true);
      const data = await ventasService.getVentasDiarias();
      setVentasDiarias(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar reportes');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/admin">
            <Button variant="outline" size="sm">← Volver al Panel</Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-white bg-gray-900 px-4 py-2 rounded">Reportes de Ventas</h1>
        <p className="text-white bg-gray-900 px-4 py-2 rounded">Visualiza las estadísticas de ventas diarias</p>
      </div>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      {ventasDiarias.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No hay datos de ventas disponibles</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ventasDiarias.map((venta) => (
              <div key={venta.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {new Date(venta.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pedidos:</span>
                    <span className="font-semibold text-gray-900">{venta.cantidad_pedidos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total vendido:</span>
                    <span className="font-semibold text-gray-900">
                      ${Number(venta.total_vendido || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Productos vendidos:</span>
                    <span className="font-semibold text-gray-900">{venta.total_productos_vendidos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Promedio ticket:</span>
                    <span className="font-semibold text-gray-900">
                      ${Number(venta.promedio_ticket || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pendientes:</span>
                    <span className="font-semibold text-orange-600">{venta.pedidos_pendientes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completados:</span>
                    <span className="font-semibold text-green-600">{venta.pedidos_completados}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
