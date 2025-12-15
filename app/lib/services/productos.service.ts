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
    const response = await api.get<any>(`/api/categorias/${categoriaId}`);
    const productos = Array.isArray(response) ? response : (response.productos || []);
    return transformProductos(productos) as Producto[];
  },

  async create(producto: Partial<Producto>): Promise<Producto> {
    const productoData: any = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioBase: Number(producto.precio_base || producto.precioBase || 0),
      iva: Number(producto.iva || 0),
      stockActual: Math.floor(Number(producto.stock_actual || producto.stockActual || 0)),
    };
    
    if (producto.categoria_id || producto.categoriaId) {
      productoData.categoriaId = Math.floor(Number(producto.categoria_id || producto.categoriaId));
    }

    if (producto.rutaImagen) {
      productoData.rutaImagen = producto.rutaImagen;
    }

    const data = await api.post<any>('/api/productos', productoData);
    return transformProducto(data) as Producto;
  },

  async update(id: number, producto: Partial<Producto>): Promise<Producto> {
    const productoData: any = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioBase: Number(producto.precio_base || producto.precioBase || 0),
      iva: Number(producto.iva || 0),
      stockActual: Math.floor(Number(producto.stock_actual || producto.stockActual || 0)),
    };

    if (producto.stock_minimo !== undefined || producto.stockMinimo !== undefined) {
      productoData.stockMinimo = Math.floor(Number(producto.stock_minimo || producto.stockMinimo || 0));
    }

    if (producto.categoria_id || producto.categoriaId) {
      productoData.categoriaId = Math.floor(Number(producto.categoria_id || producto.categoriaId));
    }

    if (producto.rutaImagen) {
      productoData.rutaImagen = producto.rutaImagen;
    }

    if (producto.activo !== undefined) {
      productoData.activo = producto.activo;
    }

    const data = await api.patch<any>(`/api/productos/${id}`, productoData);
    return transformProducto(data) as Producto;
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/api/productos/${id}`);
  },
};
