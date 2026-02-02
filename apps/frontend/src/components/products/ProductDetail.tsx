// apps/frontend/src/components/products/ProductDetail.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, Star, Layers, Truck, ShieldCheck, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { resolveProductImage } from '@/lib/image';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/lib/auth';

interface Variation {
  id: number;
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  stock: number;
  image: string | null;
  images?: string[];
  category?: string;
  brand?: { name: string };
  variations?: Variation[];
  createdAt: string;
}

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart, isLoading: cartLoading } = useCart();

  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Variation state
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const formatPrice = (price: number): string => {
    return `$${Number(price).toFixed(2)}`;
  };

  // Extract unique colors and sizes
  const colors = Array.from(new Set(product.variations?.map(v => v.color).filter(Boolean)));
  const sizes = Array.from(new Set(product.variations?.map(v => v.size).filter(Boolean)));

  // Find matching variation
  const selectedVariation = product.variations?.find(v =>
    (!selectedColor || v.color === selectedColor) &&
    (!selectedSize || v.size === selectedSize)
  );

  const currentPrice = selectedVariation ? selectedVariation.price : product.price;
  const currentStock = selectedVariation ? selectedVariation.stock : product.stock;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/products/${product.id}`);
      return;
    }

    if (colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity, selectedVariation?.id);
      alert('Added to cart!');
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const allImages = product.images && product.images.length > 0
    ? product.images
    : [product.image || ''];

  return (
    <div className="space-y-8 pb-12">
      <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-6">
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group">
                <img
                  src={resolveProductImage(allImages[selectedImage])}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
              </div>

              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-blue-500 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img src={resolveProductImage(img)} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {product.category || 'Uncategorized'}
                  </span>
                  {product.brand && (
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                      {product.brand.name}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-6">
                  <div className="text-4xl font-black text-blue-600 tracking-tighter">
                    {formatPrice(currentPrice)}
                  </div>
                  <div className="h-10 w-[1px] bg-gray-100"></div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className="fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-400 font-bold text-sm tracking-tight opacity-70">Expert Choice (4.8)</span>
                  </div>
                </div>
              </div>

              {/* Variations */}
              <div className="space-y-6 pt-4 border-t border-gray-50">
                {colors.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Finish</label>
                    <div className="flex flex-wrap gap-3">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-5 py-2.5 rounded-xl border-2 font-bold text-sm transition-all flex items-center gap-2 ${selectedColor === color
                              ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md transform scale-105'
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
                            }`}
                        >
                          {selectedColor === color && <Check size={14} />}
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {sizes.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Scale</label>
                    <div className="flex flex-wrap gap-3">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 rounded-xl border-2 font-black text-xs transition-all flex items-center justify-center ${selectedSize === size
                              ? 'border-black bg-black text-white shadow-lg transform translate-y-[-2px]'
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-gray-600 leading-relaxed font-medium text-sm">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center bg-gray-100 rounded-2xl p-2 px-4 gap-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-xl font-black text-gray-400 hover:text-black transition-colors">-</button>
                  <span className="w-8 text-center font-black">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-xl font-black text-gray-400 hover:text-black transition-colors">+</button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0 || addingToCart}
                  className="flex-3 flex items-center justify-center px-10 py-5 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  {addingToCart ? 'Syncing...' : 'Acquire Policy'}
                </button>

                <button
                  onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                  className="flex-1 px-8 py-5 border-2 border-gray-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all text-gray-700"
                >
                  Refine
                </button>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-5 bg-blue-50/30 rounded-2xl border border-blue-50">
                  <Truck className="text-blue-500" size={24} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-900">White Glove</p>
                    <p className="text-[10px] text-blue-600 font-bold opacity-70">Global Logistics</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-emerald-50/30 rounded-2xl border border-emerald-50">
                  <ShieldCheck className="text-emerald-500" size={24} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900">Assurance</p>
                    <p className="text-[10px] text-emerald-600 font-bold opacity-70">Lifetime Seal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-sm p-8 md:p-12 bg-white">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3 tracking-tighter">
              <Package className="text-indigo-600" /> Executive Summary
            </h2>
            <div className="prose prose-blue max-w-none text-gray-600 font-medium leading-[1.8] text-lg">
              {product.longDescription || "No detailed dossier available for this selection."}
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3 tracking-tighter relative z-10">
              <Layers className="text-orange-600" /> Specifications
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center py-4 border-b border-gray-50">
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Product Code</span>
                <span className="text-xs font-black text-gray-900">{selectedVariation?.sku || `PRO-${product.id}`}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-50">
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Supply Status</span>
                <span className={`text-xs font-black uppercase tracking-widest ${currentStock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {currentStock > 0 ? `Available (${currentStock})` : 'Exhausted'}
                </span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Released</span>
                <span className="text-xs font-black text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}