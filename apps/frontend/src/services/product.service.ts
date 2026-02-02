// apps/frontend/src/services/product.service.ts
import api from '@/lib/api';

export interface Variation {
  id: number;
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
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
  category?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  brand?: { name: string };
  variations?: Variation[];
  upsells?: Product[];
  crossSells?: Product[];
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  featured?: boolean; // ADD THIS LINE
  image?: File;
}

export interface UpdateProductData extends Partial<CreateProductData> { }

class ProductService {
  async getAllProducts(filters?: {
    category?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    limit?: number;
  }): Promise<Product[]> {
    const response = await api.get('/products', { params: filters });
    return response.data;
  }

  // apps/frontend/src/services/product.service.ts - Add this method
  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    try {
      const response = await api.get('/products/featured', {
        params: limit ? { limit } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Featured endpoint failed, falling back:', error);
      // Fallback: fetch all and filter
      const allProducts = await this.getAllProducts();
      return allProducts.filter(p => p.featured).slice(0, limit);
    }
  }

  async getCategories(): Promise<string[]> { // ADD THIS METHOD
    const response = await api.get('/products/categories');
    return response.data.categories;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    const formData = new FormData();

    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('stock', productData.stock.toString());

    if (productData.category) {
      formData.append('category', productData.category);
    }

    if (productData.featured !== undefined) { // ADD THIS BLOCK
      formData.append('featured', productData.featured.toString());
    }

    if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }

  async updateProduct(id: number, productData: UpdateProductData): Promise<Product> {
    const formData = new FormData();

    if (productData.name) formData.append('name', productData.name);
    if (productData.description) formData.append('description', productData.description);
    if (productData.price) formData.append('price', productData.price.toString());
    if (productData.stock) formData.append('stock', productData.stock.toString());
    if (productData.category) formData.append('category', productData.category);

    if (productData.featured !== undefined) { // ADD THIS BLOCK
      formData.append('featured', productData.featured.toString());
    }

    if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await api.patch(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  }
}

export default new ProductService();