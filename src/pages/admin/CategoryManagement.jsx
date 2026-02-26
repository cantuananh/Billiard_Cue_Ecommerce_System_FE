import React, { useState, useEffect } from 'react';
import { Plus, Edit2, ToggleLeft, ToggleRight, Trash2, Search } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CategoryModal from '../../components/admin/CategoryModal';
import { adminCategoryService } from '../../services/adminCategoryService';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

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
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Modal states
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    mode: 'create',
    category: null,
    loading: false
  });
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    category: null,
    action: null,
    loading: false
  });

  // Fetch categories
  const fetchCategories = async (page = currentPage) => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10,
        search: debouncedSearchTerm,
        status: filterStatus,
        sortBy: 'createdAt',
        sortDir: 'desc'
      };
      
      const response = await adminCategoryService.getAllCategories(params);
      setCategoriesData(response);
      setCurrentPage(page);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách danh mục');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(0);
  }, [debouncedSearchTerm, filterStatus]);

  const handleStatusFilter = (value) => {
    setFilterStatus(value === 'all' ? null : value === 'active');
  };

  const handlePageChange = (newPage) => {
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



  const handleSaveCategory = async (categoryData) => {
    try {
      setCategoryModal(prev => ({ ...prev, loading: true }));
      
      if (categoryModal.mode === 'create') {
        await adminCategoryService.createCategory(categoryData);
        toast.success('Tạo danh mục thành công');
      } else if (categoryModal.mode === 'edit') {
        await adminCategoryService.updateCategory(categoryModal.category.id, categoryData);
        toast.success('Cập nhật danh mục thành công');
      }
      
      setCategoryModal({ isOpen: false, mode: 'create', category: null, loading: false });
      fetchCategories(currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setCategoryModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleToggleStatus = (category) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-600">Quản lý danh mục sản phẩm trong hệ thống</p>
        </div>
        <button
          onClick={handleCreateCategory}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-t-lg shadow-sm border border-gray-200 border-b-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Tìm theo tên danh mục..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select 
              value={filterStatus === null ? 'all' : filterStatus ? 'active' : 'inactive'} 
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hiển thị</option>
              <option value="inactive">Ẩn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white shadow-sm rounded-b-lg border border-gray-200 border-t-0 overflow-hidden -mt-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách danh mục ({categoriesData?.totalElements || 0})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : categoriesData?.content?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">Không có danh mục nào</div>
            <div className="text-gray-400 text-sm">Hãy tạo danh mục đầu tiên</div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số sản phẩm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoriesData?.content?.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{category.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {category.productCount || 0} <span className="text-gray-500">sản phẩm</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Hiển thị' : 'Ẩn'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-gray-600 hover:text-gray-800 p-1"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(category)}
                            className={`p-1 ${
                              category.isActive ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'
                            }`}
                            title={category.isActive ? 'Ẩn danh mục' : 'Hiển thị danh mục'}
                          >
                            {category.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {categoriesData?.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-700">
                  Hiển thị {currentPage + 1} đến {categoriesData.totalPages} trong tổng số {categoriesData.totalElements} kết quả
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={categoriesData.first}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    ‹
                  </button>
                  {Array.from({ length: categoriesData.totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        i === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={categoriesData.last}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    ›
                  </button>
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  ⚠️
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {confirmModal.action === 'toggle' 
                    ? `Xác nhận ${confirmModal.category?.isActive ? 'ẩn' : 'hiển thị'} danh mục`
                    : 'Xác nhận xóa danh mục'
                  }
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {confirmModal.action === 'toggle'
                    ? `Bạn có chắc chắn muốn ${confirmModal.category?.isActive ? 'ẩn' : 'hiển thị'} danh mục "${confirmModal.category?.name}"?`
                    : `Bạn có chắc chắn muốn xóa danh mục "${confirmModal.category?.name}"? Hành động này không thể hoàn tác.`
                  }
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setConfirmModal({ isOpen: false, category: null, action: null, loading: false })}
                disabled={confirmModal.loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={confirmModal.loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 ${
                  confirmModal.action === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {confirmModal.loading ? 'Đang xử lý...' : 
                  (confirmModal.action === 'toggle' 
                    ? (confirmModal.category?.isActive ? 'Ẩn' : 'Hiển thị')
                    : 'Xóa'
                  )
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
