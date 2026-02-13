import { useState } from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { resolveProductImage } from '@/lib/image';
import { motion } from 'framer-motion';

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
    // Elegant removal without confirm dialog for smoother UX, or keeping it but styled?
    // Let's keep it simple for now, but maybe add a small undo toast later (out of scope).
    if (confirm('Remove this item -> ' + item.product?.name + '?')) {
      await removeItem(item.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group relative bg-white p-4 sm:p-6 rounded-[2.5rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:border-emerald-100 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6 sm:gap-8"
    >
      <button
        onClick={handleRemove}
        disabled={isLoading}
        className="absolute top-4 right-4 sm:hidden p-2 text-gray-300 hover:text-red-500 transition-colors"
      >
        <X size={18} />
      </button>

      {/* Product Image */}
      <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-[1.5rem] overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500">
        <img
          src={resolveProductImage(item.product?.images || item.product?.image)}
          alt={item.product?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Details */}
      <div className="flex-1 text-center sm:text-left w-full">
        <div className="mb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-1 block">
            {item.product?.brand?.name || 'Collection'}
          </span>
          <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-emerald-900 transition-colors">
            {item.product?.name || `Product #${item.productId}`}
          </h3>
        </div>

        <p className="text-gray-400 text-sm mb-6 line-clamp-1 font-medium max-w-md mx-auto sm:mx-0">
          {item.product?.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">
              ${(Number(item.price) * quantity).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-gray-400">
              (${Number(item.price).toFixed(2)} ea)
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 group-hover:border-gray-200 transition-colors">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={isLoading || quantity <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:shadow-md text-gray-900 transition-all disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="w-12 text-center font-black text-gray-900 text-base">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={isLoading}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-black text-white shadow-sm hover:shadow-md hover:bg-gray-800 transition-all disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>

            <div className="hidden sm:block w-px h-8 bg-gray-100 mx-2" />

            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="hidden sm:flex p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group/trash"
              title="Remove Item"
            >
              <Trash2 size={20} className="group-hover/trash:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}