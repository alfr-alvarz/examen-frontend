import { api } from '../api';
import type { Categoria } from '../types';

export const categoriasService = {
  async getAll(): Promise<Categoria[]> {
    return api.get<Categoria[]>('/api/categorias');
  },

  async getById(id: number): Promise<Categoria> {
    return api.get<Categoria>(`/api/categorias/${id}`);
  },

  async create(categoria: Partial<Categoria>): Promise<Categoria> {
    return api.post<Categoria>('/api/categorias', categoria);
  },

  async update(id: number, categoria: Partial<Categoria>): Promise<Categoria> {
    return api.patch<Categoria>(`/api/categorias/${id}`, categoria);
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/api/categorias/${id}`);
  },
};
