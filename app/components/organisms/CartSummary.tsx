import { Button } from '../atoms';
import { formatPrice } from '~/lib/utils/formatPrice';

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
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-6 h-fit border border-slate-700/50 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-4 text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Resumen</h2>
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal:</span>
          <span className="font-semibold">${formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Envío:</span>
          <span className="font-semibold">${formatPrice(costoEnvio)}</span>
        </div>
      </div>
      <div className="border-t border-slate-700 pt-4 mb-4">
        <div className="flex justify-between text-xl font-bold">
          <span className="text-white">Total:</span>
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">${formatPrice(total)}</span>
        </div>
      </div>
      <Button fullWidth onClick={onCheckout} disabled={isLoading}>
        {isLoading ? 'Procesando...' : 'Proceder al Checkout'}
      </Button>
    </div>
  );
}
