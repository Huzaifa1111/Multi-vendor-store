import api from '@/lib/api';
import { CartItem, AddToCartPayload } from '@/types/cart';

class CartService {
  async getCart(): Promise<CartItem[]> {
    const response = await api.get('/cart');
    return response.data;
  }

  async getCartCount(): Promise<number> {
    const response = await api.get('/cart/count');
    return response.data.count;
  }

  async getCartTotal(): Promise<number> {
    const response = await api.get('/cart/total');
    return response.data.total;
  }

  async addToCart(payload: AddToCartPayload): Promise<CartItem> {
    const response = await api.post('/cart', payload);
    return response.data;
  }

  async updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  }

  async removeFromCart(itemId: number): Promise<void> {
    await api.delete(`/cart/${itemId}`);
  }

  async clearCart(): Promise<void> {
    await api.delete('/cart');
  }
}

export default new CartService();