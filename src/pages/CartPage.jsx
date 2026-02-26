import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Tag,
} from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCartContext();
  const [couponCode, setCouponCode] = useState('');

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);

  const handleCheckout = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Vui lòng đăng nhập để thanh toán!');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const discount = 0; // Có thể mở rộng tính năng mã giảm giá sau
  const shipping = totalPrice >= 1000000 ? 0 : 30000;
  const finalTotal = totalPrice - discount + shipping;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* Page content — padding-top để tránh bị header đè */}
      <div className="flex-1 pt-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <a href="/" className="hover:text-indigo-600 transition-colors">Trang chủ</a>
              <span>/</span>
              <span className="text-gray-900 font-medium">Giỏ hàng</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingCart className="h-24 w-24 text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-500 mb-8">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-md"
            >
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Sản phẩm ({totalItems})
                </h2>
                <button
                  onClick={() => {
                    clearCart();
                    toast.success('Đã xóa toàn bộ giỏ hàng');
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Xóa tất cả</span>
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 shadow-sm"
                >
                  {/* Image */}
                  <div
                    className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer leading-snug line-clamp-2"
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      {item.name}
                    </h3>

                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-indigo-600 font-bold text-lg">
                        {formatPrice(item.price)}₫
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-gray-400 text-sm line-through">
                          {formatPrice(item.originalPrice)}₫
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-4 py-1.5 text-sm font-semibold border-x border-gray-300 min-w-[44px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQuantity}
                          className="px-3 py-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Subtotal + Delete */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 font-medium">
                          = <span className="text-gray-900 font-bold">{formatPrice(item.price * item.quantity)}₫</span>
                        </span>
                        <button
                          onClick={() => {
                            removeFromCart(item.productId);
                            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24 space-y-4">
                <h2 className="text-lg font-bold text-gray-900 border-b pb-3">Tóm tắt đơn hàng</h2>

                {/* Coupon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mã giảm giá
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => toast('Tính năng mã giảm giá sắp ra mắt!', { icon: '🎟️' })}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Tag className="h-4 w-4" />
                      <span>Áp dụng</span>
                    </button>
                  </div>
                </div>

                {/* Summary Lines */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({totalItems} sản phẩm)</span>
                    <span>{formatPrice(totalPrice)}₫</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'Miễn phí' : `${formatPrice(shipping)}₫`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span>-{formatPrice(discount)}₫</span>
                    </div>
                  )}
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400">
                      Miễn phí vận chuyển cho đơn hàng từ 1.000.000₫
                    </p>
                  )}
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base">Tổng cộng</span>
                  <span className="text-xl font-bold text-indigo-600">
                    {formatPrice(finalTotal)}₫
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md text-base"
                >
                  Tiến hành thanh toán
                </button>

                <p className="text-xs text-center text-gray-400">
                  Thanh toán an toàn và bảo mật 🔒
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default CartPage;
