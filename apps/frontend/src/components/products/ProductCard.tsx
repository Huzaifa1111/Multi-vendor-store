// apps/frontend/src/components/products/ProductCard.tsx - UPDATED
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { resolveProductImage } from '@/lib/image';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';




interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  category?: string;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

// Simple wishlist hook placeholder
const useWishlist = () => {
  return {
    isInWishlist: (product: Product) => false,
    toggleWishlist: (product: Product) => console.log('Toggle wishlist', product.id),
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const productImage = resolveProductImage(product.image);
  const isWishlisted = isInWishlist(product);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/products');
      return;
    }

    try {
      await addToCart(product.id, 1);
      // Optional: Show success toast/message
    } catch (error: any) {
      alert(error.message || 'Failed to add to cart');
    }
  };

  return (
    <div
      className={`group relative bg-white transition-all duration-500 font-jost rounded-2xl overflow-hidden animate-fade-in-up ${isHovered ? '-translate-y-3 shadow-2xl' : 'shadow-lg hover:shadow-xl'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl">
        <img
          src={productImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'
            }`}
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/600x600/000000/ffffff?text=No+Image';
          }}
        />
        
        {/* Overlay Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Quick Actions - Professional Side Position */}
        <div
          className={`absolute top-4 right-4 flex flex-col space-y-3 transition-all duration-500 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0'
            }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={isLoading || Number(product.stock) === 0}
            className="w-12 h-12 bg-white hover:bg-black hover:text-white rounded-full flex items-center justify-center text-gray-900 transition-all duration-300 shadow-xl border border-gray-100 group/btn disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900 hover:scale-110"
            title={Number(product.stock) === 0 ? "Out of Stock" : "Add to cart"}
          >
            <ShoppingBag size={20} className={`group-hover/btn:scale-110 transition-transform ${isLoading ? 'animate-pulse' : ''}`} />
          </button>
          <Link
            href={`/products/${product.id}`}
            className="w-12 h-12 bg-white hover:bg-black hover:text-white rounded-full flex items-center justify-center text-gray-900 transition-all duration-300 shadow-xl border border-gray-100 group/btn hover:scale-110"
          >
            <Eye size={20} className="group-hover/btn:scale-110 transition-transform" />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border border-gray-100 group/btn hover:scale-110 ${isWishlisted ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-900 hover:bg-red-600 hover:text-white hover:border-red-600'
              }`}
          >
            <Heart size={20} className={`group-hover/btn:scale-110 transition-transform ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-4 left-4 animate-fade-in-down animation-delay-200">
            <span className="inline-block bg-black/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg border border-white/20">
              {product.category}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute bottom-4 left-4 animate-fade-in-up animation-delay-300">
            <span className="inline-block bg-gradient-to-r from-gray-800 to-black text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
              ✨ Featured
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-[16px] font-bold text-gray-900 group-hover:text-black transition-colors duration-300 line-clamp-2 mb-3 min-h-[2.5rem]">
          <Link href={`/products/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        <div className="space-y-3">
          {/* Price Section */}
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl font-black text-black">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 line-through font-medium">
              ${(Number(product.price) * 1.2).toFixed(2)}
            </span>
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-center">
            {Number(product.stock) > 5 ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                In Stock
              </span>
            ) : Number(product.stock) > 0 ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
                Low Stock ({product.stock})
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {Number(product.stock) === 0 && (
          <div className="mt-2 text-red-500 font-bold text-sm uppercase tracking-wider">
            Out of Stock
          </div>
        )}

        {/* Dynamic Underline on Hover */}
        <div className="mt-4 flex justify-center">
          <div className={`h-0.5 bg-black transition-all duration-500 rounded-full ${isHovered ? 'w-12' : 'w-0'}`}></div>
        </div>
      </div>
    </div>
  );
}