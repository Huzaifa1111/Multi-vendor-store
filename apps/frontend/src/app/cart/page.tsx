// apps/frontend/src/app/cart/page.tsx
'use client';

import { useEffect } from 'react';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useCart } from '@/hooks/useCart';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, isLoading, fetchCart } = useCart();

  // Refresh cart on page load
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-jost relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10" />

      <div className="container mx-auto px-4 max-w-7xl pt-12 pb-24">
        {/* Cinematic Header */}
        <div className="mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center gap-6"
          >
            <div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="w-8 h-[2px] bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">Your Selection</span>
                <span className="w-8 h-[2px] bg-emerald-500" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
                Shopping <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-black">Cart</span>
              </h1>
            </div>

            {items.length > 0 && (
              <div className="text-center">
                <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">Total Items</p>
                <p className="text-4xl font-black text-gray-900">
                  {items.reduce((sum, item) => sum + item.quantity, 0).toString().padStart(2, '0')}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
          {/* Cart Items */}
          <div className={`${items.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12 max-w-3xl mx-auto w-full'}`}>
            <AnimatePresence mode='wait'>
              {items.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/80 backdrop-blur-xl p-16 rounded-[2.5rem] border border-gray-100 text-center shadow-xl"
                >
                  <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse">
                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your cart is empty</h3>
                  <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium leadning-relaxed">
                    It looks like you haven't made any choices yet. Explore our collection to find something extraordinary.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/products">
                      <button className="px-10 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-800 hover:scale-105 transition-all shadow-lg shadow-black/20">
                        Explore Collection
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary - Only show if cart has items */}
          <div className="lg:col-span-4">
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.3 }}
                >
                  <CartSummary />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}