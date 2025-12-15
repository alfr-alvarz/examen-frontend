import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { OrderCard } from './OrderCard';
import type { Pedido } from '~/lib/types';

const mockPedido: Pedido = {
  id: 1,
  numero_pedido: 'PED-001',
  usuario_id: 1,
  fecha_hora: '2024-01-15T10:00:00Z',
  estado: 'PENDIENTE',
  total: 242,
  detalles: [
    {
      id: 1,
      pedido_id: 1,
      producto_id: 1,
      cantidad: 2,
      precio_unitario: 121,
      subtotal: 242,
    },
  ],
};

describe('OrderCard', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it('debe renderizar el número de pedido', () => {
    renderWithRouter(<OrderCard pedido={mockPedido} />);
    expect(screen.getByText(/PED-001/)).toBeInTheDocument();
  });

  it('debe renderizar el estado del pedido', () => {
    renderWithRouter(<OrderCard pedido={mockPedido} />);
    expect(screen.getByText('PENDIENTE')).toBeInTheDocument();
  });

  it('debe renderizar el total del pedido', () => {
    renderWithRouter(<OrderCard pedido={mockPedido} />);
    expect(screen.getByText(/242/)).toBeInTheDocument();
  });

  it('debe renderizar la cantidad de productos', () => {
    renderWithRouter(<OrderCard pedido={mockPedido} />);
    expect(screen.getByText(/1 producto/)).toBeInTheDocument();
  });

  it('debe tener un enlace al detalle del pedido', () => {
    renderWithRouter(<OrderCard pedido={mockPedido} />);
    const link = screen.getByText(/PED-001/).closest('a');
    expect(link).toHaveAttribute('href', '/pedidos/1');
  });

  it('debe mostrar el número de seguimiento cuando está disponible', () => {
    const pedidoConSeguimiento = {
      ...mockPedido,
      numero_seguimiento: 'SEG-123',
    };
    renderWithRouter(<OrderCard pedido={pedidoConSeguimiento} />);
    expect(screen.getByText(/SEG-123/)).toBeInTheDocument();
  });

  it('debe aplicar el variant correcto según el estado', () => {
    const pedidoEntregado = { ...mockPedido, estado: 'ENTREGADO' };
    const { container } = renderWithRouter(<OrderCard pedido={pedidoEntregado} />);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('bg-green-500/10');
  });
});

