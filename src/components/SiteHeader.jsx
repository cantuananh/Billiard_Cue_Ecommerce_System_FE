import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogIn, UserPlus, ShoppingCart, Menu, X, Package } from 'lucide-react';
import { useCartContext } from '../context/CartContext';

const SiteHeader = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, openCart } = useCartContext();

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoggedIn = !!localStorage.getItem('accessToken');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/90'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group cursor-pointer">
            <div className="relative">
              <ShoppingBag className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse"></div>
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BilliardCue Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              { label: 'Sản phẩm', href: '/#products' },
              { label: 'Thương hiệu', href: '/#brands' },
              { label: 'Giới thiệu', href: '/#about' },
              { label: 'Liên hệ', href: '/#contact' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-gray-600 hover:text-indigo-600 font-medium transition-all duration-300 group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              {/* Cart Icon */}
              <button
                onClick={openCart}
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {isLoggedIn ? (
                <>
                  <span className="text-gray-600 font-medium text-sm">
                    Xin chào, {currentUser?.fullName || 'Khách hàng'}
                  </span>
                  <Link
                    to="/my-orders"
                    className="flex items-center text-gray-600 hover:text-indigo-600 font-medium transition-all duration-300 group"
                  >
                    <Package className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform" />
                    Đơn hàng
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-600 hover:text-red-600 font-medium transition-all duration-300 group"
                  >
                    <LogIn className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform rotate-180" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center text-gray-600 hover:text-indigo-600 font-medium transition-all duration-300 group"
                  >
                    <LogIn className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-t shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {['Sản phẩm', 'Thương hiệu', 'Giới thiệu', 'Liên hệ'].map((item) => (
              <a
                key={item}
                href={`/#${item.toLowerCase()}`}
                className="block text-gray-600 hover:text-indigo-600 font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            {/* Mobile Cart */}
            <button
              onClick={() => { setIsMenuOpen(false); openCart(); }}
              className="flex items-center w-full text-gray-600 hover:text-indigo-600 font-medium py-2 transition-colors"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Giỏ hàng {totalItems > 0 && `(${totalItems})`}
            </button>
            <div className="flex flex-col space-y-3 pt-4 border-t">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center text-red-500 font-medium py-2 transition-colors"
                >
                  Đăng xuất
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center justify-center text-gray-600 hover:text-indigo-600 font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
