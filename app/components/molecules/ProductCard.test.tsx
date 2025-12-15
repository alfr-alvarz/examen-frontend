import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ProductCard } from './ProductCard';
import type { Producto } from '~/lib/types';

const mockProducto: Producto = {
  id: 1,
  nombre: 'Producto Test',
  descripcion: 'Descripción del producto',
  precio_base: 100,
  iva: 21,
  precio_con_iva: 121,
  stock_actual: 10,
  stock_minimo: 5,
  categoria_id: 1,
  rutaImagen: 'https://example.com/image.jpg',
};

describe('ProductCard', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it('debe renderizar el nombre del producto', () => {
    renderWithRouter(<ProductCard producto={mockProducto} />);
    expect(screen.getByText('Producto Test')).toBeInTheDocument();
  });

  it('debe renderizar la descripción del producto', () => {
    renderWithRouter(<ProductCard producto={mockProducto} />);
    expect(screen.getByText('Descripción del producto')).toBeInTheDocument();
  });

  it('debe renderizar el precio formateado', () => {
    renderWithRouter(<ProductCard producto={mockProducto} />);
    expect(screen.getByText(/121/)).toBeInTheDocument();
  });

  it('debe renderizar el stock', () => {
    renderWithRouter(<ProductCard producto={mockProducto} />);
    expect(screen.getByText(/Stock: 10/)).toBeInTheDocument();
  });

  it('debe renderizar el botón de ver detalles', () => {
    renderWithRouter(<ProductCard producto={mockProducto} />);
    expect(screen.getByText('Ver Detalles')).toBeInTheDocument();
  });

  it('debe renderizar la imagen cuando está disponible', () => {
    renderWithRouter(<ProductCard producto={mockProducto} />);
    const img = screen.getByAltText('Producto Test');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('debe mostrar placeholder cuando la imagen falla', () => {
    const productoSinImagen = { ...mockProducto, rutaImagen: undefined };
    renderWithRouter(<ProductCard producto={productoSinImagen} />);
    expect(screen.getByText('Producto Test')).toBeInTheDocument();
  });

  it('debe tener un enlace al detalle del producto', () => {
    renderWithRouter(<ProductCard producto={mockProducto} />);
    const link = screen.getByText('Ver Detalles').closest('a');
    expect(link).toHaveAttribute('href', '/productos/1');
  });

  it('debe mostrar stock 0 cuando no hay stock', () => {
    const productoSinStock = { ...mockProducto, stock_actual: 0 };
    renderWithRouter(<ProductCard producto={productoSinStock} />);
    expect(screen.getByText(/Stock: 0/)).toBeInTheDocument();
  });
});

