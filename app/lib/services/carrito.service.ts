import { api } from '../api';
import type { CarritoItem, AgregarAlCarritoRequest } from '../types';

export const carritoService = {
  async getCarrito(usuarioId: number): Promise<CarritoItem[]> {
    const data = await api.get<any>(`/api/carrito/${usuarioId}`);
    // Asegurar que siempre devolvamos un array
    if (Array.isArray(data)) {
      return data;
    }
    // Si viene envuelto en un objeto, intentar extraer el array
    if (data && typeof data === 'object') {
      // Buscar propiedades comunes que puedan contener el array
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.carrito)) return data.carrito;
      if (Array.isArray(data.productos)) return data.productos;
    }
    // Si no es un array, devolver array vacío
    return [];
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
