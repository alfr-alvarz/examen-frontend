// Utilidades para transformar datos de la API
// NestJS puede devolver datos en camelCase mientras que la BD usa snake_case

export function transformProducto(producto: any): any {
  if (!producto) return producto;
  
  // Log para debugging
  if (import.meta.env.DEV) {
    console.log('Transformando producto:', producto);
  }
  
  // Mapear campos si vienen en camelCase desde NestJS
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
