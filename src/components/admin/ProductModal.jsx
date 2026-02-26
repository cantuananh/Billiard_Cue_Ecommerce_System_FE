import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import LoadingButton from '../ui/LoadingButton';
import { adminProductService } from '../../services/adminProductService';
import ImageUploadManager from './ImageUploadManager';
import toast from 'react-hot-toast';

const ProductModal = ({ isOpen, onClose, onSubmit, product, loading, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stockQuantity: '',
    categoryId: '',
    sku: '',
    imageUrl: '',
    isActive: true
  });
  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        stockQuantity: product.stockQuantity || '',
        categoryId: product.categoryId || '',
        sku: product.sku || '',
        imageUrl: product.imageUrl || '',
        isActive: product.isActive !== undefined ? product.isActive : true
      });
      
      // Load existing images if any
      if (product.images && product.images.length > 0) {
        setImages(product.images.map(img => ({
          id: img.id,
          url: img.imageUrl, // Fixed: use imageUrl instead of url
          serverUrl: img.imageUrl, // Add serverUrl for consistency
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder,
          isExisting: true
        })));
      } else if (product.imageUrl) {
        // Backward compatibility - convert single image to images array
        setImages([{
          id: null,
          url: product.imageUrl,
          serverUrl: product.imageUrl, // Add serverUrl for consistency
          isPrimary: true,
          displayOrder: 1,
          isExisting: true
        }]);
      } else {
        setImages([]);
      }
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        stockQuantity: '',
        categoryId: '',
        sku: '',
        imageUrl: '',
        isActive: true
      });
      setImages([]);
    }
    setErrors({});
  }, [product, isOpen]);

  const handleInputChange = (e) => {
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



  



  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả sản phẩm là bắt buộc';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Giá sản phẩm phải lớn hơn 0';
    }

    if (formData.originalPrice && parseFloat(formData.price) < parseFloat(formData.originalPrice)) {
      newErrors.price = 'Giá bán phải lớn hơn hoặc bằng giá gốc';
    }

    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Số lượng tồn kho không được âm';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Vui lòng chọn danh mục';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Images are already uploaded by ImageUploadManager
      const validImages = images.filter(img => !img.uploading && img.serverUrl);

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        categoryId: parseInt(formData.categoryId),
        images: validImages.map((img, index) => ({
          imageUrl: img.serverUrl,
          isPrimary: index === 0,
          displayOrder: index + 1
        })),
        // Keep imageUrl for backward compatibility
        imageUrl: validImages[0]?.serverUrl || ''
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error('Có lỗi xảy ra khi lưu sản phẩm');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {product ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.name ? 'border-red-300' : ''
                }`}
                placeholder="Cơ bi Pool Premium..."
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mã sản phẩm (SKU)
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="CB-001"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.categoryId ? 'border-red-300' : ''
                }`}
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số lượng tồn kho <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                min="0"
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.stockQuantity ? 'border-red-300' : ''
                }`}
                placeholder="100"
              />
              {errors.stockQuantity && <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá bán <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="1000"
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.price ? 'border-red-300' : ''
                }`}
                placeholder="500000"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá gốc (tuỳ chọn)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                min="0"
                step="1000"
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.originalPrice ? 'border-red-300' : ''
                }`}
                placeholder="600000"
              />
              {errors.originalPrice && <p className="mt-1 text-sm text-red-600">{errors.originalPrice}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả sản phẩm <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.description ? 'border-red-300' : ''
              }`}
              placeholder="Mô tả chi tiết về sản phẩm..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <ImageUploadManager 
            images={images} 
            onChange={setImages} 
          />

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Hiển thị sản phẩm
            </label>
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <LoadingButton
              type="submit"
              isLoading={loading || uploadingImage}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              {product ? 'Cập nhật' : 'Tạo mới'}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;