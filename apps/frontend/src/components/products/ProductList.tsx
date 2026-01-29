// apps/frontend/src/components/products/ProductList.tsx
'use client';

import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { Package } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function ProductList({
  products,
  loading = false,
  emptyMessage = 'No products found'
}: ProductListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[10/13] bg-gradient-to-br from-gray-50 to-emerald-50/20 rounded-xl mb-4 shadow-inner border border-gray-100"></div>
            <div className="h-4 bg-gray-50 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-50 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-32 px-6 font-plus-jakarta-sans">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 rounded-full mb-8 relative">
          <Package className="w-10 h-10 text-emerald-200" strokeWidth={1} />
          <div className="absolute inset-0 border border-emerald-100/50 rounded-full animate-ping scale-110 opacity-20"></div>
        </div>
        <h3 className="text-xl font-black text-black uppercase tracking-widest mb-4">{emptyMessage}</h3>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] max-w-sm mx-auto">Our archive is currently undergoing maintenance or your criteria yielded zero archetypes.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
      {products.map((product, index) => (
        <div key={product.id} style={{ animationDelay: `${index * 50}ms` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}