import { api } from '../api';
import { transformVentasDiarias } from '../utils/transform';
import type { VentaDiaria, ResumenMensual } from '../types';

export const ventasService = {
  async getVentasDiarias(fechaInicio?: Date | string, fechaFin?: Date | string): Promise<VentaDiaria[]> {
    const params = new URLSearchParams();
    
    if (fechaInicio) {
      const fechaInicioStr = fechaInicio instanceof Date 
        ? fechaInicio.toISOString().split('T')[0] 
        : fechaInicio;
      params.append('fechaInicio', fechaInicioStr);
    }
    
    if (fechaFin) {
      const fechaFinStr = fechaFin instanceof Date 
        ? fechaFin.toISOString().split('T')[0] 
        : fechaFin;
      params.append('fechaFin', fechaFinStr);
    }
    
    const query = params.toString();
    const data = await api.get<any[]>(`/api/reportes/ventas-diarias${query ? `?${query}` : ''}`);
    return transformVentasDiarias(data);
  },

  async getResumenMensual(year: number, month: number): Promise<ResumenMensual> {
    const params = new URLSearchParams();
    params.append('year', year.toString());
    params.append('month', month.toString());
    
    const query = params.toString();
    return api.get<ResumenMensual>(`/api/reportes/resumen-mensual?${query}`);
  },
};
