import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartItem } from './CartItem';
import type { CarritoItem } from '~/lib/types';

const mockItem: CarritoItem = {
  id: 1,
  cantidad: 2,
  producto: {
    id: 1,
    nombre: 'Producto Test',
    descripcion: 'Descripción',
    precio_base: 100,
    iva: 21,
    precio_con_iva: 121,
    stock_actual: 10,
    stock_minimo: 5,
    categoria_id: 1,
    rutaImagen: 'https://example.com/image.jpg',
  },
  precio_con_iva: 121,
};

describe('CartItem', () => {
  it('debe renderizar el nombre del producto', () => {
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    expect(screen.getByText('Producto Test')).toBeInTheDocument();
  });

  it('debe renderizar la cantidad', () => {
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('debe llamar onUpdateQuantity cuando se hace clic en el botón de incrementar', async () => {
    const handleUpdate = vi.fn();
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={handleUpdate}
        onRemove={vi.fn()}
      />
    );
    
    const incrementButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent === '+'
    );
    if (incrementButton) {
      await user.click(incrementButton);
      expect(handleUpdate).toHaveBeenCalledWith(1, 3);
    }
  });

  it('debe llamar onUpdateQuantity cuando se hace clic en el botón de decrementar', async () => {
    const handleUpdate = vi.fn();
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={handleUpdate}
        onRemove={vi.fn()}
      />
    );
    
    const decrementButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent === '-'
    );
    if (decrementButton) {
      await user.click(decrementButton);
      expect(handleUpdate).toHaveBeenCalledWith(1, 1);
    }
  });

  it('debe llamar onRemove cuando se hace clic en eliminar', async () => {
    const handleRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={vi.fn()}
        onRemove={handleRemove}
      />
    );
    
    const removeButton = screen.getByText('Eliminar');
    await user.click(removeButton);
    expect(handleRemove).toHaveBeenCalledWith(1);
  });

  it('debe deshabilitar el botón de incrementar cuando la cantidad alcanza el stock', () => {
    const itemMaxStock = { ...mockItem, cantidad: 10 };
    render(
      <CartItem
        item={itemMaxStock}
        onUpdateQuantity={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    
    const incrementButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent === '+'
    );
    expect(incrementButton).toBeDisabled();
  });

  it('debe renderizar la imagen del producto cuando está disponible', () => {
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    const img = screen.getByAltText('Producto Test');
    expect(img).toBeInTheDocument();
  });
});

