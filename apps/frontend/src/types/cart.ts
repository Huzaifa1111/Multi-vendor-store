import { Product } from './product';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface CartState {
  items: CartItem[];
  count: number;
  total: number;
  isLoading: boolean;
}

export interface AddToCartPayload {
  productId: number;
  quantity: number;
}