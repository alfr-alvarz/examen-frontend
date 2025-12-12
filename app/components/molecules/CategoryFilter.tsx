import type { Categoria } from '~/lib/types';
import { Button } from '../atoms';

interface CategoryFilterProps {
  categorias: Categoria[];
  categoriaSeleccionada: number | null;
  onSelectCategoria: (categoriaId: number | null) => void;
}

export function CategoryFilter({
  categorias,
  categoriaSeleccionada,
  onSelectCategoria,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant={categoriaSeleccionada === null ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onSelectCategoria(null)}
      >
        Todos
      </Button>
      {categorias.map((categoria) => (
        <Button
          key={categoria.id}
          variant={categoriaSeleccionada === categoria.id ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onSelectCategoria(categoria.id)}
        >
          {categoria.nombre}
        </Button>
      ))}
    </div>
  );
}
