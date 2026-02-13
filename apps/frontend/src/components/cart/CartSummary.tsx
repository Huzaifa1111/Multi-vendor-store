// apps/frontend/src/components/cart/CartSummary.tsx
'use client';

import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { CreditCard, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
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
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] sticky top-8 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <h2 className="text-2xl font-black text-gray-900 mb-8 relative z-10">Order Summary</h2>

      {/* Summary Details */}
      <div className="space-y-4 mb-8 relative z-10">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Subtotal</span>
          <span className="font-bold text-gray-900">${Number(total).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Shipping</span>
          <span className="font-bold text-gray-900">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Tax (10%)</span>
          <span className="font-bold text-gray-900">${Number(tax).toFixed(2)}</span>
        </div>

        <div className="border-t border-dashed border-gray-200 my-4" />

        <div className="flex justify-between items-end">
          <span className="text-base font-bold text-gray-900">Total</span>
          <div className="text-right">
            <span className="text-3xl font-black text-gray-900 block leading-none">
              ${Number(grandTotal).toFixed(2)}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">USD</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isLoading || items.length === 0}
        className="w-full mb-3 py-4 px-6 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-900 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/10 z-10 relative"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight size={16} />
      </button>

      {/* Continue Shopping Button */}
      <button
        onClick={handleContinueShopping}
        className="w-full mb-6 py-4 px-6 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-bold uppercase tracking-widest text-xs hover:border-black hover:text-black transition-all z-10 relative"
      >
        Continue Shopping
      </button>

      {/* Features */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-50 p-3 rounded-xl flex flex-col items-center text-center gap-1">
          <ShieldCheck size={18} className="text-emerald-600 mb-1" />
          <span className="text-[10px] font-bold text-gray-900 uppercase">Secure</span>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl flex flex-col items-center text-center gap-1">
          <Truck size={18} className="text-blue-600 mb-1" />
          <span className="text-[10px] font-bold text-gray-900 uppercase">Express</span>
        </div>
      </div>

      {/* Clear Cart Button */}
      <button
        onClick={() => {
          if (confirm('Are you sure you want to clear your cart?')) {
            clearCart();
          }
        }}
        disabled={isLoading || items.length === 0}
        className="w-full text-center text-gray-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors z-10 relative"
      >
        Clear Cart
      </button>
    </div>
  );
}