export function parseFecha(fechaString: string | undefined | null): string {
  if (!fechaString) return '';
  
  try {
    let fechaISO = fechaString.replace(' ', 'T').replace(/\.(\d{3})\d+/, '.$1');
    
    const fecha = new Date(fechaISO);
    return isNaN(fecha.getTime()) ? fechaString : fecha.toISOString();
  } catch {
    return fechaString;
  }
}

export function transformProducto(producto: any): any {
  if (!producto) return producto;
  
  if (import.meta.env.DEV) {
    console.log('Transformando producto:', producto);
  }
  
  const transformed = {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio_base: producto.precioBase ?? producto.precio_base ?? 0,
    iva: producto.iva ?? 0,
    precio_con_iva: producto.precioConIva ?? producto.precio_con_iva ?? 0,
    stock_actual: producto.stockActual ?? producto.stock_actual ?? 0,
    stock_minimo: producto.stockMinimo ?? producto.stock_minimo ?? 0,
    categoria_id: producto.categoriaId ?? producto.categoria_id,
    categoria: producto.categoria,
    rutaImagen: producto.rutaImagen ?? producto.ruta_imagen,
    activo: producto.activo !== undefined ? producto.activo : true,
  };
  
  if (import.meta.env.DEV) {
    console.log('Producto transformado:', transformed);
  }
  
  return transformed;
}

export function transformProductos(productos: any[]): any[] {
  if (!Array.isArray(productos)) return productos;
  return productos.map(transformProducto);
}

export function transformCarritoItem(item: any): any {
  if (!item) return item;
  
  const producto = item.producto ? transformProducto(item.producto) : undefined;
  
  return {
    id: item.id,
    usuario_id: item.usuarioId ?? item.usuario_id,
    producto_id: item.productoId ?? item.producto_id,
    producto: producto,
    cantidad: item.cantidad ?? 0,
    fecha_agregado: item.fechaAgregado ?? item.fecha_agregado ?? item.fecha_creacion,
  };
}

export function transformCarritoItems(items: any[]): any[] {
  if (!Array.isArray(items)) return [];
  return items.map(transformCarritoItem);
}

export function transformDetallePedido(detalle: any): any {
  if (!detalle) return detalle;
  
  const producto = detalle.producto ? transformProducto(detalle.producto) : undefined;
  
  return {
    id: detalle.id,
    pedido_id: detalle.pedidoId ?? detalle.pedido_id,
    producto_id: detalle.productoId ?? detalle.producto_id,
    producto: producto,
    cantidad: detalle.cantidad ?? 0,
    precio_unitario_base: detalle.precioUnitarioBase ?? detalle.precio_unitario_base ?? 0,
    iva: detalle.iva ?? 0,
    precio_unitario_con_iva: detalle.precioUnitarioConIva ?? detalle.precio_unitario_con_iva ?? 0,
    subtotal_sin_iva: detalle.subtotalSinIva ?? detalle.subtotal_sin_iva ?? 0,
    subtotal_iva: detalle.subtotalIva ?? detalle.subtotal_iva ?? 0,
    subtotal_con_iva: detalle.subtotalConIva ?? detalle.subtotal_con_iva ?? 0,
  };
}

export function transformUsuario(usuario: any): any {
  if (!usuario) return usuario;
  
  const fechaRegistroRaw = usuario.fechaRegistro ?? usuario.fecha_registro ?? usuario.fechaCreacion ?? '';
  const fechaRegistro = fechaRegistroRaw ? parseFecha(fechaRegistroRaw) : '';
  
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol,
    telefono: usuario.telefono,
    fecha_registro: fechaRegistro,
    activo: usuario.activo !== undefined ? usuario.activo : true,
  };
}

export function transformUsuarios(usuarios: any[]): any[] {
  if (!Array.isArray(usuarios)) return [];
  return usuarios.map(transformUsuario);
}

export function transformVentaDiaria(venta: any): any {
  if (!venta) return venta;
  
  return {
    id: venta.id,
    fecha: venta.fecha ? parseFecha(venta.fecha) : venta.fecha,
    cantidad_pedidos: venta.cantidadPedidos ?? venta.cantidad_pedidos ?? 0,
    total_vendido: Number(venta.totalVendido ?? venta.total_vendido ?? 0),
    total_productos_vendidos: venta.totalProductosVendidos ?? venta.total_productos_vendidos ?? 0,
    producto_mas_vendido_id: venta.productoMasVendidoId ?? venta.producto_mas_vendido_id,
    promedio_ticket: Number(venta.promedioTicket ?? venta.promedio_ticket ?? 0),
    pedidos_pendientes: venta.pedidosPendientes ?? venta.pedidos_pendientes ?? 0,
    pedidos_completados: venta.pedidosCompletados ?? venta.pedidos_completados ?? 0,
  };
}

export function transformVentasDiarias(ventas: any[]): any[] {
  if (!Array.isArray(ventas)) return [];
  return ventas.map(transformVentaDiaria);
}

export function transformPedido(pedido: any): any {
  if (!pedido) return pedido;
  
  const detalles = pedido.detalles 
    ? (Array.isArray(pedido.detalles) ? pedido.detalles.map(transformDetallePedido) : [])
    : undefined;
  
  return {
    id: pedido.id,
    numero_pedido: pedido.numeroPedido ?? pedido.numero_pedido,
    fecha_hora: pedido.fechaHora ? parseFecha(pedido.fechaHora) : (pedido.fecha_hora ? parseFecha(pedido.fecha_hora) : (pedido.fecha ? parseFecha(pedido.fecha) : '')),
    estado: pedido.estado,
    subtotal: Number(pedido.subtotal ?? 0),
    total_iva: Number(pedido.totalIva ?? pedido.total_iva ?? 0),
    costo_envio: Number(pedido.costoEnvio ?? pedido.costo_envio ?? 0),
    total: Number(pedido.total ?? 0),
    metodo_pago: pedido.metodoPago ?? pedido.metodo_pago,
    notas_cliente: pedido.notasCliente ?? pedido.notas_cliente,
    notas_admin: pedido.notasAdmin ?? pedido.notas_admin,
    fecha_confirmacion: pedido.fechaConfirmacion ? parseFecha(pedido.fechaConfirmacion) : (pedido.fecha_confirmacion ? parseFecha(pedido.fecha_confirmacion) : undefined),
    fecha_envio: pedido.fechaEnvio ? parseFecha(pedido.fechaEnvio) : (pedido.fecha_envio ? parseFecha(pedido.fecha_envio) : undefined),
    fecha_entrega: pedido.fechaEntrega ? parseFecha(pedido.fechaEntrega) : (pedido.fecha_entrega ? parseFecha(pedido.fecha_entrega) : undefined),
    numero_seguimiento: pedido.numeroSeguimiento ?? pedido.numero_seguimiento,
    usuario_id: pedido.usuarioId ?? pedido.usuario_id,
    nombre_destinatario: pedido.nombreDestinatario ?? pedido.nombre_destinatario,
    telefono: pedido.telefono,
    direccion: pedido.direccion,
    ciudad: pedido.ciudad,
    region: pedido.region,
    detalles: detalles,
  };
}
