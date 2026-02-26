import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Tags
} from 'lucide-react';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, current: location.pathname === '/admin/dashboard' },
    { name: 'Quản lý User', href: '/admin/users', icon: Users, current: location.pathname === '/admin/users' },
    { name: 'Quản lý Sản phẩm', href: '/admin/products', icon: Package, current: location.pathname === '/admin/products' },
    { name: 'Quản lý Danh mục', href: '/admin/categories', icon: Tags, current: location.pathname === '/admin/categories' },
    { name: 'Quản lý Đơn hàng', href: '/admin/orders', icon: ShoppingCart, current: location.pathname === '/admin/orders' },
    { name: 'Cài đặt', href: '/admin/settings', icon: Settings, current: location.pathname === '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl pt-5 pb-4 overflow-y-auto relative">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
          
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 relative z-10">
            <div className="flex items-center group cursor-pointer">
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Billiard Admin  
                </span>
                <div className="text-xs text-gray-500 font-medium">Control Panel</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-3 space-y-2 relative z-10">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
                  } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm border border-white/10`}
                >
                  <Icon
                    className={`${
                      item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                    } mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-300`}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.current && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                    </div>
                  )}
                  <ChevronRight className={`ml-2 h-4 w-4 transition-all duration-300 ${
                    item.current ? 'text-white transform rotate-90' : 'text-gray-400 group-hover:text-gray-500 group-hover:translate-x-1'
                  }`} />
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="flex-shrink-0 px-3 relative z-10">
            {/* User Profile Card */}
            <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200/50 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">Admin</p>
                  <p className="text-xs text-gray-500 truncate">Super Administrator</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-red-200/50 hover:shadow-md"
            >
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
              <span className="flex-1 text-left">Đăng xuất</span>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden`}>
        <div className="flex flex-col h-full relative">
          {/* Gradient overlay for mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
          
          {/* Mobile header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/20 relative z-10">
            <div className="flex items-center">
              <div className="relative">
                <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-1.5 w-1.5 text-white" />
                </div>
              </div>
              <span className="ml-3 text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Billiard Admin
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto relative z-10">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`${
                    item.current
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
                  } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10`}
                >
                  <Icon
                    className={`${
                      item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                    } mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-300`}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.current && (
                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile logout */}
          <div className="p-3 border-t border-white/20 relative z-10">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-300 border border-transparent hover:border-red-200/50 hover:shadow-md"
            >
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
              <span className="flex-1 text-left">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;