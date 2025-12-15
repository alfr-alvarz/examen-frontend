import { Button } from '../atoms';

interface CartSummaryProps {
  subtotal: number;
  costoEnvio: number;
  total: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

export function CartSummary({
  subtotal,
  costoEnvio,
  total,
  onCheckout,
  isLoading,
}: CartSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Resumen</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-900">Subtotal:</span>
          <span className="text-gray-900">${(subtotal || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-900">Envío:</span>
          <span className="text-gray-900">${(costoEnvio || 0).toLocaleString()}</span>
        </div>
      </div>
      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between text-xl font-bold">
          <span className="text-gray-900">Total:</span>
          <span className="text-gray-900">${(total || 0).toLocaleString()}</span>
        </div>
      </div>
      <Button fullWidth onClick={onCheckout} disabled={isLoading}>
        {isLoading ? 'Procesando...' : 'Proceder al Checkout'}
      </Button>
    </div>
  );
}
