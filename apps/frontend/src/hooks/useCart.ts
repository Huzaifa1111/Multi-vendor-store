// apps/frontend/src/hooks/useCart.ts
import { useCallback } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { AddToCartPayload } from '@/types/cart';

export const useCart = () => {
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
    addItemOptimistic,
    removeItemOptimistic,
    updateItemOptimistic,
    clearCartOptimistic,
  } = useCartStore();

  const handleAddToCart = useCallback(async (productId: number, quantity: number = 1) => {
    const tempId = Date.now();
    try {
      // Optimistic update
      addItemOptimistic({
        id: tempId,
        userId: 0,
        productId,
        quantity,
        price: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Actual API call
      await addToCart({ productId, quantity });
    } catch (error) {
      // Revert optimistic update on error
      console.error('Failed to add to cart:', error);
      removeItemOptimistic(tempId);
      throw error;
    }
  }, [addToCart, addItemOptimistic, removeItemOptimistic]);

  const handleUpdateQuantity = useCallback(async (itemId: number, quantity: number) => {
    try {
      updateItemOptimistic(itemId, quantity);
      await updateQuantity(itemId, quantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      await fetchCart(); // Refresh to get correct state
      throw error;
    }
  }, [updateQuantity, updateItemOptimistic, fetchCart]);

  const handleRemoveItem = useCallback(async (itemId: number) => {
    try {
      removeItemOptimistic(itemId);
      await removeItem(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
      await fetchCart();
      throw error;
    }
  }, [removeItem, removeItemOptimistic, fetchCart]);

  const handleClearCart = useCallback(async () => {
    try {
      clearCartOptimistic();
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
      await fetchCart();
      throw error;
    }
  }, [clearCart, clearCartOptimistic, fetchCart]);

  return {
    items,
    count,
    total,
    isLoading,

    // Actions
    fetchCart,
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeItem: handleRemoveItem,
    clearCart: handleClearCart,
  };
};