export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return '0';
  }
  
  const roundedPrice = Math.round(price);
  return roundedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

