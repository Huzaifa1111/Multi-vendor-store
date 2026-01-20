import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartState, AddToCartPayload } from '@/types/cart';
import cartService from '@/services/cart.service';

interface CartStore extends CartState {
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartCount: () => Promise<number>;
  getCartTotal: () => Promise<number>;
  // Local state actions (for optimistic updates)
  addItemOptimistic: (item: CartItem) => void;
  removeItemOptimistic: (itemId: number) => void;
  updateItemOptimistic: (itemId: number, quantity: number) => void;
  clearCartOptimistic: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      count: 0,
      total: 0,
      isLoading: false,

      // Fetch cart from server
      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const items = await cartService.getCart();
          const count = items.reduce((sum, item) => sum + item.quantity, 0);
          const total = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
          set({ items, count, total });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Add item to cart
      addToCart: async (payload: AddToCartPayload) => {
        set({ isLoading: true });
        try {
          await cartService.addToCart(payload);
          await get().fetchCart(); // Refresh cart from server
        } catch (error) {
          console.error('Failed to add to cart:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Update item quantity
      updateQuantity: async (itemId: number, quantity: number) => {
        set({ isLoading: true });
        try {
          await cartService.updateCartItem(itemId, quantity);
          await get().fetchCart(); // Refresh cart from server
        } catch (error) {
          console.error('Failed to update quantity:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Remove item from cart
      removeItem: async (itemId: number) => {
        set({ isLoading: true });
        try {
          await cartService.removeFromCart(itemId);
          await get().fetchCart(); // Refresh cart from server
        } catch (error) {
          console.error('Failed to remove item:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Clear entire cart
      clearCart: async () => {
        set({ isLoading: true });
        try {
          await cartService.clearCart();
          set({ items: [], count: 0, total: 0 });
        } catch (error) {
          console.error('Failed to clear cart:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Get cart count from server
      getCartCount: async () => {
        try {
          const count = await cartService.getCartCount();
          set({ count });
          return count;
        } catch (error) {
          console.error('Failed to get cart count:', error);
          return get().count;
        }
      },

      // Get cart total from server
      getCartTotal: async () => {
        try {
          const total = await cartService.getCartTotal();
          set({ total });
          return total;
        } catch (error) {
          console.error('Failed to get cart total:', error);
          return get().total;
        }
      },

      // Optimistic updates (for immediate UI feedback)
      addItemOptimistic: (item: CartItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(i => i.productId === item.productId);
          let newItems = [...state.items];

          if (existingIndex > -1) {
            // Update quantity if item exists
            newItems[existingIndex].quantity += item.quantity;
          } else {
            // Add new item
            newItems.unshift(item);
          }

          const count = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const total = newItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

          return { items: newItems, count, total };
        });
      },

      removeItemOptimistic: (itemId: number) => {
        set((state) => {
          const newItems = state.items.filter(item => item.id !== itemId);
          const count = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

          return { items: newItems, count, total };
        });
      },

      updateItemOptimistic: (itemId: number, quantity: number) => {
        set((state) => {
          const newItems = state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          );
          const count = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const total = newItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

          return { items: newItems, count, total };
        });
      },

      clearCartOptimistic: () => {
        set({ items: [], count: 0, total: 0 });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        count: state.count,
        total: state.total
      }),
    }
  )
);