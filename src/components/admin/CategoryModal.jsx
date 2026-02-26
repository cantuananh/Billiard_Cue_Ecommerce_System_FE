import React, { useState, useEffect } from 'react';
import LoadingButton from '../ui/LoadingButton';

const CategoryModal = ({ mode, category, loading, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        isActive: category.isActive !== undefined ? category.isActive : true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        isActive: true
      });
    }
    setErrors({});
  }, [category, mode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục không được để trống';
    }

    if (formData.name.trim().length > 255) {
      newErrors.name = 'Tên danh mục không được vượt quá 255 ký tự';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Mô tả không được vượt quá 1000 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === 'view') {
      onClose();
      return;
    }

    if (!validateForm()) {
      return;
    }

    console.log('Form data to submit:', formData);
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return 'Thêm danh mục mới';
      case 'edit':
        return 'Chỉnh sửa danh mục';
      case 'view':
        return 'Chi tiết danh mục';
      default:
        return 'Danh mục';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'create':
        return 'Tạo danh mục';
      case 'edit':
        return 'Cập nhật';
      case 'view':
        return 'Đóng';
      default:
        return 'Lưu';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {getModalTitle()}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nhập tên danh mục"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={mode === 'view'}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nhập mô tả danh mục (tùy chọn)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Hiển thị danh mục
                </span>
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Danh mục sẽ được hiển thị trên website khi được kích hoạt
              </p>
            </div>

            {/* Additional info for view mode */}
            {mode === 'view' && category && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Số sản phẩm:</span>
                    <span className="ml-2 text-gray-900">{category.productCount || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Trạng thái:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Ngày tạo:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Cập nhật:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(category.updatedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : getButtonText()}
              </button>
            )}
            {mode === 'view' && (
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {getButtonText()}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;