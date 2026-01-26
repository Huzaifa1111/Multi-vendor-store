// apps/frontend/src/app/admin/products/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UploadCloud, Image as ImageIcon, Check, Loader2, DollarSign, Package, Tag, Layers, Star } from 'lucide-react';
import Link from 'next/link';
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

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    featured: false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : name === 'price' || name === 'stock'
          ? parseFloat(value) || 0
          : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('stock', formData.stock.toString());
      formDataToSend.append('featured', formData.featured.toString());
      if (formData.category) {
        formDataToSend.append('category', formData.category);
      }
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products`, {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-4">
          <Link href="/admin/products" className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-black hover:shadow-md transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Add New Product</h1>
            <p className="text-gray-500 font-medium">Create a new item for your inventory</p>
          </div>
        </div>

        <div className="relative z-10 flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-black text-white font-bold shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
            Create Product
          </button>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column - Main Info */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          {/* Basic Details Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Tag className="text-blue-600" /> Basic Information
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder:text-gray-400 resize-none"
                  placeholder="Describe your product features, specs, and benefits..."
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="text-green-600" /> Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-bold">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all font-medium text-gray-900"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Package size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all font-medium text-gray-900"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Organization & Media */}
        <motion.div variants={itemVariants} className="space-y-8">
          {/* Media Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon className="text-purple-600" /> Media
            </h2>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">Product Image</label>
              <div className="relative group">
                {imagePreview ? (
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-gray-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label htmlFor="image-upload" className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-bold text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        Change Image
                      </label>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-sm font-bold text-gray-600">Click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </label>
                )}
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          {/* Organization Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Layers className="text-orange-600" /> Organization
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium text-gray-900 appearance-none"
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="home">Home & Kitchen</option>
                  <option value="beauty">Beauty</option>
                  <option value="sports">Sports</option>
                  <option value="toys">Toys</option>
                </select>
              </div>

              <div className="p-4 bg-yellow-50/50 rounded-2xl border border-yellow-100">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="featured" className="block text-sm font-bold text-gray-900 flex items-center gap-2">
                      Featured Product <Star size={14} className="fill-yellow-500 text-yellow-500" />
                    </label>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Featured products are pushed to the homepage top banner.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}