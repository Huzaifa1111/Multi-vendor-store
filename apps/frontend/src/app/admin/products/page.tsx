// apps/frontend/src/app/admin/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Package, Star, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import productService, { Product } from '@/services/product.service';
import ProductTable from '@/components/admin/ProductTable';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      console.log('Fetched products:', data);
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    // Delete logic is handled in the Table component usually, or passed down.
    // We'll keep this here to pass to the ProductTable if it needs it, 
    // though the ProductTable in the original file implemented its own confirm/delete UI?
    // Checking previous file, ProductTable took an onDelete prop.

    try {
      setDeletingId(id);
      await productService.deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = search
    ? products.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase()) ||
      ((typeof product.category === 'object' ? product.category.name : product.category)?.toLowerCase().includes(search.toLowerCase()))
    )
    : products;

  const featuredProductsCount = products.filter(p => p.featured).length;
  const lowStockCount = products.filter(p => p.stock <= 10 && p.stock > 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Products</h1>
          <p className="text-gray-500 text-lg">Manage inventory, prices, and featured items.</p>
        </div>
        <div className="relative z-10">
          <Link href="/admin/products/create">
            <Button className="flex items-center space-x-2 px-6 py-4 rounded-xl bg-black hover:bg-gray-800 text-white font-bold shadow-lg shadow-gray-200 transition-all hover:-translate-y-0.5">
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-200">
                <Package size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Products</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{products.length}</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-200">
                <Star size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Featured</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{featuredProductsCount}</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-200">
                <AlertTriangle size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Low Stock</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{lowStockCount}</h3>
          </div>
        </motion.div>
      </div>

      {/* Search and Table Section */}
      <motion.div variants={itemVariants} className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 w-full border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white transition-all h-12"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              fetchProducts();
            }}
            className="h-12 px-6 rounded-xl font-bold border-gray-200 hover:bg-gray-50 hover:text-black"
          >
            Refresh
          </Button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-1">
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <Button onClick={fetchProducts}>Retry</Button>
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              loading={loading}
              onDelete={handleDelete}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}