import { api } from '../api';
import type { Resena, CrearResenaRequest } from '../types';

export const resenasService = {
  async getByProducto(productoId: number): Promise<Resena[]> {
    return api.get<Resena[]>(`/api/resenas/producto/${productoId}`);
  },

  async getById(id: number): Promise<Resena> {
    return api.get<Resena>(`/api/resenas/${id}`);
  },

  async getByUsuario(): Promise<Resena[]> {
    return api.get<Resena[]>('/api/resenas/mis-resenas');
  },

  async create(data: CrearResenaRequest): Promise<Resena> {
    return api.post<Resena>('/api/resenas', data);
  },

  async aprobar(id: number): Promise<Resena> {
    return api.patch<Resena>(`/api/resenas/${id}`, {});
  },

  async rechazar(id: number): Promise<void> {
    return api.delete<void>(`/api/resenas/${id}`);
  },
};
