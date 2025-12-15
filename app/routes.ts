import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("productos", "routes/productos.tsx"),
  route("productos/:id", "routes/productos.$id.tsx"),
  route("carrito", "routes/carrito.tsx"),
  route("pedidos", "routes/pedidos.tsx"),
  route("pedidos/:id", "routes/pedidos.$id.tsx"),
  route("checkout", "routes/checkout.tsx"),
  route("admin", "routes/admin.tsx"),
  route("admin/usuarios", "routes/admin.usuarios.tsx"),
  route("admin/reportes", "routes/admin.reportes.tsx"),
  route("admin/categorias", "routes/admin.categorias.tsx"),
] satisfies RouteConfig;
