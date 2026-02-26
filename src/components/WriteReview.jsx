import React, { useState } from 'react';
import { Star, X, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const WriteReview = ({ product, isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('Chỉ được tải lên tối đa 5 hình ảnh');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          file: file,
          url: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Nội dung đánh giá phải có ít nhất 10 ký tự');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        productId: product.id,
        rating: rating,
        comment: comment.trim(),
        images: images.map(img => img.file)
      };

      // Simulate API call - replace with actual API call later
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Đánh giá của bạn đã được gửi thành công!');
      
      // Reset form
      setRating(0);
      setComment('');
      setImages([]);
      
      if (onSubmit) {
        onSubmit(reviewData);
      }
      
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              starValue <= (hoverRating || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          />
        </button>
      );
    });
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Rất không hài lòng';
      case 2: return 'Không hài lòng';
      case 3: return 'Bình thường';
      case 4: return 'Hài lòng';
      case 5: return 'Rất hài lòng';
      default: return 'Chọn số sao để đánh giá';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Viết đánh giá</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={product?.images?.[0] || '/placeholder-product.jpg'}
              alt={product?.name}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/placeholder-product.jpg';
              }}
            />
            <div>
              <h3 className="font-medium text-gray-900">{product?.name}</h3>
              <p className="text-sm text-gray-500">SKU: {product?.sku}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Đánh giá của bạn *
              </label>
              <div className="flex items-center space-x-2 mb-2">
                {renderStars()}
              </div>
              <p className="text-sm text-gray-600">
                {getRatingText(hoverRating || rating)}
              </p>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Chia sẻ trải nghiệm của bạn *
              </label>
              <textarea
                id="comment"
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này. Đánh giá chi tiết sẽ giúp người mua khác có thêm thông tin hữu ích..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs text-gray-500">Tối thiểu 10 ký tự</p>
                <p className="text-xs text-gray-500">{comment.length}/1000</p>
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thêm hình ảnh (tùy chọn)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Chọn hình ảnh hoặc kéo thả vào đây
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tối đa 5 ảnh, mỗi ảnh không quá 5MB
                  </p>
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt="Preview"
                        className="w-full h-16 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <span>Gửi đánh giá</span>
                )}
              </button>
            </div>
          </form>

          {/* Guidelines */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Hướng dẫn viết đánh giá
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Chia sẻ trải nghiệm thực tế của bạn với sản phẩm</li>
              <li>• Đề cập đến chất lượng, thiết kế, và giá trị sản phẩm</li>
              <li>• Tránh ngôn từ không phù hợp hoặc thông tin cá nhân</li>
              <li>• Hình ảnh thực tế sẽ giúp đánh giá của bạn hữu ích hơn</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;