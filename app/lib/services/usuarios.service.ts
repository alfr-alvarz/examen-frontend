import { api } from '../api';
import type { Usuario } from '../types';

export const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    return api.get<Usuario[]>('/api/usuarios');
  },

  async getById(id: number): Promise<Usuario> {
    return api.get<Usuario>(`/api/usuarios/${id}`);
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/api/usuarios/${id}`);
  },
};
