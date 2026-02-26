import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, ChevronRight, Eye, XCircle, Search,
  ShoppingBag, Loader2, RefreshCw, Clock, CheckCircle,
  Truck, AlertCircle, Home,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  PENDING:    { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  CONFIRMED:  { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-700 border-blue-200',       icon: CheckCircle },
  PROCESSING: { label: 'Đang xử lý',   color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: RefreshCw },
  SHIPPING:   { label: 'Đang giao',    color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
  DELIVERED:  { label: 'Đã giao',      color: 'bg-teal-100 text-teal-700 border-teal-200',        icon: CheckCircle },
  COMPLETED:  { label: 'Hoàn thành',   color: 'bg-green-100 text-green-700 border-green-200',    icon: CheckCircle },
  CANCELLED:  { label: 'Đã hủy',       color: 'bg-red-100 text-red-700 border-red-200',          icon: XCircle },
  RETURNED:   { label: 'Đã trả hàng',  color: 'bg-gray-100 text-gray-600 border-gray-200',       icon: RefreshCw },
};

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = useCallback(async (pageNum = 0) => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const data = await orderService.getMyOrders(pageNum, 10);
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(pageNum);
    } catch (err) {
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchOrders(0);
  }, [isLoggedIn, fetchOrders, navigate]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    setCancellingId(orderId);
    try {
      await orderService.cancelOrder(orderId, 'Khách hàng yêu cầu hủy');
      toast.success('Đã hủy đơn hàng');
      fetchOrders(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể hủy đơn hàng');
    } finally {
      setCancellingId(null);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN').format(price) + '₫';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const filteredOrders = selectedStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.status === selectedStatus);

  const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-600 border-gray-200', icon: Package };
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
        <Icon className="h-3 w-3" />
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center text-sm text-gray-500 space-x-2">
              <button onClick={() => navigate('/')} className="hover:text-indigo-600 transition-colors">Trang chủ</button>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-800 font-medium">Đơn hàng của tôi</span>
            </nav>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-7 w-7 text-indigo-600" />
              Đơn hàng của tôi
            </h1>
            <button
              onClick={() => fetchOrders(page)}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </button>
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {[
              { value: 'ALL', label: 'Tất cả' },
              { value: 'PENDING', label: 'Chờ xác nhận' },
              { value: 'CONFIRMED', label: 'Đã xác nhận' },
              { value: 'SHIPPING', label: 'Đang giao' },
              { value: 'COMPLETED', label: 'Hoàn thành' },
              { value: 'CANCELLED', label: 'Đã hủy' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedStatus === tab.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-3" />
              <p className="text-gray-500">Đang tải đơn hàng...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100">
              <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
              <p className="text-lg font-medium text-gray-500 mb-2">Chưa có đơn hàng nào</p>
              <p className="text-sm text-gray-400 mb-6">
                {selectedStatus !== 'ALL' ? 'Không có đơn hàng với trạng thái này' : 'Hãy bắt đầu mua sắm!'}
              </p>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Home className="h-4 w-4" />
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Order Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-sm font-bold text-gray-800">#{order.orderNumber}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                      <p className="text-base font-bold text-indigo-700">{formatPrice(order.finalAmount)}</p>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="px-5 py-4">
                    {order.orderItems?.slice(0, expandedOrder === order.id ? undefined : 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 mb-3 last:mb-0">
                        {item.productImageUrl && (
                          <img
                            src={item.productImageUrl}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 line-clamp-1">{item.productName}</p>
                          <p className="text-xs text-gray-400">x{item.quantity} — {formatPrice(item.unitPrice)}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                          {formatPrice(item.totalPrice)}
                        </p>
                      </div>
                    ))}
                    {order.orderItems?.length > 2 && (
                      <button
                        className="mt-2 text-xs text-indigo-600 hover:underline"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        {expandedOrder === order.id
                          ? 'Thu gọn'
                          : `Xem thêm ${order.orderItems.length - 2} sản phẩm...`}
                      </button>
                    )}
                  </div>

                  {/* Address & Payment */}
                  <div className="bg-gray-50 px-5 py-3 text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span>🚚 {order.fullShippingAddress || [order.shippingAddress, order.shippingDistrict, order.shippingProvince].filter(Boolean).join(', ')}</span>
                    <span className="hidden sm:block text-gray-300">|</span>
                    <span>💳 {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận' : 'Chuyển khoản'}</span>
                  </div>

                  {/* Actions */}
                  <div className="px-5 py-4 flex flex-wrap gap-2 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/my-orders/${order.id}`)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Xem chi tiết
                    </button>

                    {order.canBeCancelled && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-60"
                      >
                        {cancellingId === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => fetchOrders(i)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    page === i
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default MyOrdersPage;
