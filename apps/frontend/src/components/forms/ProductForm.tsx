// apps/frontend/src/components/forms/ProductForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import productService, { CreateProductData } from '@/services/product.service';
import { Upload, X } from 'lucide-react';
import RichTextEditor from '../admin/RichTextEditor';

interface ProductFormProps {
  initialData?: CreateProductData & { id?: number; featured?: boolean };
  isEditing?: boolean;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/categories/public`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState<CreateProductData & { featured?: boolean; categoryId?: string | number }>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    longDescription: initialData?.longDescription || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    categoryId: (initialData as any)?.categoryId || '',
    featured: initialData?.featured || false,
    shippingPolicy: initialData?.shippingPolicy || '',
    returnPolicy: initialData?.returnPolicy || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleRichTextChange = (name: string, content: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: content
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData: CreateProductData & { featured?: boolean } = {
        ...formData,
        image: imageFile || undefined,
      };

      if (isEditing && initialData?.id) {
        await productService.updateProduct(initialData.id, productData);
      } else {
        await productService.createProduct(productData);
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <div className="space-y-4">
          {imagePreview ? (
            <div className="relative w-48 h-48">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-500">
                  Click to upload image
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter product name"
        />
      </div>

      {/* Short Description */}
      <div>
        <RichTextEditor
          label="Short Summary (Highlights) *"
          placeholder="Brief summary for highlights..."
          value={formData.description}
          onChange={(content) => handleRichTextChange('description', content)}
        />
      </div>

      {/* Long Description */}
      <div>
        <RichTextEditor
          label="Extended Narrative (Includes Images)"
          placeholder="Detailed description, specifications, and images..."
          value={formData.longDescription || ''}
          onChange={(content) => handleRichTextChange('longDescription', content)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RichTextEditor
          label="Shipping Policy"
          placeholder="Custom shipping details..."
          value={formData.shippingPolicy || ''}
          onChange={(content) => handleRichTextChange('shippingPolicy', content)}
        />
        <RichTextEditor
          label="Return Policy"
          placeholder="Custom return details..."
          value={formData.returnPolicy || ''}
          onChange={(content) => handleRichTextChange('returnPolicy', content)}
        />
      </div>

      {/* Price and Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price ($) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Stock Quantity *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            required
            min="0"
            value={formData.stock}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Featured Checkbox - ADD THIS SECTION */}
      <div className="flex items-start space-x-2 p-4 border border-gray-200 rounded-lg">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured || false}
          onChange={handleInputChange}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <div>
          <label htmlFor="featured" className="block text-sm font-medium text-gray-700">
            Featured Product
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Featured products will be prominently displayed on the homepage.
            Check this box to make this product appear in the featured section.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}