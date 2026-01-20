// apps/frontend/src/app/products/[id]/page.tsx - FIXED VERSION
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import productService from '@/services/product.service';
import { ArrowLeft, Package, ShoppingCart, Star, Shield, Truck, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  category?: string;
  featured?: boolean;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { isAuthenticated } = useAuth();
  const { addToCart, isLoading } = useCart();

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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/products/${id}`);
      return;
    }

    if (!product) return;

    try {
      await addToCart(product.id, quantity);
      alert('Added to cart successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to add to cart');
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
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
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </button>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
            {/* Product Image */}
            <div className="relative">
              <div className="bg-gray-50 rounded-2xl p-4">
                {product.image ? (
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
                    <Package className="w-32 h-32 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Image Badges */}
              {product.featured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                    Featured Product
                  </span>
                </div>
              )}

              {Number(product.stock) < 5 && Number(product.stock) > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="bg-orange-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                    Only {product.stock} left!
                  </span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                {product.category && (
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full inline-block mb-4">
                    {product.category}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(4.5) 24 reviews</span>
              </div>

              <div className="text-4xl font-bold text-gray-900 mb-8">
                ${Number(product.price).toFixed(2)}
              </div>

              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              </div>

              {/* Product Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Availability</p>
                    <p className={`font-medium ${Number(product.stock) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(product.stock) > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <RefreshCw className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">SKU</p>
                    <p className="font-medium">#{product.id.toString().padStart(6, '0')}</p>
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-gray-700 mr-4 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1 || Number(product.stock) === 0}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 text-center min-w-[60px] font-medium">
                      {Number(product.stock) === 0 ? 0 : quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={Number(product.stock) === 0 || quantity >= Number(product.stock)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-4 text-sm text-gray-600">
                    {product.stock === 0 ? 'Out of Stock' : `${product.stock} available`}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={Number(product.stock) === 0 || isLoading}
                    className="flex-1 py-4 text-lg flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    {isLoading ? 'Adding...' : 'Add to Cart'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => router.push('/products')}
                    className="py-4"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Product Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Free Shipping</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="text-gray-700">2-Year Warranty</span>
                  </div>
                  <div className="flex items-center">
                    <RefreshCw className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-700">30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}