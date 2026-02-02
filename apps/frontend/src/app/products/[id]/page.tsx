// apps/frontend/src/app/products/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import productService, { Product } from '@/services/product.service';
import { ArrowLeft, Package, Star, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/lib/auth';
import ReviewForm from '@/components/products/ReviewForm';
import ReviewList from '@/components/products/ReviewList';
import ProductDetail from '@/components/products/ProductDetail';
import ProductCard from '@/components/products/ProductCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import api from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        console.log('Fetched Product:', data);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Authenticating Product Dossier</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center font-plus-jakarta-sans bg-white">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-100 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Selection Missing</h1>
          <button onClick={() => router.push('/products')} className="px-8 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all">
            Return to Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden font-plus-jakarta-sans text-black pb-32">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-40 pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-16 relative z-10">
        <Breadcrumbs customLabels={{ [id.toString()]: product.name }} />

        <button
          onClick={() => router.back()}
          className="group flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-emerald-600 mb-8 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
          The Collection
        </button>

        <ProductDetail product={product as any} />

        {/* Upsells Section */}
        {product.upsells && product.upsells.length > 0 && (
          <div className="mt-32 space-y-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Elevate Experience</span>
              </div>
              <h2 className="text-4xl font-black tracking-tight text-gray-900">You May Also Like</h2>
              <p className="text-gray-500 max-w-xl font-medium">Strategic additions curated to complement your primary selection.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {product.upsells.map((upsell) => (
                <ProductCard key={upsell.id} product={upsell as any} />
              ))}
            </div>
          </div>
        )}

        {/* Cross-sells Section */}
        {product.crossSells && product.crossSells.length > 0 && (
          <div className="mt-32 space-y-12 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-gray-50">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-50 pb-10">
              <div className="space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Frequently Synergized</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight text-gray-900">Bought Together</h2>
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-2">Curated Systems</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {product.crossSells.map((crossSell) => (
                <ProductCard key={crossSell.id} product={crossSell as any} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-32 border-t border-gray-100 pt-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10">
            <div className="relative">
              <span className="absolute -top-10 left-0 text-[10px] font-black uppercase tracking-[0.6em] text-emerald-600/40">User Testimony</span>
              <div className="flex items-end gap-3">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black leading-tight">
                  Public<br />
                  <span className="font-light text-emerald-500 italic">Consensus</span>
                </h2>
                <div className="w-12 h-1 bg-emerald-500 mb-3.5 hidden md:block rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8">
              {reviewsLoading ? (
                <div className="flex justify-center py-20 bg-gray-50/50 rounded-3xl animate-pulse">
                  <Loader2 className="animate-spin text-emerald-600" size={32} />
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-24 text-center bg-gray-50/30 rounded-[3rem] border-2 border-dashed border-gray-100">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Testimony Archive Empty</span>
                </div>
              ) : (
                <ReviewList reviews={reviews} />
              )}
            </div>

            <div className="lg:col-span-4">
              {isAuthenticated ? (
                <div className="sticky top-8 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-100">
                  <ReviewForm productId={id} onSuccess={fetchReviews} />
                </div>
              ) : (
                <div className="sticky top-8 p-12 text-center bg-gray-900 text-white rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                  <Star className="w-10 h-10 text-emerald-500 mx-auto mb-8 opacity-50" />
                  <h3 className="text-xl font-black mb-4 uppercase tracking-[0.2em]">Join Consensus</h3>
                  <p className="text-white/40 text-[10px] mb-10 font-bold uppercase tracking-widest leading-loose">Verify your acquisition to contribute premium testimony.</p>
                  <button
                    onClick={() => router.push(`/auth/login?redirect=/products/${id}`)}
                    className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                  >
                    Authenticate
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
