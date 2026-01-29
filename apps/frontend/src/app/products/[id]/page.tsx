// apps/frontend/src/app/products/[id]/page.tsx - FIXED VERSION
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import productService from '@/services/product.service';
import { ArrowLeft, Package, ShoppingCart, Star, Shield, Truck, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import ReviewForm from '@/components/products/ReviewForm';
import ReviewList from '@/components/products/ReviewList';
import api from '@/lib/api';

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
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

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
      fetchReviews();
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await api.get(`/reviews/product/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

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
    <div className="min-h-screen bg-white relative overflow-hidden font-plus-jakarta-sans text-black">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-20 relative z-10">
        {/* Breadcrumb Navigation */}
        <button
          onClick={() => router.back()}
          className="group flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-emerald-600 mb-12 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
          The Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-32">

          {/* Visual Presentation Column (Smaller Stage) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="relative group">
              {/* Product Image Stage */}
              <div className="relative aspect-[10/13] overflow-hidden rounded-xl bg-gray-50 shadow-inner border border-gray-100">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Package className="w-24 h-24 text-gray-300" />
                  </div>
                )}

                {/* Floating Labels */}
                <div className="absolute top-6 left-6 flex flex-col gap-3">
                  {product.featured && (
                    <span className="bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded shadow-2xl">
                      Exclusive Piece
                    </span>
                  )}
                  {product.category && (
                    <span className="bg-black/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded shadow-2xl border border-white/10">
                      {product.category}
                    </span>
                  )}
                </div>

                {Number(product.stock) < 5 && Number(product.stock) > 0 && (
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-amber-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded shadow-2xl">
                      Strictly Limited Edition
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Dossier Column (Larger Content Area) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col pt-4">

            {/* Header Information */}
            <div className="mb-10 lg:mb-14">
              <div className="flex items-center gap-6 mb-8 text-[11px] font-black uppercase tracking-[0.4em] text-emerald-600/60">
                <span>Ref. #{product.id.toString().padStart(6, '0')}</span>
                <span className="w-8 h-px bg-gray-200" />
                <span>Horological Standard</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1] mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-black">
                  {product.name}
                </span>
              </h1>

              <div className="flex items-center gap-8 border-b border-gray-100 pb-10">
                <div className="flex items-center gap-2">
                  <div className="flex text-emerald-500">
                    {[...Array(5)].map((_, i) => {
                      const avg = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
                      return <Star key={i} size={14} className={i < Math.round(avg) ? 'fill-current' : 'text-gray-200'} />;
                    })}
                  </div>
                  <span className="text-[12px] font-bold text-gray-500">
                    ({reviews.length})
                  </span>
                </div>

                <div className="text-3xl font-black text-black tracking-tighter">
                  ${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Description Narrative - Expandable */}
            <div className="mb-14 group/desc">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6 block">The Narrative</span>
              <div className="relative">
                <p className={`text-gray-500 text-lg leading-relaxed font-medium max-w-2xl transition-all duration-700 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                  {product.description}
                </p>

                {product.description.length > 250 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-emerald-700 transition-all group/btn"
                  >
                    <span className="w-6 h-[1px] bg-emerald-200 group-hover/btn:w-10 transition-all"></span>
                    {isExpanded ? 'Collapse Narrative' : 'Read Full Narrative'}
                  </button>
                )}
              </div>
            </div>

            {/* Acquisition Controls */}
            <div className="mb-14 p-8 bg-gray-50/50 rounded-xl border border-gray-100 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-10">

                {/* Quantity Control */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Order Quantity</span>
                  <div className="flex items-center bg-white border border-emerald-100 rounded-full h-14 p-1 shadow-sm">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1 || Number(product.stock) === 0}
                      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-black text-sm text-emerald-950">
                      {Number(product.stock) === 0 ? 0 : quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={Number(product.stock) === 0 || quantity >= Number(product.stock)}
                      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Action */}
                <div className="flex-1 w-full">
                  <button
                    onClick={handleAddToCart}
                    disabled={Number(product.stock) === 0 || isLoading}
                    className="w-full h-14 bg-emerald-600 text-white rounded-full font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center hover:bg-emerald-700 transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(5,150,105,0.4)] active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : Number(product.stock) === 0 ? (
                      'Sold Out'
                    ) : (
                      <>
                        Acquire Selection <ShoppingCart className="w-4 h-4 ml-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Supply Meta */}
              <div className="mt-6 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${Number(product.stock) > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {Number(product.stock) === 0 ? 'Archive Item' : `Limited Stock Status: Reserved Availability`}
                </span>
              </div>
            </div>

            {/* Service & Excellence Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-gray-100">
              <div className="flex flex-col items-start text-left">
                <Truck className="w-5 h-5 text-emerald-600 mb-4" strokeWidth={1} />
                <span className="text-[10px] font-black uppercase tracking-widest mb-1 text-black">Express Logistic</span>
                <span className="text-[10px] text-gray-400 font-medium">Complimentary Global Delivery</span>
              </div>
              <div className="flex flex-col items-start text-left">
                <Shield className="w-5 h-5 text-emerald-600 mb-4" strokeWidth={1} />
                <span className="text-[10px] font-black uppercase tracking-widest mb-1 text-black">Master Warranty</span>
                <span className="text-[10px] text-gray-400 font-medium">24-Month Quality Seal</span>
              </div>
              <div className="flex flex-col items-start text-left">
                <RefreshCw className="w-5 h-5 text-emerald-600 mb-4" strokeWidth={1} />
                <span className="text-[10px] font-black uppercase tracking-widest mb-1 text-black">Boutique Return</span>
                <span className="text-[10px] text-gray-400 font-medium">30-Day Exchange Service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - Editorial Layout */}
        <div className="mt-32 border-t border-gray-50 pt-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10">
            <div className="relative">
              <span className="absolute -top-10 left-0 text-[10px] font-black uppercase tracking-[0.6em] text-emerald-600/40">User Testimony</span>
              <div className="flex items-end gap-3">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black leading-tight">
                  Customer<br />
                  <span className="font-light text-emerald-500">Impressions</span>
                </h2>
                <div className="w-12 h-0.5 bg-emerald-500 mb-2.5 hidden md:block"></div>
              </div>
            </div>

            <div className="max-w-md md:text-right">
              <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed mb-6 md:ml-auto">
                Discover firsthand experiences from our discerning community of collectors and watch enthusiasts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8">
              {reviewsLoading ? (
                <div className="flex justify-center py-20 bg-gray-50/50 rounded-xl">
                  <Loader2 className="animate-spin text-emerald-600" size={32} />
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-20 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200 font-medium text-gray-400 text-sm">
                  First impressions are yet to be chronicled.
                </div>
              ) : (
                <ReviewList reviews={reviews} />
              )}
            </div>

            <div className="lg:col-span-4">
              {isAuthenticated ? (
                <div className="sticky top-8 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                  <ReviewForm productId={id} onSuccess={fetchReviews} />
                </div>
              ) : (
                <div className="sticky top-8 p-10 text-center bg-gray-50/80 backdrop-blur-sm rounded-xl border border-dashed border-gray-200">
                  <Star className="w-10 h-10 text-emerald-600/20 mx-auto mb-6" />
                  <h3 className="text-lg font-black text-black mb-4 uppercase tracking-widest">Contribute Testimony</h3>
                  <p className="text-gray-400 text-xs mb-8 font-medium leading-relaxed uppercase tracking-widest leading-loose">Authentic participation requires professional verification.</p>
                  <button
                    onClick={() => router.push(`/auth/login?redirect=/products/${id}`)}
                    className="w-full h-12 bg-black text-white rounded-full font-black uppercase tracking-widest text-[9px] hover:bg-emerald-600 transition-all"
                  >
                    Authenticate Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
