export const formatPrice = (price: number | string): string => {
  if (typeof price === 'string') {
    return `$${parseFloat(price).toFixed(2)}`;
  }
  return `$${price.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getStockStatus = (stock: number): { text: string; color: string } => {
  if (stock > 10) return { text: 'In Stock', color: 'green' };
  if (stock > 0) return { text: 'Low Stock', color: 'yellow' };
  return { text: 'Out of Stock', color: 'red' };
};