import React, { useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose, cartItems, updateQuantity, removeFromCart, totalItems, totalPrice }) => {
  const navigate = useNavigate();

  // Khoá scroll khi drawer mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN').format(price);

  const handleGoToCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-white">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Giỏ hàng</h2>
            {totalItems > 0 && (
              <span className="ml-1 bg-indigo-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-20 w-20 text-gray-200 mb-4" />
              <p className="text-gray-500 text-lg font-medium">Giỏ hàng trống</p>
              <p className="text-gray-400 text-sm mt-1">Thêm sản phẩm vào giỏ hàng để tiếp tục</p>
              <button
                onClick={onClose}
                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-full transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                {/* Image */}
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border bg-white">
                  <img
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                    {item.name}
                  </p>
                  <p className="text-indigo-600 font-bold mt-1 text-sm">
                    {formatPrice(item.price)}₫
                  </p>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <p className="text-gray-400 text-xs line-through">
                      {formatPrice(item.originalPrice)}₫
                    </p>
                  )}

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2.5 py-1 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium border-x border-gray-300 min-w-[36px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stockQuantity}
                        className="px-2.5 py-1 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t bg-white px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Tổng số lượng:</span>
              <span className="font-medium">{totalItems} sản phẩm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Tổng tiền:</span>
              <span className="text-xl font-bold text-indigo-600">
                {formatPrice(totalPrice)}₫
              </span>
            </div>
            <button
              onClick={handleGoToCart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-md"
            >
              <span>Xem giỏ hàng & Thanh toán</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
