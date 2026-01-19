'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/lib/auth';
import { ShoppingBag, CreditCard, Truck } from 'lucide-react';

interface CartSummaryProps {
  onCheckout?: () => void;
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { items, total, clearCart, isLoading } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/cart');
      return;
    }

    setCheckoutLoading(true);
    try {
      if (onCheckout) {
        await onCheckout();
      } else {
        router.push('/checkout');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-6">Add some products to get started!</p>
        <button
          onClick={() => router.push('/products')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">Free</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">${(total * 0.1).toFixed(2)}</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-xl font-bold">${(total * 1.1).toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Including VAT</p>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-600">Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-600">Secure payment processing</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={isLoading || checkoutLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
        >
          {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
        <button
          onClick={handleClearCart}
          disabled={isLoading}
          className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Clear Cart
        </button>
        <button
          onClick={() => router.push('/products')}
          className="w-full py-3 text-blue-600 hover:text-blue-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}