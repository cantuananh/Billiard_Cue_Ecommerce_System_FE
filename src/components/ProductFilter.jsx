import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

const ProductFilter = ({ 
  categories, 
  onFilterChange, 
  initialFilters = {
    search: '',
    categoryId: '',
    minPrice: 0,
    maxPrice: 50000000,
    sortBy: 'createdAt',
    sortDir: 'desc'
  }
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: initialFilters.minPrice,
    max: initialFilters.maxPrice
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragTimeout, setDragTimeout] = useState(null);

  // Constants for price range
  const MIN_PRICE = 0;
  const MAX_PRICE = 50000000; // 50 triệu
  const STEP = 500000; // 500k

  // Format price for display
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}tr`;
    }
    return `${(price / 1000).toFixed(0)}k`;
  };

  // Debounce function to avoid too many API calls
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Debounced filter change
  const debouncedFilterChange = useCallback(
    debounce((newFilters) => {
      onFilterChange(newFilters);
    }, 300),
    [onFilterChange]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    debouncedFilterChange(newFilters);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const newFilters = { ...filters, categoryId: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const [sortBy, sortDir] = e.target.value.split('-');
    const newFilters = { ...filters, sortBy, sortDir };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle price range change
  const handlePriceChange = (type, value) => {
    const numValue = parseInt(value);
    let newRange = { ...priceRange };
    
    if (type === 'min') {
      // Ensure min doesn't exceed max - minimum gap
      newRange.min = Math.min(numValue, priceRange.max - STEP);
      // Also ensure min doesn't go below 0
      newRange.min = Math.max(0, newRange.min);
    } else {
      // Ensure max doesn't go below min + minimum gap
      newRange.max = Math.max(numValue, priceRange.min + STEP);
      // Also ensure max doesn't exceed maximum
      newRange.max = Math.min(MAX_PRICE, newRange.max);
    }
    
    setPriceRange(newRange);
    setIsDragging(true);
    
    // Clear existing timeout
    if (dragTimeout) {
      clearTimeout(dragTimeout);
    }
    
    // Debounce the filter change to avoid too many API calls
    const timeout = setTimeout(() => {
      const newFilters = { 
        ...filters, 
        minPrice: newRange.min, 
        maxPrice: newRange.max 
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
      setIsDragging(false);
    }, 500);
    
    setDragTimeout(timeout);
  };

  // Clear all filters
  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      categoryId: '',
      minPrice: MIN_PRICE,
      maxPrice: MAX_PRICE,
      sortBy: 'createdAt',
      sortDir: 'desc'
    };
    setFilters(defaultFilters);
    setPriceRange({ min: MIN_PRICE, max: MAX_PRICE });
    onFilterChange(defaultFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.search !== '' || 
           filters.categoryId !== '' || 
           priceRange.min !== MIN_PRICE || 
           priceRange.max !== MAX_PRICE;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc sản phẩm</h3>
          {hasActiveFilters() && (
            <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full">
              Đang lọc
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="flex items-center text-gray-500 hover:text-red-500 text-sm transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Filter */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm sản phẩm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Nhập tên sản phẩm..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <select
              value={filters.categoryId}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">Tất cả danh mục</option>
              {categories && categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sắp xếp
            </label>
            <select
              value={`${filters.sortBy}-${filters.sortDir}`}
              onChange={handleSortChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="createdAt-desc">Mới nhất</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="name-asc">Tên: A-Z</option>
              <option value="name-desc">Tên: Z-A</option>
              <option value="rating-desc">Đánh giá cao nhất</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng giá
            </label>
            <div className="space-y-3">
              {/* Price Display */}
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${isDragging ? 'text-green-600' : 'text-gray-600'}`}>
                  {formatPrice(priceRange.min)}
                </span>
                <span className="text-gray-400">đến</span>
                <span className={`font-medium ${isDragging ? 'text-red-600' : 'text-gray-600'}`}>
                  {formatPrice(priceRange.max)}
                </span>
              </div>
              {isDragging && (
                <div className="text-xs text-center text-indigo-600 font-medium">
                  Đang cập nhật bộ lọc...
                </div>
              )}

              {/* Dual Range Slider */}
              <div className="relative px-2">
                {/* Track */}
                <div className="relative h-2 bg-gray-200 rounded-full">
                  {/* Active track */}
                  <div 
                    className="absolute h-2 bg-indigo-500 rounded-full"
                    style={{
                      left: `${(priceRange.min / MAX_PRICE) * 100}%`,
                      width: `${((priceRange.max - priceRange.min) / MAX_PRICE) * 100}%`
                    }}
                  />
                </div>

                {/* Min slider */}
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={STEP}
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer range-slider range-slider-min"
                  style={{ 
                    zIndex: priceRange.min > MAX_PRICE - (MAX_PRICE * 0.05) ? 2 : 1 
                  }}
                />

                {/* Max slider */}
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={STEP}
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer range-slider range-slider-max"
                  style={{ 
                    zIndex: priceRange.max < MAX_PRICE * 0.05 ? 2 : 1 
                  }}
                />
              </div>

              {/* Price Input Fields */}
              <div className="flex items-center space-x-2 text-xs">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={STEP}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={STEP}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for range slider */}
      <style jsx>{`
        .range-slider {
          pointer-events: none;
        }
        
        .range-slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          pointer-events: all;
          position: relative;
        }

        .range-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          pointer-events: all;
          position: relative;
        }

        .range-slider::-webkit-slider-track {
          background: transparent;
          border: none;
        }

        .range-slider::-moz-range-track {
          background: transparent;
          border: none;
        }

        .range-slider-min::-webkit-slider-thumb {
          background: #059669;
        }

        .range-slider-min::-moz-range-thumb {
          background: #059669;
        }

        .range-slider-max::-webkit-slider-thumb {
          background: #dc2626;
        }

        .range-slider-max::-moz-range-thumb {
          background: #dc2626;
        }

        /* Firefox specific fixes */
        .range-slider::-moz-range-thumb {
          border: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: all;
        }

        .range-slider::-moz-range-track {
          height: 8px;
          background: transparent;
          border: none;
        }

        .range-slider::-moz-focus-outer {
          border: 0;
        }
      `}</style>
    </div>
  );
};

export default ProductFilter;