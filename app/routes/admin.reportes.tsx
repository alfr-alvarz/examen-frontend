import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Alert, LoadingSpinner, Button, Input, Select } from '~/components/atoms';
import { FormField } from '~/components/molecules';
import { ventasService } from '~/lib/services/ventas.service';
import { formatPrice } from '~/lib/utils/formatPrice';
import type { VentaDiaria, ResumenMensual } from '~/lib/types';

type TabType = 'ventas-diarias' | 'resumen-mensual';

export default function AdminReportes() {
  const [activeTab, setActiveTab] = useState<TabType>('ventas-diarias');
  const [ventasDiarias, setVentasDiarias] = useState<VentaDiaria[]>([]);
  const [resumenMensual, setResumenMensual] = useState<ResumenMensual | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  useEffect(() => {
    if (activeTab === 'ventas-diarias') {
      loadVentasDiarias();
    } else {
      loadResumenMensual();
    }
  }, [activeTab]);

  const loadVentasDiarias = async () => {
    try {
      setIsLoading(true);
      setError('');
      const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : undefined;
      const fechaFinDate = fechaFin ? new Date(fechaFin) : undefined;
      const data = await ventasService.getVentasDiarias(fechaInicioDate, fechaFinDate);
      setVentasDiarias(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar ventas diarias');
    } finally {
      setIsLoading(false);
    }
  };

  const loadResumenMensual = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await ventasService.getResumenMensual(year, month);
      setResumenMensual(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar resumen mensual');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltrosVentas = () => {
    loadVentasDiarias();
  };

  const handleFiltrosResumen = () => {
    loadResumenMensual();
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/admin">
            <Button variant="outline" size="sm">← Volver al Panel</Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-white">Reportes de Ventas</h1>
        <p className="text-gray-400">Visualiza las estadísticas de ventas diarias y resúmenes mensuales</p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 border-b border-slate-700/50">
          <button
            onClick={() => setActiveTab('ventas-diarias')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'ventas-diarias'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Ventas Diarias
          </button>
          <button
            onClick={() => setActiveTab('resumen-mensual')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'resumen-mensual'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Resumen Mensual
          </button>
        </div>
      </div>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      {activeTab === 'ventas-diarias' ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Fecha Inicio" htmlFor="fechaInicio">
                <Input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </FormField>
              <FormField label="Fecha Fin" htmlFor="fechaFin">
                <Input
                  id="fechaFin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </FormField>
              <div className="flex items-end">
                <Button onClick={handleFiltrosVentas} fullWidth>
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : ventasDiarias.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-8 text-center border border-slate-700/50 backdrop-blur-sm">
              <p className="text-gray-400">No hay datos de ventas disponibles para el período seleccionado</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4">
                <p className="text-sm text-gray-400">
                  Total de días con ventas: <strong className="text-white">{ventasDiarias.length}</strong>
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ventasDiarias.map((venta) => (
                  <div
                    key={venta.id}
                    className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-blue-500/50 transition-all"
                  >
                    <h3 className="text-lg font-bold text-white mb-4">
                      {new Date(venta.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pedidos:</span>
                        <span className="font-semibold text-white">{venta.cantidad_pedidos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total vendido:</span>
                        <span className="font-semibold text-white">
                          ${formatPrice(venta.total_vendido)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Productos vendidos:</span>
                        <span className="font-semibold text-white">{venta.total_productos_vendidos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Promedio ticket:</span>
                        <span className="font-semibold text-white">
                          ${formatPrice(venta.promedio_ticket)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-700/50">
                        <span className="text-gray-400">Pendientes:</span>
                        <span className="font-semibold text-orange-400">{venta.pedidos_pendientes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Completados:</span>
                        <span className="font-semibold text-green-400">{venta.pedidos_completados}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Año" htmlFor="year">
                <Select
                  id="year"
                  value={year.toString()}
                  onChange={(e) => setYear(Number(e.target.value))}
                  options={years.map((y) => ({ value: y, label: y.toString() }))}
                />
              </FormField>
              <FormField label="Mes" htmlFor="month">
                <Select
                  id="month"
                  value={month.toString()}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  options={months.map((m) => ({ value: m.value, label: m.label }))}
                />
              </FormField>
              <div className="flex items-end">
                <Button onClick={handleFiltrosResumen} fullWidth>
                  Consultar
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : resumenMensual ? (
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-8 border border-slate-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">
                Resumen de {months[month - 1].label} {year}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/50">
                  <p className="text-gray-400 text-sm mb-2">Total Vendido</p>
                  <p className="text-3xl font-bold text-blue-400">
                    ${formatPrice(resumenMensual.totalVendido)}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/50">
                  <p className="text-gray-400 text-sm mb-2">Total Pedidos</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {resumenMensual.totalPedidos}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/50">
                  <p className="text-gray-400 text-sm mb-2">Promedio por Pedido</p>
                  <p className="text-3xl font-bold text-cyan-400">
                    ${formatPrice(resumenMensual.promedio)}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/50">
                  <p className="text-gray-400 text-sm mb-2">Días con Ventas</p>
                  <p className="text-3xl font-bold text-green-400">
                    {resumenMensual.dias}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-8 text-center border border-slate-700/50 backdrop-blur-sm">
              <p className="text-gray-400">No hay datos disponibles para el período seleccionado</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
