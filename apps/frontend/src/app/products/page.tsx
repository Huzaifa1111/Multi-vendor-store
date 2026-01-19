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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <p className="text-gray-600 mt-2">Browse our amazing collection of products</p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedCategory 
                    ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`
                    : 'All Products'}
                </h2>
                <span className="text-sm text-gray-500">
                  {products.length} {products.length === 1 ? 'product' : 'products'} found
                </span>
              </div>
              
              {filters.featured && (
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">
                  <span>Showing featured products only</span>
                </div>
              )}
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