import { api } from '../api';
import type { Pedido, CrearPedidoRequest, EstadoPedido } from '../types';

export const pedidosService = {
  async getAll(): Promise<Pedido[]> {
    return api.get<Pedido[]>('/api/pedidos');
  },

  async getById(id: number): Promise<Pedido> {
    return api.get<Pedido>(`/api/pedidos/${id}`);
  },

  async getMisPedidos(): Promise<Pedido[]> {
    return api.get<Pedido[]>('/api/pedidos/mis-pedidos');
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
