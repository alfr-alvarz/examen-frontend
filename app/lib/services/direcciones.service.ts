import { api } from '../api';
import type { DireccionEnvio } from '../types';

export const direccionesService = {
  async getAll(): Promise<DireccionEnvio[]> {
    return api.get<DireccionEnvio[]>('/api/direcciones');
  },

  async getById(id: number): Promise<DireccionEnvio> {
    return api.get<DireccionEnvio>(`/api/direcciones/${id}`);
  },

  async create(direccion: Partial<DireccionEnvio>): Promise<DireccionEnvio> {
    return api.post<DireccionEnvio>('/api/direcciones', direccion);
  },

  async update(id: number, direccion: Partial<DireccionEnvio>): Promise<DireccionEnvio> {
    return api.put<DireccionEnvio>(`/api/direcciones/${id}`, direccion);
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/api/direcciones/${id}`);
  },

  async setPrincipal(id: number): Promise<DireccionEnvio> {
    return api.patch<DireccionEnvio>(`/api/direcciones/${id}/principal`, {});
  },
};
