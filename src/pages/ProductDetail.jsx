import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  Star, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import Layout from '../components/Layout';
import ReviewSection from '../components/ReviewSection';
import productService from '../services/productService';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Không thể tải thông tin sản phẩm');
      toast.error('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (increment) => {
    setQuantity(prev => {
      const newQuantity = prev + increment;
      if (newQuantity < 1) return 1;
      if (product && newQuantity > product.stockQuantity) return product.stockQuantity;
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    toast.success('Chuyển đến trang thanh toán');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getProductImage = (product, imageIndex = 0) => {
    if (product.images && product.images.length > 0) {
      return product.images[imageIndex]?.imageUrl || '/placeholder-product.jpg';
    }
    return product.imageUrl || '/placeholder-product.jpg';
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product?.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="text-gray-600">Đang tải...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sản phẩm không tồn tại</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const discount = calculateDiscount();
  const images = product.images || [];
  const currentImage = getProductImage(product, selectedImageIndex);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <button onClick={() => navigate('/')} className="hover:text-indigo-600">
                Trang chủ
              </button>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg border overflow-hidden">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
              
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discount}%
                  </span>
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === 0 ? images.length - 1 : prev - 1
                    )}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg border-2 overflow-hidden ${
                      selectedImageIndex === index 
                        ? 'border-indigo-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <div className="text-sm text-indigo-600 font-medium mb-2">
                {product.categoryName || 'Không có danh mục'}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating ? parseFloat(product.rating).toFixed(1) : '0.0'} 
                  ({product.reviewCount || 0} đánh giá)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-indigo-600">
                  {formatPrice(product.price)}₫
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}₫
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  Tiết kiệm {formatPrice(product.originalPrice - product.price)}₫
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${
                product.stockQuantity > 5 ? 'bg-green-500' :
                product.stockQuantity > 0 ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
              <span className="text-sm font-medium">
                {product.stockQuantity > 5 ? 'Còn hàng' :
                 product.stockQuantity > 0 ? `Chỉ còn ${product.stockQuantity} sản phẩm` :
                 'Hết hàng'}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stockQuantity > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stockQuantity}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            )}

            {/* Action Icons */}
            <div className="flex items-center space-x-4 pt-4 border-t">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 ${
                  isWishlisted ? 'text-red-500 border-red-200' : 'text-gray-600 border-gray-300'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>Yêu thích</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
                <Share2 className="h-5 w-5" />
                <span>Chia sẻ</span>
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck className="h-5 w-5 text-indigo-600" />
                <span>Miễn phí vận chuyển cho đơn hàng trên 1.000.000₫</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-indigo-600" />
                <span>Bảo hành chính hãng 12 tháng</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <RotateCcw className="h-5 w-5 text-indigo-600" />
                <span>Đổi trả trong 7 ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả sản phẩm</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-8">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông số kỹ thuật</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Mã sản phẩm</dt>
                <dd className="text-sm text-gray-900">{product.sku || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Danh mục</dt>
                <dd className="text-sm text-gray-900">{product.categoryName || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tình trạng</dt>
                <dd className="text-sm text-gray-900">
                  {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Số lượng tồn kho</dt>
                <dd className="text-sm text-gray-900">{product.stockQuantity}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      </div>
      
      {/* Reviews Section */}
      <ReviewSection product={product} />
    </Layout>
  );
};

export default ProductDetail;