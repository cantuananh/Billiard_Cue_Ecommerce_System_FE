import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  Package,
  PackageX,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ProductModal from '../../components/admin/ProductModal';
import ProductDetailModal from '../../components/admin/ProductDetailModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { adminProductService } from '../../services/adminProductService';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

const ProductManagement = () => {
  const [productsData, setProductsData] = useState({
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
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Debounce search term - chỉ search sau 500ms khi user ngừng gõ
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Modal states
  const [productModal, setProductModal] = useState({ isOpen: false, product: null, loading: false });
  const [viewModal, setViewModal] = useState({ isOpen: false, product: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, product: null, action: null, loading: false });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminProductService.getCategories();
      console.log('Categories response:', response); // Debug log
      setCategories(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Ensure categories is always an array
    }
  };

  // Fetch products data
  // searchQuery: nếu truyền vào thì dùng (dùng khi Enter), không thì dùng debouncedSearchTerm
  const fetchProducts = async (page = currentPage, searchQuery = debouncedSearchTerm) => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10,
        search: searchQuery,
        category: filterCategory === 'all' ? undefined : filterCategory,
        status: filterStatus,
        sortBy: 'createdAt',
        sortDir: 'desc'
      };
      
      const response = await adminProductService.getAllProducts(params);
      setProductsData(response);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách sản phẩm');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect để fetch data khi debounced search term thay đổi
  useEffect(() => {
    fetchProducts(0, debouncedSearchTerm);
    setCurrentPage(0);
  }, [debouncedSearchTerm, filterCategory, filterStatus]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    // Nếu nhấn Enter, tìm kiếm ngay lập tức với searchTerm hiện tại (không chờ debounce)
    if (e.key === 'Enter') {
      fetchProducts(0, searchTerm);
      setCurrentPage(0);
    }
  };

  const handleCategoryFilter = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setFilterStatus(value === 'all' ? null : value === 'active');
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === productsData.content.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(productsData.content.map(product => product.id));
    }
  };

  // Product CRUD operations
  const handleCreateProduct = () => {
    setProductModal({ isOpen: true, product: null, loading: false });
  };

  const handleViewProduct = (product) => {
    setViewModal({ isOpen: true, product });
  };

  const handleEditProduct = (product) => {
    setProductModal({ isOpen: true, product, loading: false });
  };

  const handleProductSubmit = async (productData) => {
    try {
      setProductModal(prev => ({ ...prev, loading: true }));
      
      if (productModal.product) {
        // Update product
        await adminProductService.updateProduct(productModal.product.id, productData);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        // Create product
        await adminProductService.createProduct(productData);
        toast.success('Tạo sản phẩm thành công');
      }
      
      setProductModal({ isOpen: false, product: null, loading: false });
      fetchProducts(currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setProductModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleToggleProductStatus = (product) => {
    setConfirmModal({
      isOpen: true,
      product,
      action: 'toggle',
      loading: false
    });
  };

  const handleDeleteProduct = (product) => {
    setConfirmModal({
      isOpen: true,
      product,
      action: 'delete',
      loading: false
    });
  };

  const handleConfirmAction = async () => {
    try {
      setConfirmModal(prev => ({ ...prev, loading: true }));
      
      if (confirmModal.action === 'toggle') {
        await adminProductService.toggleProductStatus(confirmModal.product.id);
        toast.success(`${confirmModal.product.isActive ? 'Ẩn' : 'Hiển thị'} sản phẩm thành công`);
      } else if (confirmModal.action === 'delete') {
        await adminProductService.deleteProduct(confirmModal.product.id);
        toast.success('Xóa sản phẩm thành công');
      }
      
      setConfirmModal({ isOpen: false, product: null, action: null, loading: false });
      fetchProducts(currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchProducts(newPage);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Không có danh mục';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý sản phẩm</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý sản phẩm cơ bi và phụ kiện trong hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={handleCreateProduct}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm theo tên, mã sản phẩm... (Nhấn Enter để tìm ngay)"
                  value={searchTerm}
                  onChange={handleSearch}
                  onKeyPress={handleSearchKeyPress}
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {/* Loading indicator khi đang chờ debounce */}
                {searchTerm !== debouncedSearchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  </div>
                )}
              </div>
              {searchTerm && (
                <p className="mt-1 text-xs text-gray-500">
                  {searchTerm !== debouncedSearchTerm 
                    ? 'Đang tìm kiếm...' 
                    : `Tìm kiếm: "${debouncedSearchTerm}"`
                  }
                </p>
              )}
            </div>

            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                value={filterCategory}
                onChange={handleCategoryFilter}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">Tất cả danh mục</option>
                {Array.isArray(categories) && categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select 
                value={filterStatus === null ? 'all' : filterStatus ? 'active' : 'inactive'} 
                onChange={handleStatusFilter}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hiển thị</option>
                <option value="inactive">Ẩn</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Danh sách sản phẩm ({productsData.totalElements})
            </h3>
            {selectedProducts.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Đã chọn {selectedProducts.length} sản phẩm
                </span>
                <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                  Xóa đã chọn
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === productsData.content.length && productsData.content.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productsData.content.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0">
                        {product.imageUrl ? (
                          <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={product.imageUrl} 
                            alt={product.name}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm text-gray-500">#{product.sku || product.id}</span>
                          <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            {getCategoryName(product.categoryId)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 max-w-xs truncate">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.stockQuantity || 0}
                    </div>
                    <div className={`text-xs ${
                      (product.stockQuantity || 0) > 10 
                        ? 'text-green-600' 
                        : (product.stockQuantity || 0) > 0 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {(product.stockQuantity || 0) > 10 
                        ? 'Còn hàng' 
                        : (product.stockQuantity || 0) > 0 
                        ? 'Sắp hết' 
                        : 'Hết hàng'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleViewProduct(product)}
                        className="p-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleToggleProductStatus(product)}
                        className={`${product.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={product.isActive ? 'Ẩn sản phẩm' : 'Hiển thị sản phẩm'}
                      >
                        {product.isActive ? <PackageX className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={productsData.first}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </button>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={productsData.last}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{currentPage * productsData.size + 1}</span> đến{' '}
                <span className="font-medium">
                  {Math.min((currentPage + 1) * productsData.size, productsData.totalElements)}
                </span>{' '}
                trong tổng số <span className="font-medium">{productsData.totalElements}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={productsData.first}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, productsData.totalPages) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(currentPage - 2, productsData.totalPages - 5)) + i;
                  if (pageNum >= productsData.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === currentPage
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={productsData.last}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, product: null })}
        product={viewModal.product}
        onEdit={(product) => handleEditProduct(product)}
      />

      {/* Product Modal */}
      <ProductModal
        isOpen={productModal.isOpen}
        onClose={() => setProductModal({ isOpen: false, product: null, loading: false })}
        onSubmit={handleProductSubmit}
        product={productModal.product}
        loading={productModal.loading}
        categories={categories}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, product: null, action: null, loading: false })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.action === 'delete' 
            ? 'Xác nhận xóa sản phẩm' 
            : confirmModal.action === 'toggle' && confirmModal.product?.isActive
            ? 'Xác nhận ẩn sản phẩm'
            : 'Xác nhận hiển thị sản phẩm'
        }
        message={
          confirmModal.action === 'delete'
            ? `Bạn có chắc chắn muốn xóa sản phẩm "${confirmModal.product?.name}"? Hành động này không thể hoàn tác.`
            : confirmModal.action === 'toggle' && confirmModal.product?.isActive
            ? `Bạn có chắc chắn muốn ẩn sản phẩm "${confirmModal.product?.name}"?`
            : `Bạn có chắc chắn muốn hiển thị sản phẩm "${confirmModal.product?.name}"?`
        }
        confirmText={
          confirmModal.action === 'delete' 
            ? 'Xóa' 
            : confirmModal.action === 'toggle' && confirmModal.product?.isActive
            ? 'Ẩn'
            : 'Hiển thị'
        }
        type={confirmModal.action === 'delete' ? 'danger' : 'warning'}
        loading={confirmModal.loading}
      />
    </div>
  );
};

export default ProductManagement;