import { api } from '../api';
import { transformPedido } from '../utils/transform';
import type { Pedido, CrearPedidoRequest, EstadoPedido } from '../types';

export const pedidosService = {
  async getAll(): Promise<Pedido[]> {
    const data = await api.get<any[]>('/api/pedidos');
    return Array.isArray(data) ? data.map(transformPedido) : [];
  },

  async getById(id: number): Promise<Pedido> {
    const data = await api.get<any>(`/api/pedidos/${id}`);
    return transformPedido(data) as Pedido;
  },

  async getMisPedidos(): Promise<Pedido[]> {
    const data = await api.get<any[]>('/api/pedidos/mis-pedidos');
    return Array.isArray(data) ? data.map(transformPedido) : [];
  },

  async create(data: CrearPedidoRequest): Promise<Pedido> {
    return api.post<Pedido>('/api/pedidos', data);
  },

  async updateEstado(id: number, estado: EstadoPedido, comentario?: string): Promise<Pedido> {
    return api.patch<Pedido>(`/api/pedidos/${id}/estado`, { estado, comentario });
  },

  async cancelar(id: number): Promise<Pedido> {
    return api.patch<Pedido>(`/api/pedidos/${id}/cancelar`, {});
  },
};
