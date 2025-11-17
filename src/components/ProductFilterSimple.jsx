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

  // Constants for price range
  const MIN_PRICE = 0;
  const MAX_PRICE = 50000000; // 50 triệu
  const STEP = 500000; // 500k

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
  };

  // Format price for compact display (for slider labels)
  const formatPriceCompact = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}tr`;
    }
    return `${(price / 1000).toFixed(0)}k`;
  };

  // Debounce function
  const useDebounce = (callback, delay) => {
    const [debounceTimer, setDebounceTimer] = useState(null);
    
    const debouncedCallback = useCallback((...args) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      const newTimer = setTimeout(() => {
        callback(...args);
      }, delay);
      
      setDebounceTimer(newTimer);
    }, [callback, delay, debounceTimer]);
    
    return debouncedCallback;
  };

  // Debounced filter change
  const debouncedFilterChange = useDebounce(onFilterChange, 300);

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
      // Ensure min doesn't exceed max minus minimum gap
      newRange.min = Math.min(numValue, newRange.max - STEP);
      // Ensure min doesn't go below minimum price
      newRange.min = Math.max(MIN_PRICE, newRange.min);
    } else {
      // Ensure max doesn't go below min plus minimum gap  
      newRange.max = Math.max(numValue, newRange.min + STEP);
      // Ensure max doesn't exceed maximum price
      newRange.max = Math.min(MAX_PRICE, newRange.max);
    }
    
    setPriceRange(newRange);
    
    const newFilters = { 
      ...filters, 
      minPrice: newRange.min, 
      maxPrice: newRange.max 
    };
    setFilters(newFilters);
    debouncedFilterChange(newFilters);
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

  // Get active filter count and description
  const getActiveFilterDescription = () => {
    const activeFilters = [];
    if (filters.search !== '') activeFilters.push('Tìm kiếm');
    if (filters.categoryId !== '') activeFilters.push('Danh mục');
    if (priceRange.min !== MIN_PRICE || priceRange.max !== MAX_PRICE) {
      activeFilters.push('Khoảng giá');
    }
    return activeFilters.length > 0 ? `${activeFilters.length} bộ lọc` : 'Đang lọc';
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
              {getActiveFilterDescription()}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khoảng giá
            </label>
            <div className="space-y-4 bg-gray-50 p-3 rounded-lg border">
              {/* Price Display */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatPriceCompact(priceRange.min)}</span>
                  <span>đến</span>
                  <span>{formatPriceCompact(priceRange.max)}</span>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full">
                    {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                  </span>
                </div>
              </div>

              {/* Dual Range Slider */}
              <div className="relative h-8">
                {/* Track */}
                <div className="absolute top-3 left-0 right-0 h-2 bg-gray-200 rounded-full">
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
                  className="absolute top-0 left-0 w-full h-8 bg-transparent appearance-none cursor-pointer range-slider range-slider-min"
                  style={{ zIndex: priceRange.min > priceRange.max - STEP * 2 ? 5 : 1 }}
                />

                {/* Max slider */}
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={STEP}
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="absolute top-0 left-0 w-full h-8 bg-transparent appearance-none cursor-pointer range-slider range-slider-max"
                  style={{ zIndex: priceRange.max < priceRange.min + STEP * 2 ? 5 : 2 }}
                />
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for range slider */}
      <style jsx>{`
        /* Range slider styling */
        .range-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
        }

        .range-slider::-webkit-slider-track {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          border: none;
        }

        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
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

        .range-slider::-moz-range-track {
          background: transparent;
          border: none;
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
        }

        .range-slider::-ms-track {
          background: transparent;
          border: none;
        }

        .range-slider::-ms-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Ensure both sliders are interactive */
        .range-slider-min {
          z-index: 1;
        }

        .range-slider-max {
          z-index: 2;
        }

        .range-slider-min::-webkit-slider-thumb {
          z-index: 3;
        }

        .range-slider-max::-webkit-slider-thumb {
          z-index: 4;
        }

        /* Focus states */
        .range-slider:focus {
          outline: none;
        }

        .range-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }

        .range-slider:active::-webkit-slider-thumb {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default ProductFilter;