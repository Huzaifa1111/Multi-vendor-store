// apps/frontend/src/app/cart/page.tsx - UPDATED
'use client';

import { useEffect } from 'react';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useCart } from '@/hooks/useCart';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { items, isLoading, fetchCart } = useCart();

  // Refresh cart on page load
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 text-lg">
            {items.length === 0 
              ? 'Your cart is empty' 
              : `You have ${items.reduce((sum, item) => sum + item.quantity, 0)} item${items.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''} in your cart`
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center shadow-sm">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Looks like you haven't added any products to your cart yet. Start shopping to find amazing products!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/products">
                    <Button className="px-8 py-3">
                      Browse Products
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="px-8 py-3">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary - Only show if cart has items */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          )}
        </div>

        {/* Features Section */}
        {items.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">Free Shipping</div>
              <p className="text-gray-600 text-sm">On orders over $50</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">Easy Returns</div>
              <p className="text-gray-600 text-sm">30-day return policy</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">Secure Payment</div>
              <p className="text-gray-600 text-sm">100% secure checkout</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}