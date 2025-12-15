/**
 * Formatea un precio con punto como separador de miles
 * Ejemplo: 21420.00 -> "21.420"
 * @param price - El precio a formatear
 * @returns El precio formateado como string
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return '0';
  }
  
  // Redondear a número entero y formatear con punto como separador de miles
  const roundedPrice = Math.round(price);
  return roundedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

