'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { resolveProductImage } from '@/lib/image';
import { ShoppingBag, Eye, Heart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const productImage = resolveProductImage(product.image);

  return (
    <div
      className={`group relative bg-white transition-all duration-700 font-jost rounded-3xl ${isHovered ? '-translate-y-2 shadow-2xl' : 'shadow-sm'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-2xl">
        <Image
          src={productImage}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'
            }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Quick Actions - Professional Side Position */}
        <div
          className={`absolute top-4 right-4 flex flex-col space-y-3 transition-all duration-500 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            }`}
        >
          <button className="w-11 h-11 bg-white hover:bg-black hover:text-white rounded-full flex items-center justify-center text-black transition-all duration-300 shadow-xl border border-gray-100 group/btn">
            <ShoppingBag size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button className="w-11 h-11 bg-white hover:bg-black hover:text-white rounded-full flex items-center justify-center text-black transition-all duration-300 shadow-xl border border-gray-100 group/btn">
            <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button className="w-11 h-11 bg-white hover:bg-black hover:text-white rounded-full flex items-center justify-center text-black transition-all duration-300 shadow-xl border border-gray-100 group/btn">
            <Heart size={18} className="group-hover/btn:scale-110 transition-transform" />
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

        {/* Dynamic Underline on Hover */}
        <div className="mt-4 flex justify-center">
          <div className={`h-0.5 bg-black transition-all duration-500 rounded-full ${isHovered ? 'w-12' : 'w-0'}`}></div>
        </div>
      </div>
    </div>
  );
}