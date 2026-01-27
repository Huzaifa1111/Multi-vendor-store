// apps/frontend/src/components/products/ProductFilters.tsx
'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface ProductFiltersProps {
  categories: string[];
  selectedCategory?: string;
  showFeaturedFilter?: boolean;
  onFilterChange: (filters: {
    category?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  showFeaturedFilter = true,
  onFilterChange,
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [featured, setFeatured] = useState(false);

  const handleSearch = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ category: category === 'all' ? undefined : category });
  };

  const handlePriceChange = () => {
    onFilterChange({
      minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
    });
  };

  const handleFeaturedChange = (checked: boolean) => {
    setFeatured(checked);
    onFilterChange({ featured: checked });
  };

  const clearFilters = () => {
    setSearch('');
    setPriceRange({ min: '', max: '' });
    setFeatured(false);
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 backdrop-blur-sm">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden w-full flex items-center justify-center space-x-2 text-gray-700 hover:text-black font-medium py-3 px-4 bg-gray-100 rounded-lg transition-colors mb-4"
      >
        <Filter className="w-5 h-5" />
        <span>Show Filters</span>
      </button>

      <div className={`${showFilters ? 'block' : 'hidden lg:block'} space-y-6`}>
        {/* Search */}
        <div className="animate-fade-in-left">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Search Products
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Find products..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          {/* Category Filter */}
          <div className="animate-fade-in-left animation-delay-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
              <span className="inline-block w-2 h-2 bg-black rounded-full mr-2"></span>
              Categories
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${!selectedCategory ? 'bg-gray-900 text-white border border-gray-800' : 'text-gray-700 hover:bg-gray-100 border border-transparent'}`}
              >
                All Categories
              </button>
              {categories.map((category, idx) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  style={{ animationDelay: `${idx * 30}ms` }}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 animate-fade-in-left ${selectedCategory === category ? 'bg-gray-900 text-white border border-gray-800' : 'text-gray-700 hover:bg-gray-100 border border-transparent'}`}
                >
                  <span className="flex items-center">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 transition-all ${selectedCategory === category ? 'bg-black scale-100' : 'bg-gray-300 scale-75'}`}></span>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          {/* Price Range */}
          <div className="animate-fade-in-left animation-delay-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Price Range
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">From</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  onBlur={handlePriceChange}
                  placeholder="$0"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">To</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  onBlur={handlePriceChange}
                  placeholder="$1000"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Filter */}
        {showFeaturedFilter && (
          <div className="border-t border-gray-200 pt-6 animate-fade-in-left animation-delay-300">
            <label htmlFor="featured" className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => handleFeaturedChange(e.target.checked)}
                  className="sr-only"
                />
                <div className={`h-5 w-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${featured ? 'bg-black border-black' : 'border-gray-300 hover:border-gray-400'}`}>
                  {featured && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                ✨ Featured Only
              </span>
            </label>
          </div>
        )}

        {/* Clear Filters */}
        <div className="border-t border-gray-200 pt-6 animate-fade-in-left animation-delay-400">
          <button
            onClick={clearFilters}
            className="w-full flex items-center justify-center text-sm font-semibold text-black hover:text-gray-700 hover:bg-gray-100 py-2.5 px-4 rounded-lg transition-all duration-200"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}