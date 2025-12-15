import { Link } from "react-router";
import { MainLayout } from "~/components/templates";
import { Button } from "~/components/atoms";
import { useAuth } from "~/contexts/AuthContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tienda Online" },
    { name: "description", content: "Bienvenido a nuestra tienda online" },
  ];
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  return (
    <MainLayout>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Bienvenido a la Tienda Online</h1>
        <p className="text-gray-600 mb-8">
          Descubre nuestros productos y realiza tus compras de forma fácil y segura
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/productos">
            <Button size="lg">Ver Productos</Button>
          </Link>
          {!isAuthenticated && (
            <Link to="/login">
              <Button variant="secondary" size="lg">Iniciar Sesión</Button>
            </Link>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
