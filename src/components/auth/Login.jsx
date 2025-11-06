import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Mail, Lock, ShoppingBag, ArrowLeft, Star, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '../../utils/validation';
import { authService } from '../../services/authService';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      
      // Store tokens and user info
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast.success('Đăng nhập thành công!');
      
      // Redirect to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }}></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-green-400/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-blue-400/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-pink-400/20 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="relative">
                <ShoppingBag className="h-12 w-12 text-indigo-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse"></div>
              </div>
              <span className="ml-4 text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                BilliardCue Store
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Chào Mừng Trở Lại
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Thế Giới Bi-A
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Khám phá bộ sưu tập gậy bi-a chất lượng cao từ những thương hiệu nổi tiếng thế giới. 
              Nơi đam mê gặp gỡ chất lượng.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Star, text: "Sản phẩm chính hãng 100%" },
                { icon: Target, text: "Tư vấn chuyên nghiệp 24/7" },
                { icon: ShoppingBag, text: "Giao hàng toàn quốc" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-blue-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  {feature.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gradient-to-br from-gray-50 to-white">
        {/* Back to Home Button */}
        <div className="absolute top-8 left-8">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-300 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Về trang chủ
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <LogIn className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Đăng Nhập
            </h2>
            <p className="text-gray-600">
              Chào mừng quay trở lại! Hãy đăng nhập để tiếp tục
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 
                      focus:outline-none focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all duration-300
                      ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200'}`}
                    placeholder="Nhập email của bạn"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 
                      focus:outline-none focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all duration-300
                      ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200'}`}
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-lg'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Đang đăng nhập...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="h-5 w-5 mr-2" />
                    Đăng nhập
                  </div>
                )}
              </button>

              {/* Register Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Chưa có tài khoản?{' '}
                  <Link
                    to="/register"
                    className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Bằng việc đăng nhập, bạn đồng ý với{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">Điều khoản sử dụng</a>
              {' '}và{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">Chính sách bảo mật</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;