import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalElements,
  pageSize,
  onPageChange,
  showInfo = true 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages = [];
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    if (totalPages <= 1) return pages;

    // Always show first page
    pages.push(1);

    // Show dots if there's a gap after first page
    if (rangeStart > 2) {
      pages.push('...');
    }

    // Show pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Show dots if there's a gap before last page
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page (if it's not the first page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Page Info */}
      {showInfo && (
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-medium text-gray-900">{startItem}</span> đến{' '}
          <span className="font-medium text-gray-900">{endItem}</span> trong tổng số{' '}
          <span className="font-medium text-gray-900">{totalElements}</span> sản phẩm
        </div>
      )}

      {/* Pagination Controls */}
      <nav className="flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === 0
              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-indigo-600'
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Trước
        </button>

        {/* Page Numbers */}
        <div className="flex flex-wrap items-center justify-center gap-1">
          {pages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const pageIndex = page - 1; // Convert to 0-based index
            const isActive = pageIndex === currentPage;

            return (
              <button
                key={page}
                onClick={() => onPageChange(pageIndex)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage >= totalPages - 1
              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-indigo-600'
          }`}
        >
          Sau
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </nav>

      {/* Quick Jump */}
      {totalPages > 10 && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Đi tới trang:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(e.target.value) - 1; // Convert to 0-based
                if (page >= 0 && page < totalPages) {
                  onPageChange(page);
                  e.target.value = '';
                }
              }
            }}
            placeholder={totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default Pagination;