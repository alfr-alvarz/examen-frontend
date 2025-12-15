import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ProductList } from './ProductList';
import type { Producto } from '~/lib/types';

const mockProductos: Producto[] = [
  {
    id: 1,
    nombre: 'Producto 1',
    descripcion: 'Descripción 1',
    precio_base: 100,
    iva: 21,
    precio_con_iva: 121,
    stock_actual: 10,
    stock_minimo: 5,
    categoria_id: 1,
  },
  {
    id: 2,
    nombre: 'Producto 2',
    descripcion: 'Descripción 2',
    precio_base: 200,
    iva: 21,
    precio_con_iva: 242,
    stock_actual: 5,
    stock_minimo: 3,
    categoria_id: 1,
  },
];

describe('ProductList', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it('debe renderizar la lista de productos', () => {
    renderWithRouter(<ProductList productos={mockProductos} />);
    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
  });

  it('debe mostrar el spinner cuando isLoading es true', () => {
    const { container } = renderWithRouter(<ProductList productos={[]} isLoading={true} />);
    const spinner = container.querySelector('div[class*="animate-spin"]');
    expect(spinner).toBeInTheDocument();
  });

  it('debe mostrar el mensaje de error cuando hay un error', () => {
    renderWithRouter(<ProductList productos={[]} error="Error al cargar productos" />);
    expect(screen.getByText('Error al cargar productos')).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay productos', () => {
    renderWithRouter(<ProductList productos={[]} />);
    expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
  });

  it('debe renderizar todos los productos proporcionados', () => {
    renderWithRouter(<ProductList productos={mockProductos} />);
    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
  });

  it('no debe mostrar el spinner cuando isLoading es false', () => {
    const { container } = renderWithRouter(<ProductList productos={mockProductos} isLoading={false} />);
    const spinner = container.querySelector('div[class*="animate-spin"]');
    expect(spinner).not.toBeInTheDocument();
  });
});

