export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  variationId?: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: number;
    name: string;
    image: string | null;
    images?: string[];
    description: string;
    stock: number;
  };
  variation?: {
    id: number;
    color: string;
    size: string;
    sku: string;
    price: number;
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
  variationId?: number;
}