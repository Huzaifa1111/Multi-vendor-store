// apps/frontend/src/components/products/ProductDetail.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, Star, Layers, Truck, ShieldCheck, Check, Heart, Share2, Info, Plus, Minus } from 'lucide-react';
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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isShortDescOpen, setIsShortDescOpen] = useState(true);

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

  const descriptionPoints = product.description.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="space-y-8 md:space-y-12 pb-12 md:pb-24 font-plus-jakarta-sans text-gray-900 animate-fade-in-up">
      <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-white/70 backdrop-blur-xl border border-white/20">
        <CardContent className="p-6 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 xl:gap-20">
            {/* Image Gallery */}
            <div className="space-y-8">
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50/50 border border-gray-100 shadow-inner group">
                <img
                  src={resolveProductImage(allImages[selectedImage])}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110"
                />
                <div className="absolute top-6 right-6 flex flex-col gap-3">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-lg border border-white/30 ${isWishlisted ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/80 text-gray-900 hover:text-rose-500'}`}
                  >
                    <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                  </button>
                  <button className="w-12 h-12 bg-white/80 backdrop-blur-md hover:bg-emerald-600 hover:text-white rounded-full flex items-center justify-center text-gray-900 transition-all duration-300 shadow-lg border border-white/30">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-500 flex-shrink-0 snap-center ${selectedImage === idx
                        ? 'border-emerald-600 scale-95 shadow-lg'
                        : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                        }`}
                    >
                      <img src={resolveProductImage(img)} className="w-full h-full object-cover" alt="" />
                      {selectedImage === idx && (
                        <div className="absolute inset-0 bg-emerald-600/10 flex items-center justify-center">
                          <Check size={16} className="text-emerald-600 shadow-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-5 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-100/30">
                      {product.category || 'Premium Series'}
                    </span>
                    {product.brand && (
                      <span className="px-5 py-2 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-gray-100">
                        {product.brand.name}
                      </span>
                    )}
                  </div>
                  <div className="text-3xl font-black text-emerald-600 tracking-tighter flex items-start gap-1">
                    <span className="text-lg mt-1 opacity-70 font-bold">$</span>
                    {Number(currentPrice).toFixed(2).split('.')[0]}
                    <span className="text-lg mt-1 opacity-70 font-bold">.{Number(currentPrice).toFixed(2).split('.')[1]}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.2]">
                  {product.name}
                </h1>

                <p className="text-[11px] font-black text-emerald-900/40 uppercase tracking-[0.3em]">
                  SKU : {selectedVariation?.sku || `KOT-SG-${product.id}`}
                </p>
              </div>

              {/* Variations */}
              <div className="space-y-6 md:space-y-8 pt-2 md:pt-4">
                {/* Collapsible Short Description */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                  <button
                    onClick={() => setIsShortDescOpen(!isShortDescOpen)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left bg-gradient-to-r from-[#0a2e2e] to-[#041a1a] text-white transition-all hover:to-[#062626]"
                  >
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Short Description</span>
                    {isShortDescOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                  <div className={`transition-all duration-300 ease-in-out ${isShortDescOpen ? 'max-h-[500px] opacity-100 p-6' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <ul className="space-y-3">
                      {descriptionPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600 font-medium text-sm md:text-base">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                          {point.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {colors.length > 0 && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-900">Colors</label>
                    <div className="flex flex-wrap gap-4">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color as string)}
                          className={`group relative w-12 h-12 rounded-full border-2 transition-all duration-300 p-1 ${selectedColor === color
                            ? 'border-emerald-600 scale-110 shadow-lg shadow-emerald-100'
                            : 'border-transparent hover:border-gray-200'
                            }`}
                          title={color as string}
                        >
                          <div
                            className="w-full h-full rounded-full shadow-inner border border-black/5"
                            style={{ backgroundColor: (color as string).toLowerCase() }}
                          />
                          {selectedColor === color && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full border-2 border-white flex items-center justify-center">
                              <Check size={10} className="text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {sizes.length > 0 && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-900">Scale Dynamics</label>
                    <div className="flex flex-wrap gap-3">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size as string)}
                          className={`w-14 h-14 rounded-2xl border-2 font-black text-xs transition-all duration-300 flex items-center justify-center ${selectedSize === size
                            ? 'border-black bg-black text-white shadow-xl shadow-black/20 translate-y-[-4px]'
                            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                            }`}
                        >
                          {size as string}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-center gap-4 p-4 md:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <Truck className="text-emerald-500 flex-shrink-0" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">White Glove Shipping</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 md:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <ShieldCheck className="text-emerald-500 flex-shrink-0" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">Authentic Seal</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-50">
                  <div className="flex items-center bg-gray-50 rounded-2xl p-2 px-5 gap-6 border border-gray-100 self-start sm:self-auto shadow-inner h-[60px]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-xl font-black text-gray-400 hover:text-emerald-600 transition-colors"
                    >-</button>
                    <span className="w-6 text-center font-black text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-xl font-black text-gray-400 hover:text-emerald-600 transition-colors"
                    >+</button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={currentStock === 0 || addingToCart}
                    className="flex-grow h-[60px] flex items-center justify-center px-8 md:px-12 py-4 md:py-5 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 active:scale-95 group overflow-hidden relative"
                  >
                    <div className="relative flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-4 animate-bounce-slow" />
                      {addingToCart ? 'Authenticating...' : 'Acquire Policy'}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
