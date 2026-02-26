import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle, ShoppingBag, MapPin, CreditCard, Truck,
  ArrowRight, Home, Package,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN').format(price) + '₫';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const paymentMethodLabel = (method) => {
    switch (method) {
      case 'COD': return 'Thanh toán khi nhận hàng (COD)';
      case 'BANK_TRANSFER': return 'Chuyển khoản ngân hàng';
      default: return method;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Banner */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
            <p className="text-gray-500 mb-1">
              Cảm ơn bạn đã tin tưởng mua hàng tại <span className="font-semibold text-indigo-600">BilliardCue Store</span>
            </p>
            {order?.orderNumber && (
              <p className="text-sm text-gray-400">
                Mã đơn hàng: <span className="font-bold text-gray-700">#{order.orderNumber}</span>
              </p>
            )}
            {order?.createdAt && (
              <p className="text-sm text-gray-400 mt-1">
                Thời gian đặt: {formatDate(order.createdAt)}
              </p>
            )}
          </div>

          {order && (
            <>
              {/* Order Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-indigo-600" />
                  Chi tiết đơn hàng
                </h2>

                {/* Items */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                        {item.productImageUrl && (
                          <img
                            src={item.productImageUrl}
                            alt={item.productName}
                            className="w-14 h-14 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.productName}</p>
                          <p className="text-xs text-gray-500">x{item.quantity} — {formatPrice(item.unitPrice)}</p>
                        </div>
                        <p className="text-sm font-semibold text-indigo-600 flex-shrink-0">
                          {formatPrice(item.totalPrice)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price Summary */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className={order.shippingFee === 0 ? 'text-green-600' : ''}>
                      {order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee)}
                    </span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá</span>
                      <span>-{formatPrice(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-3 border-t border-gray-200">
                    <span>Tổng cộng</span>
                    <span className="text-indigo-700">{formatPrice(order.finalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping + Payment Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    Địa chỉ giao hàng
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-800">{order.shippingName}</p>
                    <p>{order.shippingPhone}</p>
                    <p>{order.fullShippingAddress || [order.shippingAddress, order.shippingWard, order.shippingDistrict, order.shippingProvince].filter(Boolean).join(', ')}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-600" />
                    Thanh toán
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium">{paymentMethodLabel(order.paymentMethod)}</p>
                    <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'PAID'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
                <Truck className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-indigo-800">Trạng thái: {order.statusDisplayName || order.status}</p>
                  <p className="text-xs text-indigo-600 mt-1">
                    Chúng tôi sẽ xác nhận và giao hàng đến bạn sớm nhất có thể. Theo dõi đơn hàng của bạn trong mục "Đơn hàng của tôi".
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/my-orders')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              <Package className="h-5 w-5" />
              Xem đơn hàng của tôi
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              <Home className="h-5 w-5" />
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default OrderSuccessPage;
