import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, LogOut, Settings, Package, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    authService.logout();
    toast.success('Đăng xuất thành công!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
              <Link to="/" className="ml-2 text-xl font-bold text-gray-900">
                BilliardCue Store
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Xin chào, {user.firstName} {user.lastName}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                <LogOut className="h-5 w-5 inline mr-1" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Quản lý tài khoản và đơn hàng của bạn</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-full p-3">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Tham gia từ: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Management */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Settings className="h-8 w-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 ml-3">
                Quản lý thông tin
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Cập nhật thông tin cá nhân, đổi mật khẩu và quản lý tài khoản
            </p>
            <Link
              to="/profile"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Chỉnh sửa profile →
            </Link>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Package className="h-8 w-8 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 ml-3">
                Đơn hàng
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Xem lịch sử đơn hàng, theo dõi trạng thái giao hàng
            </p>
            <Link
              to="/orders"
              className="text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              Xem đơn hàng →
            </Link>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 ml-3">
                Địa chỉ giao hàng
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Quản lý địa chỉ giao hàng, thêm địa chỉ mới
            </p>
            <Link
              to="/addresses"
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              Quản lý địa chỉ →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Mua sắm ngay
            </Link>
            <Link
              to="/profile"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cập nhật thông tin
            </Link>
            <Link
              to="/support"
              className="bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Hỗ trợ khách hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;