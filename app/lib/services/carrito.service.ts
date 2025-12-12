import { api } from '../api';
import type { CarritoItem, AgregarAlCarritoRequest } from '../types';

export const carritoService = {
  async getCarrito(usuarioId: number): Promise<CarritoItem[]> {
    return api.get<CarritoItem[]>(`/api/carrito/${usuarioId}`);
  },

  async agregarProducto(usuarioId: number, data: AgregarAlCarritoRequest): Promise<CarritoItem> {
    return api.post<CarritoItem>(`/api/carrito/${usuarioId}`, data);
  },

  async actualizarCantidad(usuarioId: number, id: number, cantidad: number): Promise<CarritoItem> {
    return api.patch<CarritoItem>(`/api/carrito/${usuarioId}/${id}`, { cantidad });
  },

  async eliminarItem(usuarioId: number, id: number): Promise<void> {
    return api.delete<void>(`/api/carrito/${usuarioId}/${id}`);
  },

  async vaciarCarrito(usuarioId: number): Promise<void> {
    return api.delete<void>(`/api/carrito/${usuarioId}`);
  },
};
