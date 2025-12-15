import { api } from '../api';
import { transformUsuario, transformUsuarios } from '../utils/transform';
import type { Usuario } from '../types';

export const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    const data = await api.get<any[]>('/api/usuarios');
    return transformUsuarios(data);
  },

  async getById(id: number): Promise<Usuario> {
    const data = await api.get<any>(`/api/usuarios/${id}`);
    return transformUsuario(data) as Usuario;
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/api/usuarios/${id}`);
  },
};
