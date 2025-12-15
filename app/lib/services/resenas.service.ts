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
    // El backend requiere pedidoId como entero obligatorio
    // Si es null, usamos 0 como valor por defecto
    const payload: any = {
      productoId: data.productoId,
      pedidoId: data.pedidoId !== null && data.pedidoId !== undefined ? data.pedidoId : 0,
      calificacion: data.calificacion,
    };
    
    if (data.comentario) {
      payload.comentario = data.comentario;
    }
    
    return api.post<Resena>('/api/resenas', payload);
  },

  async update(id: number, data: Partial<Pick<Resena, 'calificacion' | 'comentario'>>): Promise<Resena> {
    return api.patch<Resena>(`/api/resenas/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/api/resenas/${id}`);
  },

  // Métodos legacy (mantener por compatibilidad)
  async aprobar(id: number): Promise<Resena> {
    return api.patch<Resena>(`/api/resenas/${id}`, {});
  },

  async rechazar(id: number): Promise<void> {
    return api.delete<void>(`/api/resenas/${id}`);
  },
};
