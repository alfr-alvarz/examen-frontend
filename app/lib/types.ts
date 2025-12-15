export type Rol = 'ADMIN' | 'CLIENTE';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
  telefono?: string;
  fecha_registro: string;
  activo: boolean;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  contrasena: string;
  telefono?: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  orden: number;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  iva: number;
  precio_con_iva: number;
  stock_actual: number;
  stock_minimo: number;
  categoria_id: number;
  categoria?: Categoria;
  rutaImagen?: string;
  activo: boolean;
}

export type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'PREPARANDO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
export type MetodoPago = 'TRANSFERENCIA' | 'TARJETA' | 'EFECTIVO' | 'OTRO';

export interface Pedido {
  id: number;
  numero_pedido: string;
  fecha_hora: string;
  estado: EstadoPedido;
  subtotal: number;
  total_iva: number;
  costo_envio: number;
  total: number;
  metodo_pago: MetodoPago;
  notas_cliente?: string;
  notas_admin?: string;
  fecha_confirmacion?: string;
  fecha_envio?: string;
  fecha_entrega?: string;
  numero_seguimiento?: string;
  usuario_id: number;
  nombre_destinatario: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  detalles?: DetallePedido[];
}

export interface DetallePedido {
  id: number;
  pedido_id: number;
  producto_id: number;
  producto?: Producto;
  cantidad: number;
  precio_unitario_base: number;
  iva: number;
  precio_unitario_con_iva: number;
  subtotal_sin_iva: number;
  subtotal_iva: number;
  subtotal_con_iva: number;
}

export interface CarritoItem {
  id: number;
  usuario_id: number;
  producto_id: number;
  producto?: Producto;
  cantidad: number;
  fecha_agregado: string;
}

export interface DireccionEnvio {
  id: number;
  usuario_id: number;
  alias: string;
  nombre_completo: string;
  telefono: string;
  calle: string;
  numero: string;
  departamento?: string;
  ciudad: string;
  region: string;
  codigo_postal: string;
  pais: string;
  es_principal: boolean;
  fecha_creacion: string;
}

export interface MetodoEnvio {
  id: number;
  nombre: string;
  descripcion: string;
  costo: number;
  tiempo_estimado: string;
  activo: boolean;
}

export interface Resena {
  id: number;
  producto_id: number;
  producto?: Producto;
  usuario_id: number;
  usuario?: Usuario;
  pedido_id: number;
  calificacion: number;
  comentario: string;
  aprobada: boolean;
  fecha_creacion: string;
}

export interface HistorialEstadoPedido {
  id: number;
  pedido_id: number;
  estado_anterior: EstadoPedido;
  estado_nuevo: EstadoPedido;
  usuario_id: number;
  comentario?: string;
  fecha_cambio: string;
}

export interface VentaDiaria {
  id: number;
  fecha: string;
  cantidad_pedidos: number;
  total_vendido: number;
  total_productos_vendidos: number;
  producto_mas_vendido_id?: number;
  promedio_ticket: number;
  pedidos_pendientes: number;
  pedidos_completados: number;
}

export interface ResumenMensual {
  year: number;
  month: number;
  totalVendido: number;
  totalPedidos: number;
  promedio: number;
  dias: number;
}

export interface CrearPedidoRequest {
  direccionEnvioId: number;
  metodoPago: MetodoPago;
  notasCliente?: string;
  nombreDestinatario: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  costoEnvio?: number;
  items: Array<{
    productoId: number;
    cantidad: number;
  }>;
}

export interface AgregarAlCarritoRequest {
  productoId: number;
  cantidad: number;
}

export interface CrearResenaRequest {
  productoId: number;
  pedidoId: number;
  calificacion: number;
  comentario?: string;
}
