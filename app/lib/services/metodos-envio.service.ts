import { api } from '../api';
import type { MetodoEnvio } from '../types';

export const metodosEnvioService = {
  async getAll(): Promise<MetodoEnvio[]> {
    return api.get<MetodoEnvio[]>('/api/metodos-envio');
  },

  async getActivos(): Promise<MetodoEnvio[]> {
    return api.get<MetodoEnvio[]>('/api/metodos-envio/activos');
  },

  async getById(id: number): Promise<MetodoEnvio> {
    return api.get<MetodoEnvio>(`/api/metodos-envio/${id}`);
  },

  async create(metodo: Partial<MetodoEnvio>): Promise<MetodoEnvio> {
    return api.post<MetodoEnvio>('/api/metodos-envio', metodo);
  },

  async update(id: number, metodo: Partial<MetodoEnvio>): Promise<MetodoEnvio> {
    return api.patch<MetodoEnvio>(`/api/metodos-envio/${id}`, metodo);
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/api/metodos-envio/${id}`);
  },
};
