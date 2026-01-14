'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface ProductDetailProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | null;
    category?: string;
    createdAt: string;
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState(false);

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
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

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {product.category || 'Uncategorized'}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-gray-600 text-sm">(4.5) 24 reviews</span>
            </div>

            <div className="text-2xl font-bold text-gray-900 mb-4">
              {formatPrice(product.price)}
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-gray-700 mr-4">Availability:</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              
              <button
                onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}