'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import productService from '@/services/product.service';
import { ArrowLeft, Package, ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/lib/auth';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  category?: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const { isAuthenticated } = useAuth();
const { addToCart, isLoading } = useCart();
const [addingToCart, setAddingToCart] = useState(false);

const handleAddToCart = async () => {
  if (!isAuthenticated) {
    router.push('/auth/login?redirect=' + window.location.pathname);
    return;
  }
  
  setAddingToCart(true);
  try {
    await addToCart(product.id, 1);
    alert('Added to cart!');
  } catch (error: any) {
    alert(error.message || 'Failed to add to cart');
  } finally {
    setAddingToCart(false);
  }
};

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      // TODO: Implement add to cart logic
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <button
            onClick={() => router.push('/products')}
            className="text-blue-600 hover:text-blue-800"
          >
            Browse all products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Package className="w-32 h-32 text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {product.category || 'Uncategorized'}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(4.5) 24 reviews</span>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-6">
                {formatPrice(product.price)}
              </div>

              <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-gray-700 mr-4">Availability:</span>
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 mr-4">Added:</span>
                  <span className="text-gray-600">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
  onClick={handleAddToCart}
  disabled={product.stock === 0 || addingToCart || isLoading}
  className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
>
  <ShoppingCart className="w-5 h-5 mr-2" />
  {addingToCart ? 'Adding...' : 'Add to Cart'}
</button>
                
                <button
                  onClick={() => router.push('/admin/products')}
                  className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Admin
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}