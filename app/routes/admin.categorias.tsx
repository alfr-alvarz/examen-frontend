import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { CategoryForm } from '~/components/organisms';
import { Alert, LoadingSpinner, Button, Badge } from '~/components/atoms';
import { categoriasService } from '~/lib/services/categorias.service';
import type { Categoria } from '~/lib/types';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await categoriasService.getAll();
      // Ordenar por orden y luego por nombre
      const sorted = data.sort((a, b) => {
        if (a.orden !== b.orden) {
          return a.orden - b.orden;
        }
        return a.nombre.localeCompare(b.nombre);
      });
      setCategorias(sorted);
    } catch (err: any) {
      setError(err.message || 'Error al cargar categorías');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (categoria: Partial<Categoria>) => {
    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');
      await categoriasService.create(categoria);
      setSuccessMessage('Categoría creada exitosamente');
      setShowForm(false);
      await loadCategorias();
    } catch (err: any) {
      setError(err.message || 'Error al crear la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return;
    }
    try {
      setError('');
      await categoriasService.delete(id);
      setSuccessMessage('Categoría eliminada exitosamente');
      await loadCategorias();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la categoría');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link to="/admin">
            <Button variant="outline" size="sm">← Volver al Panel</Button>
          </Link>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              + Nueva Categoría
            </Button>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2 text-white">Gestión de Categorías</h1>
        <p className="text-gray-400">Administra las categorías de productos</p>
      </div>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      {successMessage && <Alert variant="success" className="mb-4">{successMessage}</Alert>}

      {showForm ? (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Crear Nueva Categoría</h2>
          <CategoryForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setError('');
              setSuccessMessage('');
            }}
            isLoading={isSubmitting}
          />
        </div>
      ) : null}

      {categorias.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-8 text-center border border-slate-700/50 backdrop-blur-sm">
          <p className="text-gray-400">No hay categorías registradas</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            Crear Primera Categoría
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mb-4">
            <p className="text-sm text-gray-400">
              Total de categorías: <strong className="text-white">{categorias.length}</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">{categoria.nombre}</h3>
                  <div className="flex gap-2">
                    {categoria.activo ? (
                      <Badge variant="success">Activa</Badge>
                    ) : (
                      <Badge variant="warning">Inactiva</Badge>
                    )}
                  </div>
                </div>
                {categoria.descripcion && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{categoria.descripcion}</p>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                  <span className="text-xs text-gray-500">Orden: {categoria.orden}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(categoria.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

