// apps/frontend/src/components/cart/CartSummary.tsx
'use client';

import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { CreditCard, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CartSummary() {
  const { items, total, clearCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const shipping = 5.99; // Flat rate shipping
  const tax = total * 0.1; // 10% tax
  const grandTotal = total + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/cart');
      return;
    }

    // Redirect to checkout
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Summary Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${Number(total).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (10%)</span>
          <span className="font-medium">${Number(tax).toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${Number(grandTotal).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={handleCheckout}
        disabled={isLoading || items.length === 0}
        className="w-full mb-4 py-3 flex items-center justify-center"
      >
        <CreditCard size={20} className="mr-2" />
        Proceed to Checkout
      </Button>

      {/* Continue Shopping Button */}
      <Button
        variant="outline"
        onClick={handleContinueShopping}
        className="w-full mb-4 py-3"
      >
        Continue Shopping
      </Button>

      {/* Clear Cart Button */}
      <button
        onClick={() => {
          if (confirm('Are you sure you want to clear your cart?')) {
            clearCart();
          }
        }}
        disabled={isLoading || items.length === 0}
        className="w-full text-center text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
      >
        Clear Cart
      </button>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <ShoppingBag size={16} className="mr-2" />
          <span>Free returns within 30 days</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Prices and shipping calculated at checkout
        </p>
      </div>
    </div>
  );
}