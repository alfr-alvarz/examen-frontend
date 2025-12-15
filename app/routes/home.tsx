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
      <div className="text-center py-20">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse-glow">
            Bienvenido a TechStore
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Descubre la última tecnología y realiza tus compras de forma fácil y segura
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link to="/productos">
            <Button size="lg" className="text-lg px-8 py-4">Explorar Productos</Button>
          </Link>
          {!isAuthenticated && (
            <Link to="/login">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">Iniciar Sesión</Button>
            </Link>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
