import { api } from '../api';
import { transformCarritoItems } from '../utils/transform';
import type { CarritoItem, AgregarAlCarritoRequest } from '../types';

export const carritoService = {
  async getCarrito(usuarioId: number): Promise<CarritoItem[]> {
    const data = await api.get<any>(`/api/carrito/${usuarioId}`);
    
    // Log para debugging
    if (import.meta.env.DEV) {
      console.log('Carrito recibido del backend:', data);
    }
    
    // Asegurar que siempre devolvamos un array
    let items: any[] = [];
    if (Array.isArray(data)) {
      items = data;
    } else if (data && typeof data === 'object') {
      // Buscar propiedades comunes que puedan contener el array
      if (Array.isArray(data.items)) items = data.items;
      else if (Array.isArray(data.carrito)) items = data.carrito;
      else if (Array.isArray(data.productos)) items = data.productos;
    }
    
    // Transformar los items para normalizar los campos
    return transformCarritoItems(items);
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
