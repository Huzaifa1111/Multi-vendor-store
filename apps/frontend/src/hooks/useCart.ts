import { useCartStore } from '@/store/useCartStore';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';

export function useCart() {
  const { isAuthenticated } = useAuth();
  const {
    items,
    count,
    total,
    isLoading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartCount,
    getCartTotal,
  } = useCartStore();

  // Fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Sync cart count with server periodically
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        getCartCount();
        getCartTotal();
      }, 30000); // Sync every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, getCartCount, getCartTotal]);

  return {
    items,
    count,
    total,
    isLoading,
    addToCart: async (productId: number, quantity: number = 1) => {
      if (!isAuthenticated) {
        throw new Error('Please login to add items to cart');
      }
      return await addToCart({ productId, quantity });
    },
    updateQuantity,
    removeItem,
    clearCart,
    getCartCount,
    getCartTotal,
  };
}