'use client';

import { useState } from 'react';
import { Edit2, Trash2, Eye, Star, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { resolveProductImage } from '@/lib/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductTableProps {
  products: Product[];
  loading?: boolean;
  onDelete: (id: number) => void;
}

export default function ProductTable({ products, loading = false, onDelete }: ProductTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const formatPrice = (price: any) => {
    // Convert to number first, then format
    const numPrice = Number(price);
    if (isNaN(numPrice)) return '$0.00';
    return `$${numPrice.toFixed(2)}`;
  };

  const formatStock = (stock: any) => {
    const numStock = Number(stock);
    if (isNaN(numStock)) return 0;
    return numStock;
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-700 bg-red-50 border-red-100';
    if (stock < 5) return 'text-yellow-700 bg-yellow-50 border-yellow-100';
    return 'text-green-700 bg-green-50 border-green-100';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <div className="h-6 w-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loading...</span>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
        <PackageSearch size={40} className="text-gray-200" />
        <span className="font-semibold text-gray-900">No products found</span>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">
                Product
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">
                Category
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">
                Price
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">
                Status
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  className="hover:bg-gray-50/80 transition-colors group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 relative shadow-sm rounded-xl overflow-hidden border border-gray-100">
                        {product.image ? (
                          <img
                            className="h-full w-full object-cover"
                            src={resolveProductImage(product.image)}
                            alt={product.name}
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-50 flex items-center justify-center">
                            <span className="text-gray-300 text-[10px]">IMG</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900 line-clamp-1">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          {product.description?.substring(0, 50)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                      {product.category || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStockColor(
                        formatStock(product.stock)
                      )}`}
                    >
                      {formatStock(product.stock) < 5 && formatStock(product.stock) > 0 && <AlertTriangle size={10} className="mr-1" />}
                      {formatStock(product.stock) === 0 && <AlertTriangle size={10} className="mr-1" />}
                      {formatStock(product.stock)} available
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {product.featured ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-sm shadow-orange-200">
                        <Star size={10} className="mr-1 fill-current" /> Featured
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-gray-400">Regular</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(product.id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 px-4 pb-4">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                  {product.image ? (
                    <img
                      className="h-full w-full object-cover"
                      src={resolveProductImage(product.image)}
                      alt={product.name}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-gray-300 text-[10px]">IMG</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                    <div className="ml-2">
                      {product.featured && (
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wide">
                      {product.category || 'N/A'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStockColor(formatStock(product.stock))}`}>
                      {formatStock(product.stock)} Left
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xl font-black text-gray-900">{formatPrice(product.price)}</span>
                <div className="flex gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="p-2 rounded-lg bg-indigo-50 text-indigo-600"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(product.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full border border-gray-100"
          >
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500 mx-auto">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Confirm Delete
            </h3>
            <p className="text-gray-500 mb-8 text-center text-sm">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-3 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

// Helper icon component
function PackageSearch({ size, className }: { size: number, className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
      <path d="m7.5 4.27 9 5.15" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
      <circle cx="18.5" cy="15.5" r="2.5" />
      <path d="M20.27 17.27 22 19" />
    </svg>
  )
}