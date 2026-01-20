// apps/frontend/src/types/cart.ts
export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: number;
    name: string;
    image: string | null;
    description: string;
    stock: number;
  };
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