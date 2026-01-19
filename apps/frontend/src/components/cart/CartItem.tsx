'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart';
import { useCart } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock) return;
    
    setLoading(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeItem(item.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Product Image */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
        <Image
          src={item.product.image || '/images/placeholder.jpg'}
          alt={item.product.name}
          fill
          className="object-cover rounded-lg"
          sizes="96px"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{item.product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              ${item.price.toFixed(2)} each
            </p>
          </div>
          <button
            onClick={handleRemove}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || loading}
              className="p-2 hover:bg-gray-100 disabled:opacity-50"
            >
              <Minus size={16} />
            </button>
            <span className="px-4 py-2 text-center min-w-[40px]">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.product.stock || loading}
              className="p-2 hover:bg-gray-100 disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="font-bold text-lg">${subtotal.toFixed(2)}</p>
            {item.quantity > 1 && (
              <p className="text-sm text-gray-500">
                ${item.price.toFixed(2)} × {item.quantity}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}