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

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    if ('category' in newFilters && newFilters.category !== filters.category) {
      setSelectedCategory(newFilters.category);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-plus-jakarta-sans text-black">
      {/* Background Decorative Elements - Emerald Mist */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24 relative z-10">

        {/* Cinematic Header Section */}
        <div className="mb-20 md:mb-32">
          <div className="flex items-center gap-6 mb-8 text-[11px] font-black uppercase tracking-[0.6em] text-emerald-600/50">
            <span>The Collection</span>
            <span className="w-12 h-px bg-emerald-100" />
            <span>Archive 2026</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] max-w-2xl">
              Discover Our<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-black">
                Curated Selection
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-sm">
              Explore a world of refined craftsmanship where every piece tells a story of prestige and precision.
            </p>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-16 xl:gap-24">

          {/* Filters Sidebar - Boutique Controls */}
          <div className="lg:col-span-3">
            <div className="sticky top-12">
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Products Grid - Digital Showroom */}
          <div className="lg:col-span-9">
            <div className="mb-12 pb-8 border-b border-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tighter text-black uppercase mb-1">
                    {selectedCategory
                      ? selectedCategory
                      : 'Entire Collection'}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                      {products.length} {products.length === 1 ? 'Archetype' : 'Archetypes'}
                    </span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Digital Showroom</span>
                  </div>
                </div>

                {filters.featured && (
                  <div className="inline-flex items-center px-6 py-2.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-[0_10px_20px_-5px_rgba(5,150,105,0.4)] animate-pulse">
                    Archive Signature Pieces
                  </div>
                )}
              </div>
            </div>

            <ProductList
              products={products}
              loading={loading}
              emptyMessage={filters.search ? 'Zero matches found in our records.' : 'This collection segment is currently empty.'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}