import React from 'react';
import {
  ShoppingBag, ChevronRight, MapPin, Phone, Mail,
  Facebook, Instagram, Twitter, Youtube,
} from 'lucide-react';

const SiteFooter = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="relative">
                <ShoppingBag className="h-10 w-10 text-indigo-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse"></div>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                BilliardCue Store
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Cửa hàng gậy bi-a uy tín hàng đầu Việt Nam với hơn 10 năm kinh nghiệm.
              Chúng tôi cam kết mang đến những sản phẩm chất lượng cao nhất.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, color: 'hover:text-blue-400' },
                { icon: Instagram, color: 'hover:text-pink-400' },
                { icon: Twitter, color: 'hover:text-blue-300' },
                { icon: Youtube, color: 'hover:text-red-400' },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110 hover:bg-gray-700`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Sản phẩm</h3>
            <ul className="space-y-3">
              {[
                'Gậy Pool chuyên nghiệp',
                'Gậy Carom cao cấp',
                'Gậy Snooker premium',
                'Gậy Break & Jump',
                'Phụ kiện bi-a',
                'Bàn bi-a gia đình',
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 flex items-center group">
                    <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3">
              {[
                'Hướng dẫn mua hàng',
                'Chính sách đổi trả',
                'Chính sách bảo hành',
                'Phương thức thanh toán',
                'Vận chuyển & giao hàng',
                'Câu hỏi thường gặp',
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 flex items-center group">
                    <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-indigo-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Địa chỉ</p>
                  <p className="text-gray-400">123 Nguyễn Huệ, Quận 1, TP.HCM</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Hotline</p>
                  <p className="text-gray-400">1900-1234 (24/7)</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-gray-400">info@billiardcue.vn</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="text-white font-medium mb-3">Nhận tin khuyến mãi</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-r-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 BilliardCue Store. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Điều khoản sử dụng', 'Chính sách bảo mật', 'Sitemap'].map((item) => (
                <a key={item} href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
