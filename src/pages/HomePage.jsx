import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Star, Shield, Truck, UserPlus,
  ChevronDown, Award, Target, Zap, Heart,
  Users, TrendingUp, Play, ChevronRight, CheckCircle,
  MessageCircle, Phone, Loader2, ShoppingCart
} from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductFilter from '../components/ProductFilterSimple';
import Pagination from '../components/Pagination';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import toast from 'react-hot-toast';
import { useCartContext } from '../context/CartContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart, openCart } = useCartContext();

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      primaryImageUrl: getProductImage(product),
      stockQuantity: product.stock ?? product.stockQuantity ?? 99,
    };
    addToCart(cartProduct, 1);
    toast.success('Đã thêm vào giỏ hàng!');
    openCart();
  };
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    minPrice: 0,
    maxPrice: 50000000,
    sortBy: 'createdAt',
    sortDir: 'desc'
  });

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

  // Handle filter changes
  const handleFilterChange = async (newFilters) => {
    console.log('Filter changed:', newFilters);
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
    await fetchFilteredProducts(0, newFilters);
  };

  // Fetch filtered products
  const fetchFilteredProducts = async (page = 0, currentFilters = filters) => {
    try {
      setProductsLoading(true);
      console.log('Fetching products with filters:', currentFilters);
      
      const response = await productService.getProducts(page, 20, currentFilters); // 20 products per page
      console.log('Products response:', response);
      
      setProducts(response.content || response);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      toast.error('Không thể tải sản phẩm');
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = async (page) => {
    // Scroll to top of products section
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    await fetchFilteredProducts(page, filters);
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [categoriesResponse, featuredResponse] = await Promise.all([
          categoryService.getAllCategories(),
          productService.getFeaturedProducts(6) // Get 6 featured products
        ]);

        setCategories(categoriesResponse.content || categoriesResponse);
        setFeaturedProducts(featuredResponse.content || featuredResponse);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        
        // Set empty arrays on error to prevent crashes
        setCategories([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch products on initial load and when filters change
  useEffect(() => {
    fetchFilteredProducts(0, filters);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

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
            {/* All Categories */}
            <div 
              className="group cursor-pointer"
              onClick={() => {
                const newFilters = { ...filters, categoryId: '', search: '' };
                handleFilterChange(newFilters);
              }}
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center group-hover:text-indigo-600 transition-colors">
                  Tất cả
                </h3>
                <p className="text-sm text-gray-500 text-center">{totalElements || 0} sản phẩm</p>
              </div>
            </div>

            {/* Dynamic Categories */}
            {categories && categories.slice(0, 5).map((category, index) => {
              const categoryIcons = ["🎱", "🎯", "⚡", "💥", "🚀", "🛠️"];
              const categoryColors = [
                "from-blue-500 to-indigo-600",
                "from-green-500 to-emerald-600", 
                "from-purple-500 to-violet-600",
                "from-red-500 to-pink-600",
                "from-yellow-500 to-orange-600",
                "from-gray-500 to-slate-600"
              ];
              
              return (
                <div 
                  key={category.id} 
                  className="group cursor-pointer"
                  onClick={() => {
                    const newFilters = { ...filters, categoryId: category.id, search: '' };
                    handleFilterChange(newFilters);
                  }}
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100">
                    <div className={`w-16 h-16 bg-gradient-to-br ${categoryColors[index]} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl">{categoryIcons[index]}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 text-center group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 text-center">{category.productCount || 0} sản phẩm</p>
                  </div>
                </div>
              );
            })}
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
                <div key={product.id} className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 cursor-pointer flex flex-col h-full" onClick={() => navigate(`/product/${product.id}`)}>
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
                  <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
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
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="text-xs text-gray-500 mb-1">{product.category?.name || 'Không có danh mục'}</div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors" 
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          minHeight: '3.5rem',
                          lineHeight: '1.75rem'
                        }}>
                      {product.name}
                    </h3>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700 ml-1">
                          {product.rating ? parseFloat(product.rating).toFixed(1) : '0.0'}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 flex-grow">
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
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-full font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                        (product.stock === null || product.stock > 0)
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>{(product.stock === null || product.stock > 0) ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Product Filter */}
          <ProductFilter
            categories={categories}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />

          {/* All Products Grid */}
          <div id="products-section" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Tất Cả Sản Phẩm
                {totalElements > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({totalElements} sản phẩm)
                  </span>
                )}
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsLoading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                  <span className="ml-2 text-gray-600">Đang tải sản phẩm...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  </div>
                  <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
                  <p className="text-gray-400 text-sm mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              ) : (
                products.map((product, index) => (
                  <div key={product.id} className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 cursor-pointer flex flex-col h-full" onClick={() => navigate(`/product/${product.id}`)}>
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
                    <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
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
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="text-xs text-gray-500 mb-1">{product.category?.name || 'Không có danh mục'}</div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors" 
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minHeight: '3.5rem',
                            lineHeight: '1.75rem'
                          }}>
                        {product.name}
                      </h3>

                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700 ml-1">
                            {product.rating ? parseFloat(product.rating).toFixed(1) : '0.0'}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4 flex-grow">
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
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`w-full font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                          (product.stock === null || product.stock > 0)
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>{(product.stock === null || product.stock > 0) ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          {products.length > 0 && totalPages > 1 && !productsLoading && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={20}
                onPageChange={handlePageChange}
                showInfo={true}
              />
            </div>
          )}
          
          {productsLoading && (
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600 mr-2" />
                <span className="text-gray-600">Đang chuyển trang...</span>
              </div>
            </div>
          )}
          
          {products.length === 0 && !productsLoading && (
            <div className="text-center text-sm text-gray-500 py-8">
              Không tìm thấy sản phẩm nào phù hợp với bộ lọc
            </div>
          )}
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

      <SiteFooter />
    </div>
  );
};

export default HomePage;
