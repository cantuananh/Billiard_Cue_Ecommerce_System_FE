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
  Zap,
  Package,
  Tag,
  ShoppingCart,
  Clock,
  X,
  Check,
  Trash2,
  Star
} from 'lucide-react';

const AdminHeader = ({ setSidebarOpen }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [messagesMenuOpen, setMessagesMenuOpen] = useState(false);
  const [favoritesMenuOpen, setFavoritesMenuOpen] = useState(false);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  
  const userMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const messagesMenuRef = useRef(null);
  const favoritesMenuRef = useRef(null);
  const searchMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const messagesButtonRef = useRef(null);
  const favoritesButtonRef = useRef(null);
  const searchInputRef = useRef(null);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Mock data
  const [favorites, setFavorites] = useState([
    { id: 1, name: 'Cơ Predator BK Rush', type: 'product', price: '12,500,000đ', image: '🎱' },
    { id: 2, name: 'Bàn Billiard Brunswick Gold Crown', type: 'product', price: '85,000,000đ', image: '🎯' },
    { id: 3, name: 'Phấn Tiger Onyx', type: 'product', price: '450,000đ', image: '⭐' },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, from: 'Nguyễn Văn A', avatar: '👤', message: 'Sản phẩm còn hàng không ạ?', time: '2 phút trước', unread: true },
    { id: 2, from: 'Trần Thị B', avatar: '👩', message: 'Cho em hỏi về chính sách đổi trả', time: '15 phút trước', unread: true },
    { id: 3, from: 'Lê Văn C', avatar: '👨', message: 'Cảm ơn shop, đã nhận hàng', time: '1 giờ trước', unread: false },
  ]);

  const searchSuggestions = [
    { id: 1, name: 'Quản lý sản phẩm', type: 'page', icon: Package, path: '/admin/products' },
    { id: 2, name: 'Quản lý đơn hàng', type: 'page', icon: ShoppingCart, path: '/admin/orders' },
    { id: 3, name: 'Quản lý user', type: 'page', icon: User, path: '/admin/users' },
    { id: 4, name: 'Danh mục', type: 'page', icon: Tag, path: '/admin/categories' },
  ];

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
      if (messagesMenuRef.current && !messagesMenuRef.current.contains(event.target) &&
          messagesButtonRef.current && !messagesButtonRef.current.contains(event.target)) {
        setMessagesMenuOpen(false);
      }
      if (favoritesMenuRef.current && !favoritesMenuRef.current.contains(event.target) &&
          favoritesButtonRef.current && !favoritesButtonRef.current.contains(event.target)) {
        setFavoritesMenuOpen(false);
      }
      if (searchMenuRef.current && !searchMenuRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setSearchMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 0) {
      setSearchMenuOpen(true);
    } else {
      setSearchMenuOpen(false);
    }
  };

  // Handle remove favorite
  const removeFavorite = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  // Handle mark message as read
  const markAsRead = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, unread: false } : msg
    ));
  };

  const unreadMessagesCount = messages.filter(msg => msg.unread).length;

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
          <div className="ml-4 flex-1 max-w-lg relative">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Tìm kiếm tất cả ở đây..."
                className="block w-full pl-12 pr-10 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/80 sm:text-sm shadow-sm hover:shadow-md transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchMenuOpen(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {!searchQuery && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ⌘K
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3 relative z-10">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Favorites */}
            <button 
              ref={favoritesButtonRef}
              onClick={() => {
                updateDropdownPosition(favoritesButtonRef);
                setFavoritesMenuOpen(!favoritesMenuOpen);
              }}
              className="relative p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {favorites.length}
                </span>
              )}
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                Yêu thích
              </span>
            </button>
            
            {/* Messages */}
            <button 
              ref={messagesButtonRef}
              onClick={() => {
                updateDropdownPosition(messagesButtonRef);
                setMessagesMenuOpen(!messagesMenuOpen);
              }}
              className="relative p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <MessageSquare className="h-5 w-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unreadMessagesCount}
                </span>
              )}
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                Tin nhắn
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
              className="relative p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                3
              </span>
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                Thông báo
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

      {/* Search suggestions dropdown */}
      {searchMenuOpen && createPortal(
        <div 
          ref={searchMenuRef}
          className="fixed w-96 bg-white rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999] ml-4"
          style={{
            top: '80px',
            left: searchInputRef.current ? searchInputRef.current.getBoundingClientRect().left : '0px'
          }}
        >
          <div className="p-4">
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gợi ý tìm kiếm</p>
            </div>
            
            <div className="space-y-1">
              {searchSuggestions
                .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.path}
                      className="flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-xl transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                        <IconComponent className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.type === 'page' ? 'Trang quản lý' : 'Sản phẩm'}</p>
                      </div>
                      <Search className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  );
                })}
            </div>
            
            {searchQuery && (
              <div className="pt-3 border-t border-gray-200 mt-3">
                <button className="block w-full text-left px-3 py-2 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium">
                  Xem tất cả kết quả cho "{searchQuery}"
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Favorites dropdown portal */}
      {favoritesMenuOpen && createPortal(
        <div 
          ref={favoritesMenuRef}
          className="fixed w-80 bg-white rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999]"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-900">Yêu thích</h3>
              </div>
              <span className="px-2.5 py-1 bg-pink-100 text-pink-600 text-xs font-medium rounded-full">
                {favorites.length} mục
              </span>
            </div>
            
            {favorites.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {favorites.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.type === 'product' ? 'Sản phẩm' : 'Khác'}</p>
                      <p className="text-sm font-semibold text-pink-600 mt-0.5">{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Chưa có mục yêu thích nào</p>
              </div>
            )}
            
            {favorites.length > 0 && (
              <div className="pt-3 border-t border-gray-200 mt-3">
                <a href="#" className="block w-full text-center px-3 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg transition-colors">
                  Xem tất cả yêu thích
                </a>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Messages dropdown portal */}
      {messagesMenuOpen && createPortal(
        <div 
          ref={messagesMenuRef}
          className="fixed w-96 bg-white rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999]"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Tin nhắn</h3>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="px-2.5 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                  {unreadMessagesCount} mới
                </span>
              )}
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                    message.unread ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => markAsRead(message.id)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {message.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium ${message.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                        {message.from}
                      </p>
                      {message.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className={`text-sm ${message.unread ? 'text-gray-700 font-medium' : 'text-gray-500'} line-clamp-2`}>
                      {message.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {message.time}
                      </p>
                      {message.unread && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(message.id);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t border-gray-200 mt-3 flex gap-2">
              <a href="#" className="flex-1 text-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                Xem tất cả
              </a>
              {unreadMessagesCount > 0 && (
                <button
                  onClick={() => {
                    setMessages(messages.map(msg => ({ ...msg, unread: false })));
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Đánh dấu tất cả
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Notification dropdown portal */}
      {notificationMenuOpen && createPortal(
        <div 
          ref={notificationMenuRef}
          className="fixed w-96 bg-white rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999]"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
              </div>
              <span className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                3 mới
              </span>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[
                { 
                  title: 'Người dùng mới đăng ký', 
                  desc: 'Nguyễn Văn A vừa tạo tài khoản', 
                  time: '5 phút trước',
                  icon: User,
                  color: 'from-blue-400 to-indigo-500'
                },
                { 
                  title: 'Đơn hàng mới', 
                  desc: 'Đơn hàng #12345 cần xử lý', 
                  time: '10 phút trước',
                  icon: ShoppingCart,
                  color: 'from-green-400 to-emerald-500'
                },
                { 
                  title: 'Tin nhắn mới', 
                  desc: 'Khách hàng gửi phản hồi', 
                  time: '15 phút trước',
                  icon: MessageSquare,
                  color: 'from-purple-400 to-pink-500'
                }
              ].map((notification, index) => {
                const NotifIcon = notification.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer group">
                    <div className={`w-10 h-10 bg-gradient-to-br ${notification.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <NotifIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-0.5">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">{notification.desc}</p>
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
                  </div>
                );
              })}
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