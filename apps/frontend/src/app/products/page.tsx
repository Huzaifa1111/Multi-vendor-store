// apps/frontend/src/app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { resolveProductImage } from '@/lib/image';
import ProductList from '@/components/products/ProductList';
import ProductFilters from '@/components/products/ProductFilters';
import productService, { Product } from '@/services/product.service';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [filters, setFilters] = useState({
    category: undefined as string | undefined,
    featured: undefined as boolean | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    search: undefined as string | undefined,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products with filters
        const productsData = await productService.getAllProducts(filters);
        setProducts(productsData);
        
        // Fetch categories for filter dropdown
        if (categories.length === 0) {
          const categoriesData = await productService.getCategories();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    if (newFilters.category !== filters.category) {
      setSelectedCategory(newFilters.category);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-gray-800 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8 animate-fade-in-down">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">Our Products</h1>
            <p className="text-xl text-gray-300 max-w-2xl">Discover our curated collection of premium products with exceptional quality and value</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 animate-fade-in-left">
            <div className="sticky top-8">
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 animate-fade-in-right">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {selectedCategory 
                      ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`
                      : 'All Products'}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {products.length} {products.length === 1 ? 'item' : 'items'} available
                  </p>
                </div>
                {filters.featured && (
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-300 text-gray-900 text-sm font-medium animate-pulse-slow">
                    <span className="inline-block w-2 h-2 bg-black rounded-full mr-2"></span>
                    Featured items only
                  </div>
                )}
              </div>
            </div>

            <ProductList 
              products={products}
              loading={loading}
              emptyMessage={filters.search ? 'No products match your search' : 'No products found in this category'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}