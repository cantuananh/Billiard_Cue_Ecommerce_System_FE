import React from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  Package, 
  Truck,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  Edit
} from 'lucide-react';

const OrderDetailModal = ({ isOpen, onClose, order, onStatusUpdate }) => {
  if (!isOpen || !order) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Chờ xác nhận' },
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, text: 'Đã xác nhận' },
      PROCESSING: { color: 'bg-indigo-100 text-indigo-800', icon: Package, text: 'Đang xử lý' },
      SHIPPING: { color: 'bg-purple-100 text-purple-800', icon: Truck, text: 'Đang giao hàng' },
      DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Đã giao hàng' },
      COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Hoàn thành' },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Đã hủy' },
      RETURNED: { color: 'bg-gray-100 text-gray-800', icon: ArrowUpDown, text: 'Đã trả hàng' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <IconComponent className="w-4 h-4 mr-2" />
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Chi tiết đơn hàng {order.orderNumber}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Tạo lúc: {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onStatusUpdate(order)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit className="h-4 w-4 mr-1" />
              Cập nhật trạng thái
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Trạng thái đơn hàng</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trạng thái hiện tại:</span>
                  {getStatusBadge(order.status)}
                </div>
                
                {order.trackingNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mã vận đơn:</span>
                    <span className="text-sm font-medium text-gray-900">{order.trackingNumber}</span>
                  </div>
                )}

                {order.shippedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ngày giao hàng:</span>
                    <span className="text-sm text-gray-900">{formatDate(order.shippedAt)}</span>
                  </div>
                )}

                {order.deliveredAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ngày nhận hàng:</span>
                    <span className="text-sm text-gray-900">{formatDate(order.deliveredAt)}</span>
                  </div>
                )}

                {order.cancelledAt && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ngày hủy:</span>
                      <span className="text-sm text-gray-900">{formatDate(order.cancelledAt)}</span>
                    </div>
                    {order.cancelReason && (
                      <div>
                        <span className="text-sm text-gray-600">Lý do hủy:</span>
                        <p className="text-sm text-gray-900 mt-1">{order.cancelReason}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Thông tin khách hàng
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Tên khách hàng:</span>
                  <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{order.customerPhone}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="text-sm text-gray-900">{order.customerEmail}</p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Thông tin giao hàng
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Người nhận:</span>
                  <p className="text-sm font-medium text-gray-900">{order.shippingName}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{order.shippingPhone}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Địa chỉ:</span>
                  <p className="text-sm text-gray-900">{order.fullShippingAddress}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Thông tin thanh toán
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phương thức:</span>
                  <span className="text-sm font-medium text-gray-900">{order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trạng thái thanh toán:</span>
                  <span className={`text-sm font-medium ${
                    order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
                {order.paidAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ngày thanh toán:</span>
                    <span className="text-sm text-gray-900">{formatDate(order.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Sản phẩm ({order.totalItems} sản phẩm)
              </h4>
              <div className="space-y-4">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      {item.productImageUrl ? (
                        <img
                          src={item.productImageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.productName}
                      </p>
                      {item.productSku && (
                        <p className="text-xs text-gray-500">SKU: {item.productSku}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">
                          {formatCurrency(item.unitPrice)} x {item.quantity}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Tổng kết đơn hàng</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tổng tiền hàng:</span>
                  <span className="text-sm text-gray-900">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phí vận chuyển:</span>
                  <span className="text-sm text-gray-900">{formatCurrency(order.shippingFee)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Giảm giá:</span>
                    <span className="text-sm text-red-600">-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Tổng thanh toán:</span>
                    <span className="text-base font-medium text-gray-900">{formatCurrency(order.finalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {(order.customerNotes || order.adminNotes) && (
              <div className="bg-white border rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Ghi chú
                </h4>
                <div className="space-y-3">
                  {order.customerNotes && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Ghi chú khách hàng:</span>
                      <p className="text-sm text-gray-900 mt-1">{order.customerNotes}</p>
                    </div>
                  )}
                  {order.adminNotes && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Ghi chú admin:</span>
                      <p className="text-sm text-gray-900 mt-1">{order.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;