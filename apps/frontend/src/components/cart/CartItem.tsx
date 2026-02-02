// apps/frontend/src/components/cart/CartItem.tsx
'use client';

import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { resolveProductImage } from '@/lib/image';

interface CartItemProps {
  item: any;
}

export default function CartItem({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const { updateQuantity, removeItem, isLoading } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    await updateQuantity(item.id, newQuantity);
  };

  const handleRemove = async () => {
    if (confirm('Remove this item from cart?')) {
      await removeItem(item.id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-all">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
        <img
          src={resolveProductImage(item.product?.images || item.product?.image)}
          alt={item.product?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-lg font-black text-gray-900 mb-1">
          {item.product?.name || `Product #${item.productId}`}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-1 font-medium">
          {item.product?.description}
        </p>
        <div className="flex items-center justify-center sm:justify-start gap-4">
          <div className="text-xl font-black text-gray-900">
            ${(Number(item.price) * item.quantity).toFixed(2)}
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
            ${Number(item.price).toFixed(2)} / ea
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-gray-50 p-1.5 rounded-xl border border-gray-100">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isLoading || quantity <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all disabled:opacity-20"
          >
            <Minus size={14} strokeWidth={3} />
          </button>
          <span className="w-10 text-center font-black text-gray-900 text-sm">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all disabled:opacity-20"
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>

        <button
          onClick={handleRemove}
          disabled={isLoading}
          className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}