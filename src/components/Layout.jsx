import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, UserPlus, LogIn, Menu, X,
  MessageCircle, Phone, Mail, MapPin, Facebook, 
  Instagram, Twitter, Youtube
} from 'lucide-react';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/90'
      }`}>
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
                { name: 'Sản phẩm', href: '/#products' },
                { name: 'Thương hiệu', href: '/#brands' },
                { name: 'Giới thiệu', href: '/#about' },
                { name: 'Liên hệ', href: '/#contact' }
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="relative text-gray-600 hover:text-indigo-600 font-medium transition-all duration-300 group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>
            
            {/* Auth Buttons & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
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
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-all duration-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg border-t">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation */}
              <div className="space-y-3">
                {[
                  { name: 'Sản phẩm', href: '/#products' },
                  { name: 'Thương hiệu', href: '/#brands' },
                  { name: 'Giới thiệu', href: '/#about' },
                  { name: 'Liên hệ', href: '/#contact' }
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="block text-gray-600 hover:text-indigo-600 font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t space-y-3">
                <Link
                  to="/login"
                  className="flex items-center text-gray-600 hover:text-indigo-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4 mr-3" />
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="h-4 w-4 mr-3" />
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <ShoppingBag className="h-8 w-8 text-indigo-400" />
                <span className="ml-3 text-xl font-bold">BilliardCue Store</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Chuyên cung cấp các sản phẩm gậy bi-a chất lượng cao từ các thương hiệu nổi tiếng thế giới. 
                Cam kết mang đến cho khách hàng những sản phẩm tốt nhất với giá cả hợp lý.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Liên kết nhanh</h3>
              <ul className="space-y-3">
                {['Sản phẩm', 'Thương hiệu', 'Giới thiệu', 'Liên hệ', 'Chính sách bảo hành', 'Hướng dẫn mua hàng'].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Liên hệ</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-400">
                  <MapPin className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span>0123 456 789</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <Mail className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span>info@billiardcue.com</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <MessageCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span>Live Chat 24/7</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="py-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 BilliardCue Store. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Chính sách bảo mật
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Điều khoản sử dụng
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;