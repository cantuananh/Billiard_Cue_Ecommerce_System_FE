import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Menu, 
  Bell, 
  Search, 
  ChevronDown, 
  User,
  Settings,
  LogOut,
  MessageSquare,
  Heart,
  Zap
} from 'lucide-react';

const AdminHeader = ({ setSidebarOpen }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  
  const userMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const notificationButtonRef = useRef(null);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Update dropdown position
  const updateDropdownPosition = (buttonRef) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right
      });
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target) && 
          userButtonRef.current && !userButtonRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target) &&
          notificationButtonRef.current && !notificationButtonRef.current.contains(event.target)) {
        setNotificationMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-white/20">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
        {/* Left side */}
        <div className="flex items-center relative z-10">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-white/60 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="ml-4 flex-1 max-w-lg">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm tất cả ở đây..."
                className="block w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/80 sm:text-sm shadow-sm hover:shadow-md transition-all duration-300"
              />
              {/* Search suggestions - could be expanded */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ⌘K
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3 relative z-10">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all duration-300 transform hover:scale-105 group">
              <Heart className="h-5 w-5" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Favorites
              </span>
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-105 group">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Messages
              </span>
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              ref={notificationButtonRef}
              onClick={() => {
                updateDropdownPosition(notificationButtonRef);
                setNotificationMenuOpen(!notificationMenuOpen);
              }}
              className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>


          </div>

          {/* User menu */}
          <div className="relative">
            <button
              ref={userButtonRef}
              onClick={() => {
                updateDropdownPosition(userButtonRef);
                setUserMenuOpen(!userMenuOpen);
              }}
              className="flex items-center max-w-xs text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user.fullName || `${user.firstName} ${user.lastName}` || 'Admin System'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.role?.toLowerCase() || 'Administrator'}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </button>


          </div>
        </div>
      </div>

      {/* Notification dropdown portal */}
      {notificationMenuOpen && createPortal(
        <div 
          ref={notificationMenuRef}
          className="fixed w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999]"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Thông báo</h3>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                3 mới
              </span>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {[
                { 
                  title: 'Người dùng mới đăng ký', 
                  desc: 'Nguyễn Văn A vừa tạo tài khoản', 
                  time: '5 phút trước',
                  icon: User 
                },
                { 
                  title: 'Đơn hàng mới', 
                  desc: 'Đơn hàng #12345 cần xử lý', 
                  time: '10 phút trước',
                  icon: Zap 
                },
                { 
                  title: 'Tin nhắn mới', 
                  desc: 'Khách hàng gửi phản hồi', 
                  time: '15 phút trước',
                  icon: MessageSquare 
                }
              ].map((notification, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <notification.icon className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600">{notification.desc}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t border-gray-200 mt-3">
              <a href="#" className="block w-full text-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                Xem tất cả thông báo
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* User dropdown portal */}
      {userMenuOpen && createPortal(
        <div 
          ref={userMenuRef}
          className="fixed w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999]"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
        >
          <div className="py-1">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm text-gray-900 font-medium">
                {user.fullName || `${user.firstName} ${user.lastName}` || 'Admin System'}
              </p>
              <p className="text-sm text-gray-500">{user.email || 'admin@gmail.com'}</p>
            </div>
            
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <User className="mr-3 h-4 w-4 text-gray-400" />
              Hồ sơ cá nhân
            </a>
            
            <a
              href="#"  
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="mr-3 h-4 w-4 text-gray-400" />
              Cài đặt
            </a>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-4 w-4 text-gray-400" />
              Đăng xuất
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminHeader;