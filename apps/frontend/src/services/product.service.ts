import api from '@/lib/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  image?: File;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

class ProductService {
  async getAllProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Product[]> {
    const response = await api.get('/products', { params: filters });
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    const formData = new FormData();
    
    // Append text fields
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('stock', productData.stock.toString());
    
    if (productData.category) {
      formData.append('category', productData.category);
    }
    
    // Append image if exists
    if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data; // Note: Your backend returns { data: product }
  }

  async updateProduct(id: number, productData: UpdateProductData): Promise<Product> {
    const formData = new FormData();
    
    // Append text fields
    if (productData.name) formData.append('name', productData.name);
    if (productData.description) formData.append('description', productData.description);
    if (productData.price) formData.append('price', productData.price.toString());
    if (productData.stock) formData.append('stock', productData.stock.toString());
    if (productData.category) formData.append('category', productData.category);
    
    // Append image if exists
    if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await api.patch(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  }
}

export default new ProductService();