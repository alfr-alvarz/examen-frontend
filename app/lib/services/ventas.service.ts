import { api } from '../api';
import { transformVentasDiarias } from '../utils/transform';
import type { VentaDiaria } from '../types';

export const ventasService = {
  async getVentasDiarias(fechaInicio?: string, fechaFin?: string): Promise<VentaDiaria[]> {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);
    
    const query = params.toString();
    const data = await api.get<any[]>(`/api/reportes/ventas-diarias${query ? `?${query}` : ''}`);
    return transformVentasDiarias(data);
  },

  async getResumenMensual(mes?: string, año?: string): Promise<any> {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes);
    if (año) params.append('año', año);
    
    const query = params.toString();
    return api.get<any>(`/api/reportes/resumen-mensual${query ? `?${query}` : ''}`);
  },
};
