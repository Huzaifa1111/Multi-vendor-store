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
    <div className="space-y-6">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
      </button>

      <div className={`${showFilters ? 'block' : 'hidden lg:block'} space-y-6`}>
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name or description"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm ${!selectedCategory ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm ${selectedCategory === category ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min Price</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                onBlur={handlePriceChange}
                placeholder="$0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Price</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                onBlur={handlePriceChange}
                placeholder="$1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Featured Filter */}
        {showFeaturedFilter && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => handleFeaturedChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Show Featured Only
            </label>
          </div>
        )}

        {/* Clear Filters */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
}