// apps/frontend/src/components/cart/CartItem.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const { updateQuantity, removeItem, isLoading } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > (item.product?.stock || 99)) {
      alert(`Only ${item.product?.stock || 99} items in stock`);
      return;
    }

    setQuantity(newQuantity);
    await updateQuantity(item.id, newQuantity);
  };

  const handleRemove = async () => {
    if (confirm('Remove this item from cart?')) {
      await removeItem(item.id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center space-x-6">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {item.product?.image ? (
          <Image
            src={item.product.image}
            alt={item.product.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {item.product?.name || `Product #${item.productId}`}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {item.product?.description}
        </p>
        <div className="text-lg font-bold text-gray-900">
          ${(Number(item.price) * item.quantity).toFixed(2)}
        </div>
        <div className="text-sm text-gray-500">
          ${Number(item.price).toFixed(2)} × {item.quantity}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isLoading || quantity <= 1}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          <span className="px-4 py-2 text-center min-w-[40px]">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isLoading || quantity >= (item.product?.stock || 99)}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isLoading}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Remove item"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}