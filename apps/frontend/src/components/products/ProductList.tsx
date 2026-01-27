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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl mb-4"></div>
            <div className="h-5 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl mb-4">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600 max-w-sm mx-auto">Try adjusting your filters, search terms, or check back later for new items</p>
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