import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, UserPlus, LogIn, Star, Shield, Truck, 
  ChevronDown, Menu, X, Award, Target, Zap, Heart,
  Users, TrendingUp, Play, ChevronRight, CheckCircle,
  MessageCircle, Phone, Mail, MapPin, Facebook, 
  Instagram, Twitter, Youtube, Loader2
} from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getProductImage = (product) => {
    // Try primaryImageUrl first
    if (product.primaryImageUrl) {
      return product.primaryImageUrl;
    }
    
    // Then try images array
    if (product.images && product.images.length > 0) {
      return product.images[0].imageUrl;
    }
    
    // Fallback to imageUrl field
    if (product.imageUrl) {
      return product.imageUrl;
    }
    
    return '/placeholder-product.svg'; // fallback image
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const results = await productService.searchProducts(searchQuery);
      setProducts(results.content || results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Không thể tìm kiếm sản phẩm');
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [productsResponse, categoriesResponse, featuredResponse] = await Promise.all([
          productService.getProducts(0, 8), // Get first 8 products
          categoryService.getAllCategories(),
          productService.getFeaturedProducts(6) // Get 6 featured products
        ]);

        setProducts(productsResponse.content || productsResponse);
        setCategories(categoriesResponse.content || categoriesResponse);
        setFeaturedProducts(featuredResponse.content || featuredResponse);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        
        // Set empty arrays on error to prevent crashes
        setProducts([]);
        setCategories([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
            <div className="flex items-center group cursor-pointer">
              <div className="relative">
                <ShoppingBag className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse"></div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                BilliardCue Store
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {['Sản phẩm', 'Thương hiệu', 'Giới thiệu', 'Liên hệ'].map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-gray-600 hover:text-indigo-600 font-medium transition-all duration-300 group"
                >
                  {item}
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
              {['Sản phẩm', 'Thương hiệu', 'Giới thiệu', 'Liên hệ'].map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-600 hover:text-indigo-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t">
                <Link
                  to="/login"
                  className="flex items-center justify-center text-gray-600 hover:text-indigo-600 font-medium py-2 transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-300"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          }}></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-white text-sm font-medium mb-6 animate-fade-in-up">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                Sản phẩm chất lượng cao #1 Việt Nam
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Gậy Bi A
                </span>
                <br />
                <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Chất Lượng Cao
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                Khám phá bộ sưu tập gậy bi a từ các thương hiệu nổi tiếng thế giới. 
                <span className="text-yellow-300 font-semibold"> Chất lượng đảm bảo</span>, 
                <span className="text-pink-300 font-semibold"> giá cả hợp lý</span>, 
                <span className="text-green-300 font-semibold"> dịch vụ tận tâm</span>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <Link
                to="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Mua sắm ngay
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <a
                href="#products"
                className="group flex items-center px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white font-bold rounded-full text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                <Target className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Xem sản phẩm
                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              {[
                { number: '10K+', label: 'Khách hàng hài lòng', icon: Heart },
                { number: '500+', label: 'Sản phẩm chất lượng', icon: Award },
                { number: '15+', label: 'Thương hiệu nổi tiếng', icon: Star },
                { number: '99%', label: 'Tỷ lệ hài lòng', icon: TrendingUp },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-6 w-6 text-yellow-300" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/70" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Danh Mục Sản Phẩm
            </h2>
            <p className="text-lg text-gray-600">
              Khám phá các loại gậy bi-a chuyên nghiệp
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Gậy Pool", icon: "🎱", count: "120+ sản phẩm", color: "from-blue-500 to-indigo-600" },
              { name: "Gậy Carom", icon: "🎯", count: "85+ sản phẩm", color: "from-green-500 to-emerald-600" },
              { name: "Gậy Snooker", icon: "⚡", count: "95+ sản phẩm", color: "from-purple-500 to-violet-600" },
              { name: "Gậy Break", icon: "💥", count: "45+ sản phẩm", color: "from-red-500 to-pink-600" },
              { name: "Gậy Jump", icon: "🚀", count: "30+ sản phẩm", color: "from-yellow-500 to-orange-600" },
              { name: "Phụ Kiện", icon: "🛠️", count: "200+ sản phẩm", color: "from-gray-500 to-slate-600" }
            ].map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 text-center group-hover:text-indigo-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 text-center">{category.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section id="products" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-lg text-gray-600">
              Những sản phẩm bán chạy nhất được khách hàng tin tưởng
            </p>
          </div>

          {/* Featured Products */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-gray-600">Đang tải sản phẩm...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
                  {/* Badge */}
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 rounded-md text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500">
                        -{product.discount}%
                      </span>
                    </div>
                  )}

                  {/* Stock Badge */}
                  {product.stock !== null && product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 rounded-md text-xs font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-500">
                        Còn {product.stock}
                      </span>
                    </div>
                  )}

                  {product.stock === null && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 rounded-md text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500">
                        Có sẵn
                      </span>
                    </div>
                  )}

                  {product.stock === 0 && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 rounded-md text-xs font-bold text-white bg-gray-500">
                        Hết hàng
                      </span>
                    </div>
                  )}

                  {/* Wishlist */}
                  <div className="absolute top-3 right-3 z-10">
                    <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                  </div>

                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <img 
                      src={getProductImage(product)} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.svg';
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">{product.category?.name || 'Không có danh mục'}</div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700 ml-1">4.5</span>
                        <span className="text-sm text-gray-500 ml-1">(0)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-indigo-600">
                        {formatPrice(product.price)}₫
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.price / (1 - product.discount / 100))}₫
                        </span>
                      )}
                    </div>

                    <button 
                      className={`w-full font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        (product.stock === null || product.stock > 0)
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={product.stock === 0}
                    >
                      {(product.stock === null || product.stock > 0) ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All Products Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Tất Cả Sản Phẩm</h3>
              <div className="flex items-center space-x-4">
                <select className="border border-gray-300 rounded-lg px-4 py-2 bg-white">
                  <option value="">Tất cả danh mục</option>
                  {categories && Array.isArray(categories) && categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <select className="border border-gray-300 rounded-lg px-4 py-2 bg-white">
                  <option value="createdAt-desc">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                  <option value="name-asc">Tên: A-Z</option>
                  <option value="name-desc">Tên: Z-A</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {loading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                  <span className="ml-2 text-gray-600">Đang tải...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">Không có sản phẩm nào</p>
                </div>
              ) : (
                products.map((product, index) => (
                  <div key={product.id} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
                    {/* Product Image */}
                    <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100">
                      <img 
                        src={getProductImage(product)} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.svg';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h4>

                      <div className="flex items-center mb-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">4.5</span>
                        <span className="text-xs text-gray-500 ml-1">(0)</span>
                      </div>

                      <div className="mb-3">
                        <div className="text-lg font-bold text-indigo-600 mb-1">
                          {formatPrice(product.price)}₫
                        </div>
                        {product.discount > 0 && (
                          <div className="text-xs text-gray-400 line-through">
                            {formatPrice(product.price / (1 - product.discount / 100))}₫
                          </div>
                        )}
                      </div>

                      <button 
                        className={`w-full font-medium py-2 px-3 rounded-md transition-colors duration-300 text-sm ${
                          (product.stock === null || product.stock > 0)
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={product.stock === 0}
                      >
                        {(product.stock === null || product.stock > 0) ? 'Mua ngay' : 'Hết hàng'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Load More / Pagination */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-gray-100 to-white border-2 border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 mb-4">
              Xem thêm sản phẩm
              <ChevronDown className="h-5 w-5 inline ml-2" />
            </button>
            <div className="text-sm text-gray-500">
              Hiển thị 19 trong tổng số 500+ sản phẩm
            </div>
          </div>
        </div>

        {/* Brands Section */}
        <div className="bg-white py-16 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Thương Hiệu Đối Tác
              </h3>
              <p className="text-gray-600">
                Chúng tôi là đại lý chính thức của các thương hiệu hàng đầu thế giới
              </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center opacity-60 hover:opacity-100 transition-opacity">
              {[
                "Predator", "McDermott", "Schon", "Lucasi", "Poison", "Meucci",
                "Molinari", "Longoni", "Adam", "Jacoby", "Viking", "Action"
              ].map((brand, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors cursor-pointer">
                    <div className="text-lg font-bold text-gray-700">{brand}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-lg text-indigo-600 rounded-full text-sm font-medium mb-4">
              <Award className="h-4 w-4 mr-2" />
              Tại sao chọn chúng tôi
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cam Kết Của
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Chúng Tôi</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào mang đến những sản phẩm và dịch vụ tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Chất lượng đảm bảo",
                description: "100% sản phẩm chính hãng với chứng nhận quốc tế",
                color: "from-blue-500 to-indigo-600",
                bgColor: "from-blue-50 to-indigo-50"
              },
              {
                icon: Truck,
                title: "Giao hàng nhanh chóng",
                description: "Giao hàng miễn phí toàn quốc trong 24-48h",
                color: "from-green-500 to-emerald-600",
                bgColor: "from-green-50 to-emerald-50"
              },
              {
                icon: Users,
                title: "Hỗ trợ 24/7",
                description: "Đội ngũ chuyên viên tư vấn luôn sẵn sàng hỗ trợ",
                color: "from-purple-500 to-violet-600",
                bgColor: "from-purple-50 to-violet-50"
              },
              {
                icon: Award,
                title: "Bảo hành toàn diện",
                description: "Bảo hành chính hãng lên đến 3 năm",
                color: "from-yellow-500 to-orange-600",
                bgColor: "from-yellow-50 to-orange-50"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300 opacity-50`}></div>
                <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative element */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-white/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "10+", label: "Năm kinh nghiệm", icon: TrendingUp },
                { number: "15K+", label: "Khách hàng tin tưởng", icon: Users },
                { number: "500+", label: "Sản phẩm chất lượng", icon: Star },
                { number: "99%", label: "Khách hàng hài lòng", icon: Heart }
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-center mb-3">
                    <stat.icon className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-indigo-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg text-yellow-300 rounded-full text-sm font-medium mb-4">
              <MessageCircle className="h-4 w-4 mr-2" />
              Phản hồi khách hàng
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Khách Hàng
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent"> Nói Gì</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hàng nghìn khách hàng đã tin tưởng và hài lòng với sản phẩm, dịch vụ của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Văn Minh",
                role: "Vận động viên Billiards chuyên nghiệp",
                avatar: "👨‍💼",
                rating: 5,
                comment: "Gậy bi-a tại đây chất lượng tuyệt vời! Tôi đã sử dụng sản phẩm của shop trong nhiều giải đấu lớn. Rất hài lòng với độ bền và tính ổn định.",
                verified: true
              },
              {
                name: "Trần Thị Lan",
                role: "Chủ câu lạc bộ bi-a",
                avatar: "👩‍💼",
                rating: 5,
                comment: "Dịch vụ tư vấn rất chuyên nghiệp, giao hàng nhanh chóng. CLB của tôi đã đặt mua hàng loạt gậy cho các thành viên và ai cũng khen ngợi.",
                verified: true
              },
              {
                name: "Lê Hoàng Nam",
                role: "Người chơi bi-a nghiệp dư",
                avatar: "👨‍🎓",
                rating: 5,
                comment: "Lần đầu mua gậy bi-a online và tôi rất ấn tượng. Sản phẩm đúng như mô tả, đóng gói cẩn thận. Chắc chắn sẽ giới thiệu cho bạn bè.",
                verified: true
              }
            ].map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-1">
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-300 fill-current" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-200 mb-6 leading-relaxed italic">
                    "{testimonial.comment}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xl mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-bold text-white">{testimonial.name}</h4>
                        {testimonial.verified && (
                          <CheckCircle className="h-4 w-4 text-green-400 ml-2" />
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg text-yellow-300 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Ưu đãi đặc biệt
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Sẵn Sàng Tìm Kiếm
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Gậy Bi A Hoàn Hảo?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Đăng ký ngay hôm nay để nhận <span className="text-yellow-300 font-bold">giảm giá 20%</span> 
              cho đơn hàng đầu tiên và trở thành thành viên VIP
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                to="/register"
                className="group relative px-8 py-4 bg-white text-indigo-600 font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Đăng ký miễn phí
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <div className="flex items-center text-white">
                <div className="flex items-center mr-6">
                  <Phone className="h-5 w-5 mr-2 text-green-300" />
                  <span className="font-medium">Hotline: 1900-1234</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-300" />
                  <span className="font-medium">Chat ngay</span>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                <span>Miễn phí vận chuyển</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                <span>Bảo hành chính hãng</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, color: "hover:text-blue-400" },
                  { icon: Instagram, color: "hover:text-pink-400" },
                  { icon: Twitter, color: "hover:text-blue-300" },
                  { icon: Youtube, color: "hover:text-red-400" }
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
                  "Gậy Pool chuyên nghiệp",
                  "Gậy Carom cao cấp", 
                  "Gậy Snooker premium",
                  "Gậy Break & Jump",
                  "Phụ kiện bi-a",
                  "Bàn bi-a gia đình"
                ].map((item, index) => (
                  <li key={index}>
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
                  "Hướng dẫn mua hàng",
                  "Chính sách đổi trả",
                  "Chính sách bảo hành",
                  "Phương thức thanh toán",
                  "Vận chuyển & giao hàng",
                  "Câu hỏi thường gặp"
                ].map((item, index) => (
                  <li key={index}>
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
                {[
                  "Điều khoản sử dụng",
                  "Chính sách bảo mật", 
                  "Sitemap"
                ].map((item, index) => (
                  <a key={index} href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;