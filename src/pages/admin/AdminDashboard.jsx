import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Clock,
  Truck,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import adminOrderService from '../../services/adminOrderService';
import { adminUserService } from '../../services/adminUserService';
import { adminProductService } from '../../services/adminProductService';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    shippingOrders: 0,
    recentOrders: [],
    ordersByStatus: {}
  });
  const [userStats, setUserStats] = useState({ totalElements: 0 });
  const [productStats, setProductStats] = useState({ totalElements: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats from order service
      const orderStats = await adminOrderService.getDashboardStats();
      setDashboardStats(orderStats);

      // Fetch user statistics
      try {
        const users = await adminUserService.getAllUsers({ page: 0, size: 1 }); // Just get first page to get total count
        setUserStats(users);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }

      // Fetch product statistics
      try {
        const products = await adminProductService.getAllProducts({ page: 0, size: 1 }); // Just get first page to get total count
        setProductStats(products);
      } catch (error) {
        console.error('Error fetching product stats:', error);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getOrderStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Chờ xác nhận' },
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, text: 'Đã xác nhận' },
      PROCESSING: { color: 'bg-indigo-100 text-indigo-800', icon: Package, text: 'Đang xử lý' },
      SHIPPING: { color: 'bg-purple-100 text-purple-800', icon: Truck, text: 'Đang giao hàng' },
      DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Đã giao hàng' },
      COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Hoàn thành' },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Đã hủy' },
      RETURNED: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Đã trả hàng' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const stats = [
    {
      name: 'Tổng người dùng',
      value: userStats.totalElements || 0,
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Tổng sản phẩm',
      value: productStats.totalElements || 0,
      change: '+5%',
      changeType: 'increase',
      icon: Package,
      color: 'bg-green-500'
    },
    {
      name: 'Tổng đơn hàng',
      value: dashboardStats.totalOrders || 0,
      change: '+23%',
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'bg-yellow-500'
    },
    {
      name: 'Tổng doanh thu',
      value: formatCurrency(dashboardStats.totalRevenue || 0),
      change: '+15%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Chào mừng bạn quay trở lại! Đây là tổng quan về hệ thống.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="relative bg-white pt-5 px-4 pb-4 sm:pt-6 sm:px-6 rounded-lg shadow overflow-hidden"
            >
              <dt>
                <div className={`absolute ${item.color} rounded-md p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {item.value}
                </p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.changeType === 'increase' ? (
                    <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                  )}
                  <span className="sr-only">
                    {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                  </span>
                  {item.change}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Đơn hàng gần đây ({dashboardStats.recentOrders?.length || 0})
            </h3>
            <div className="overflow-hidden">
              {dashboardStats.recentOrders && dashboardStats.recentOrders.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đơn hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá trị
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardStats.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(order.finalAmount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.totalItems} sản phẩm
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getOrderStatusBadge(order.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có đơn hàng</h3>
                  <p className="mt-1 text-sm text-gray-500">Chưa có đơn hàng nào được tạo.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Thống kê đơn hàng theo trạng thái
            </h3>
            <div className="space-y-4">
              {Object.entries(dashboardStats.ordersByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getOrderStatusBadge(status)}
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {count}
                  </div>
                </div>
              ))}
              
              {Object.keys(dashboardStats.ordersByStatus || {}).length === 0 && (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có dữ liệu</h3>
                  <p className="mt-1 text-sm text-gray-500">Chưa có đơn hàng nào để thống kê.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-gray-400" />
            Hoạt động gần đây
          </h3>
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <Users className="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Người dùng mới <span className="font-medium text-gray-900">Nguyễn Văn E</span> đã đăng ký
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>5 phút trước</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <ShoppingCart className="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Đơn hàng mới <span className="font-medium text-gray-900">#ORD-005</span> đã được tạo
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>15 phút trước</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div className="relative">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white">
                        <Package className="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Sản phẩm <span className="font-medium text-gray-900">Cơ bi Premium</span> đã được cập nhật
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>1 giờ trước</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;