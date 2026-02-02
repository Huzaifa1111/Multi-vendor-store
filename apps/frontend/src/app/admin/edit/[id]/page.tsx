// apps/frontend/src/app/admin/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Loader2, X, Upload } from 'lucide-react';
import Link from 'next/link';
import productService, { Product } from '@/services/product.service';
import { resolveProductImage } from '@/lib/image';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    price: 0,
    stock: 0,
    category: '',
    featured: false,
    sku: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(productId);
        setProduct(data);
        setFormData({
          name: data.name,
          description: data.description,
          longDescription: data.longDescription || '',
          price: data.price,
          stock: data.stock,
          category: data.category || '',
          featured: data.featured || false,
          sku: data.sku || '',
        });

        if (data.images && data.images.length > 0) {
          setImagePreviews(data.images.map((img: string) => resolveProductImage(img)));
        } else if (data.image) {
          setImagePreviews([resolveProductImage(data.image)]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Failed to load product');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
          ? parseFloat(value) || 0
          : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== (index - (imagePreviews.length - images.length))));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      await productService.updateProduct(productId, formDataToSend);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-black hover:shadow-md transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit Product</h1>
            <p className="text-gray-500 font-medium font-plus-jakarta-sans text-sm">Refine your product details and images.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-100 overflow-hidden">
          <CardContent className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-gray-900"
                    placeholder="Minimalist Watch..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-black text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-black text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-gray-900 cursor-pointer"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Short Description</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-gray-700 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Long Details</label>
                  <textarea
                    name="longDescription"
                    rows={5}
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-gray-700 leading-relaxed shadow-inner"
                    placeholder="Deep details about materials, care..."
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-100 overflow-hidden">
          <CardContent className="p-10">
            <h2 className="text-xl font-black text-black mb-8 flex items-center gap-3">
              <Upload size={24} className="text-blue-600" /> Image Management
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative aspect-square group rounded-[1.5rem] overflow-hidden border-2 border-gray-50 shadow-sm">
                  <img src={preview} className="w-full h-full object-cover" alt="" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="aspect-square flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[1.5rem] cursor-pointer hover:bg-white hover:border-blue-400 transition-all group">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400 group-hover:text-blue-600 group-hover:shadow-md transition-all">
                  <Plus size={24} />
                </div>
                <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-8 py-4 font-bold text-gray-500 hover:text-black transition-all">
            Discard Changes
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-10 py-4 bg-black text-white rounded-[1.5rem] font-black shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving System Updates...' : 'Publish Modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}