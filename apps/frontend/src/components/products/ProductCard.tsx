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
      className={`group relative bg-white transition-all duration-700 font-jost rounded-3xl ${isHovered ? '-translate-y-2 shadow-2xl' : 'shadow-sm'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-2xl">
        <img
          src={productImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'
            }`}
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/600x600/3b82f6/ffffff?text=No+Image';
          }}
        />

        {/* Quick Actions - Professional Side Position */}
        <div
          className={`absolute top-4 right-4 flex flex-col space-y-3 transition-all duration-500 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={isLoading || Number(product.stock) === 0}
            className="w-11 h-11 bg-white hover:bg-black hover:text-white rounded-full flex items-center justify-center text-black transition-all duration-300 shadow-xl border border-gray-100 group/btn disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
            title={Number(product.stock) === 0 ? "Out of Stock" : "Add to cart"}
          >
            <ShoppingBag size={18} className={`group-hover/btn:scale-110 transition-transform ${isLoading ? 'animate-pulse' : ''}`} />
          </button>
          <Link
            href={`/products/${product.id}`}
            className="w-11 h-11 bg-white hover:bg-black hover:text-white rounded-full flex items-center justify-center text-black transition-all duration-300 shadow-xl border border-gray-100 group/btn"
          >
            <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border border-gray-100 group/btn ${isWishlisted ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
          >
            <Heart size={18} className={`group-hover/btn:scale-110 transition-transform ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
              {product.category}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-6 text-center">
        <h3 className="text-[17px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 truncate px-2">
          <Link href={`/products/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 flex items-center justify-center space-x-2">
          <span className="text-[18px] font-black text-black">
            ${Number(product.price).toFixed(2)}
          </span>
          {/* Optional: Add a crossed-out old price for premium look */}
          <span className="text-sm text-gray-400 line-through font-medium">
            ${(Number(product.price) * 1.2).toFixed(2)}
          </span>
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