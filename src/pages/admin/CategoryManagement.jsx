import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { adminCategoryService } from '../../services/adminCategoryService';
import { useDebounce } from '../../hooks/useDebounce';
import CategoryModal from '../../components/admin/CategoryModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CategoryManagement = () => {
  const [categoriesData, setCategoriesData] = useState({
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    empty: true
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Modal states
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    mode: 'create', // 'create', 'edit', 'view'
    category: null,
    loading: false
  });
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    category: null,
    action: null, // 'delete', 'toggle'
    loading: false
  });

  // Debounce search term để tránh gọi API quá nhiều
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCategories = async (page = 0) => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10,
        search: debouncedSearchTerm, // Sử dụng debounced search term
        status: filterStatus,
        sortBy: 'createdAt',
        sortDir: 'desc'
      };
      
      const response = await adminCategoryService.getAllCategories(params);
      setCategoriesData(response);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách danh mục');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect để fetch categories khi các filter thay đổi
  useEffect(() => {
    setCurrentPage(0); // Reset về trang đầu khi filter thay đổi
    fetchCategories(0);
  }, [debouncedSearchTerm, filterStatus]);

  // Effect này không cần thiết vì handlePageChange đã gọi fetchCategories
  // useEffect(() => {
  //   fetchCategories(currentPage);
  // }, [currentPage]);

  const handleStatusFilter = (value) => {
    setFilterStatus(value === 'all' ? null : value === 'active');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchCategories(newPage);
  };

  const handleCreateCategory = () => {
    setCategoryModal({
      isOpen: true,
      mode: 'create',
      category: null,
      loading: false
    });
  };

  const handleEditCategory = (category) => {
    setCategoryModal({
      isOpen: true,
      mode: 'edit',
      category,
      loading: false
    });
  };

  const handleViewCategory = (category) => {
    setCategoryModal({
      isOpen: true,
      mode: 'view',
      category,
      loading: false
    });
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      setCategoryModal(prev => ({ ...prev, loading: true }));
      
      if (categoryModal.mode === 'create') {
        await adminCategoryService.createCategory(categoryData);
        toast.success('Tạo danh mục thành công');
        // Về trang đầu tiên để thấy item vừa tạo
        setCurrentPage(0);
        fetchCategories(0);
      } else if (categoryModal.mode === 'edit') {
        await adminCategoryService.updateCategory(categoryModal.category.id, categoryData);
        toast.success('Cập nhật danh mục thành công');
        // Ở lại trang hiện tại
        fetchCategories(currentPage);
      }
      
      setCategoryModal({ isOpen: false, mode: 'create', category: null, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setCategoryModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleToggleCategoryStatus = (category) => {
    setConfirmModal({
      isOpen: true,
      category,
      action: 'toggle',
      loading: false
    });
  };

  const handleDeleteCategory = (category) => {
    setConfirmModal({
      isOpen: true,
      category,
      action: 'delete',
      loading: false
    });
  };

  const handleConfirmAction = async () => {
    try {
      setConfirmModal(prev => ({ ...prev, loading: true }));
      
      if (confirmModal.action === 'toggle') {
        await adminCategoryService.toggleCategoryStatus(confirmModal.category.id);
        toast.success(`${confirmModal.category.isActive ? 'Ẩn' : 'Hiển thị'} danh mục thành công`);
      } else if (confirmModal.action === 'delete') {
        await adminCategoryService.deleteCategory(confirmModal.category.id);
        toast.success('Xóa danh mục thành công');
      }
      
      setConfirmModal({ isOpen: false, category: null, action: null, loading: false });
      fetchCategories(currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Hiển thị
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Ẩn
      </span>
    );
  };

  const pagination = useMemo(() => {
    const { page, totalPages } = categoriesData;
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(0, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [categoriesData]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
        <p className="mt-1 text-sm text-gray-600">Quản lý danh mục sản phẩm trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo tên danh mục... (Nhấn Enter)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
          <select
            value={filterStatus === null ? 'all' : filterStatus ? 'active' : 'inactive'}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hiển thị</option>
            <option value="inactive">Ẩn</option>
          </select>
        </div>

        {/* Add Button */}
        <div className="flex items-end">
          <button
            onClick={handleCreateCategory}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm danh mục
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách danh mục ({categoriesData.totalElements})
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DANH MỤC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SỐ SẢN PHẨM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TRẠNG THÁI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NGÀY TẠO
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      THAO TÁC
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoriesData.content.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {category.name}
                            </div>
                            {category.description && (
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {category.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{category.productCount || 0}</div>
                        <div className="text-sm text-gray-500">sản phẩm</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(category.isActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(category.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewCategory(category)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Xem chi tiết"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Chỉnh sửa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggleCategoryStatus(category)}
                            className={`p-1 ${category.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                            title={category.isActive ? 'Ẩn danh mục' : 'Hiển thị danh mục'}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {category.isActive ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              )}
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Xóa"
                            disabled={category.productCount > 0}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {categoriesData.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                    disabled={categoriesData.first}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.min(categoriesData.totalPages - 1, currentPage + 1))}
                    disabled={categoriesData.last}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị{' '}
                      <span className="font-medium">{currentPage * 10 + 1}</span>{' '}
                      đến{' '}
                      <span className="font-medium">
                        {Math.min((currentPage + 1) * 10, categoriesData.totalElements)}
                      </span>{' '}
                      trong tổng số{' '}
                      <span className="font-medium">{categoriesData.totalElements}</span>{' '}
                      kết quả
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                        disabled={categoriesData.first}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {pagination.map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(Math.min(categoriesData.totalPages - 1, currentPage + 1))}
                        disabled={categoriesData.last}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Category Modal */}
      {categoryModal.isOpen && (
        <CategoryModal
          mode={categoryModal.mode}
          category={categoryModal.category}
          loading={categoryModal.loading}
          onSave={handleSaveCategory}
          onClose={() => setCategoryModal({ isOpen: false, mode: 'create', category: null, loading: false })}
        />
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              {confirmModal.action === 'delete' ? 'Xác nhận xóa danh mục' : 'Xác nhận thay đổi trạng thái'}
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              {confirmModal.action === 'delete' 
                ? `Bạn có chắc chắn muốn xóa danh mục "${confirmModal.category?.name}"? Hành động này không thể hoàn tác.`
                : `Bạn có chắc chắn muốn ${confirmModal.category?.isActive ? 'ẩn' : 'hiển thị'} danh mục "${confirmModal.category?.name}"?`
              }
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, category: null, action: null, loading: false })}
                disabled={confirmModal.loading}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={confirmModal.loading}
                className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  confirmModal.action === 'delete'
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                }`}
              >
                {confirmModal.loading ? 'Đang xử lý...' : (confirmModal.action === 'delete' ? 'Xóa' : 'Thay đổi')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;