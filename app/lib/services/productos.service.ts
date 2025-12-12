import { api } from '../api';
import { transformProducto, transformProductos } from '../utils/transform';
import type { Producto } from '../types';

export const productosService = {
  async getAll(): Promise<Producto[]> {
    const data = await api.get<any[]>('/api/productos');
    return transformProductos(data) as Producto[];
  },

  async getById(id: number): Promise<Producto> {
    const data = await api.get<any>(`/api/productos/${id}`);
    return transformProducto(data) as Producto;
  },

  async getByCategoria(categoriaId: number): Promise<Producto[]> {
    const data = await api.get<any[]>(`/api/productos/categoria/${categoriaId}`);
    return transformProductos(data) as Producto[];
  },

  async create(producto: Partial<Producto>): Promise<Producto> {
    return api.post<Producto>('/api/productos', producto);
  },

  async update(id: number, producto: Partial<Producto>): Promise<Producto> {
    return api.patch<Producto>(`/api/productos/${id}`, producto);
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/api/productos/${id}`);
  },
};
