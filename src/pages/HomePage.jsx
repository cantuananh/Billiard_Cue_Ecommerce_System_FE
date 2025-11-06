import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, UserPlus, LogIn, Star, Shield, Truck } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                BilliardCue Store
              </span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#products" className="text-gray-500 hover:text-gray-900 transition-colors">
                Sản phẩm
              </a>
              <a href="#brands" className="text-gray-500 hover:text-gray-900 transition-colors">
                Thương hiệu
              </a>
              <a href="#about" className="text-gray-500 hover:text-gray-900 transition-colors">
                Giới thiệu
              </a>
              <a href="#contact" className="text-gray-500 hover:text-gray-900 transition-colors">
                Liên hệ
              </a>
            </nav>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-900 font-medium transition-colors"
              >
                <LogIn className="h-5 w-5 inline mr-1" />
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <UserPlus className="h-5 w-5 inline mr-1" />
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Gậy Bi A Chất Lượng Cao
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Khám phá bộ sưu tập gậy bi a từ các thương hiệu nổi tiếng thế giới. 
              Chất lượng đảm bảo, giá cả hợp lý.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Mua sắm ngay
              </Link>
              <a
                href="#products"
                className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Xem sản phẩm
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi cam kết mang đến 
              những sản phẩm tốt nhất cho khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chất lượng đảm bảo
              </h3>
              <p className="text-gray-600">
                Tất cả sản phẩm đều được kiểm tra chất lượng nghiêm ngặt trước khi 
                đến tay khách hàng.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Giao hàng nhanh chóng
              </h3>
              <p className="text-gray-600">
                Giao hàng tận nơi trong vòng 24-48h tại Hà Nội và TP.HCM, 
                2-3 ngày tại các tỉnh khác.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Dịch vụ tận tâm
              </h3>
              <p className="text-gray-600">
                Đội ngũ tư vấn chuyên nghiệp, hỗ trợ khách hàng 24/7 
                qua hotline và chat online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Sẵn sàng tìm kiếm gậy bi a hoàn hảo?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Tạo tài khoản ngay hôm nay để nhận ưu đãi đặc biệt
            </p>
            <Link
              to="/register"
              className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Đăng ký miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ShoppingBag className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold">BilliardCue Store</span>
              </div>
              <p className="text-gray-400">
                Cửa hàng gậy bi a uy tín hàng đầu Việt Nam
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Gậy chơi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gậy break</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gậy jump</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Phụ kiện</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn mua hàng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bảo hành</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Hotline: 1900-1234</li>
                <li>Email: info@billiardcue.vn</li>
                <li>Địa chỉ: 123 Nguyễn Huệ, Q1, TP.HCM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BilliardCue Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;