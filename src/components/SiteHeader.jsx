import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogIn, UserPlus, ShoppingCart, Menu, X, Package, LogOut, ChevronDown, User } from 'lucide-react';
import { useCartContext } from '../context/CartContext';

const SiteHeader = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { totalItems, openCart } = useCartContext();
  const userMenuRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const initials = currentUser?.fullName
    ? currentUser.fullName.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase()
    : 'U';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsUserMenuOpen(false);
    navigate('/');
    window.location.reload();
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const navItems = [
    { label: 'Sản phẩm', id: 'products' },
    { label: 'Thương hiệu', id: 'about' },
    { label: 'Giới thiệu', id: 'about' },
    { label: 'Liên hệ', to: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center group cursor-pointer flex-shrink-0">
            <div className="relative">
              <ShoppingBag className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse"></div>
            </div>
            <span className="ml-2.5 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BilliardCue Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => item.to ? navigate(item.to) : scrollToSection(item.id)}
                className="relative px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-all duration-200 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-4/5 rounded-full transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200"
              title="Giỏ hàng"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-md">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              /* User dropdown */
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                    {initials}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs text-gray-400 leading-none">Xin chào</p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight max-w-[120px] truncate">
                      {currentUser?.fullName || 'Khách hàng'}
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                    {/* User info */}
                    <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[130px]">
                            {currentUser?.fullName || 'Khách hàng'}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[130px]">{currentUser?.email || ''}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5">
                      <Link
                        to="/my-orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        Đơn hàng của tôi
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 py-1.5">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest buttons */
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold py-2 px-5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <UserPlus className="h-4 w-4" />
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-100 shadow-2xl">
          <div className="px-4 py-5 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setIsMenuOpen(false);
                  item.to ? navigate(item.to) : scrollToSection(item.id);
                }}
                className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium rounded-xl transition-all"
              >
                {item.label}
              </button>
            ))}

            <div className="pt-2 border-t border-gray-100 space-y-1">
              <button
                onClick={() => { setIsMenuOpen(false); openCart(); }}
                className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium rounded-xl transition-all gap-3"
              >
                <ShoppingCart className="h-4 w-4" />
                Giỏ hàng {totalItems > 0 && <span className="ml-auto bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">{totalItems}</span>}
              </button>

              {isLoggedIn ? (
                <>
                  {/* Mobile user info */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{currentUser?.fullName || 'Khách hàng'}</p>
                      <p className="text-xs text-gray-500">{currentUser?.email || ''}</p>
                    </div>
                  </div>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium rounded-xl transition-all"
                  >
                    <Package className="h-4 w-4" />
                    Đơn hàng của tôi
                  </Link>
                  <button
                    onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 font-medium rounded-xl transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <LogIn className="h-4 w-4" />
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                  >
                    <UserPlus className="h-4 w-4" />
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
