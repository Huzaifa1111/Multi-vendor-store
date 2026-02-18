// apps/frontend/src/types/product.ts
export interface AttributeValue {
  id: number;
  value: string;
  attribute: {
    name: string;
  };
}

export interface Variation {
  id: number;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  images?: string[];
  attributeValues: AttributeValue[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  stock: number;
  image: string | null;
  images?: string[];
  category?: { id: number; name: string };
  brand?: { name: string };
  variations?: Variation[];
  featured?: boolean;
  upsells?: Product[];
  crossSells?: Product[];
  shippingPolicy?: string;
  returnPolicy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string | number;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'name';
}