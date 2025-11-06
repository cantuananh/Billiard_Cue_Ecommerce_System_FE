import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, ShoppingBag, CheckCircle, Clock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPasswordSchema } from '../../utils/validation';
import { authService } from '../../services/authService';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(data.email);
      toast.success(response.message || 'Link đặt lại mật khẩu đã được gửi đến email của bạn.');
      setIsEmailSent(true);
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = getValues('email');
    if (email) {
      await onSubmit({ email });
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          }}></div>
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-green-400/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Success Animation */}
            <div className="text-center mb-8">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-scale-in">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-2">
                Email Đã Được Gửi!
              </h2>
              <p className="text-purple-200">
                Kiểm tra hộp thư của bạn để đặt lại mật khẩu
              </p>
            </div>

            {/* Email Info Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center">
                  <div className="bg-white/20 rounded-full p-3 mr-3">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-purple-200">Email được gửi đến:</p>
                    <p className="font-bold text-white">{getValues('email')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-purple-200">
                    <Clock className="h-5 w-5 mr-3 text-yellow-300" />
                    <span>Link sẽ hết hạn sau 15 phút</span>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-sm text-purple-200 mb-3">
                      💡 Không thấy email? Hãy kiểm tra:
                    </p>
                    <ul className="text-sm text-purple-300 space-y-1">
                      <li>• Thư mục Spam/Junk</li>
                      <li>• Thư mục Promotions (Gmail)</li>
                      <li>• Đảm bảo email chính xác</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Đang gửi lại...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="h-5 w-5 mr-2" />
                        Gửi lại email
                      </div>
                    )}
                  </button>

                  <Link
                    to="/login"
                    className="flex items-center justify-center py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }}></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-400/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-blue-400/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="relative">
                <ShoppingBag className="h-12 w-12 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse"></div>
              </div>
              <span className="ml-4 text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                BilliardCue Store
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Khôi Phục
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Tài Khoản
              </span>
            </h1>
            
            <p className="text-xl text-purple-100 leading-relaxed mb-8">
              Đừng lo lắng! Việc quên mật khẩu xảy ra với tất cả mọi người. 
              Chúng tôi sẽ giúp bạn khôi phục tài khoản nhanh chóng và an toàn.
            </p>

            {/* Security Features */}
            <div className="space-y-4">
              {[
                { icon: Sparkles, text: "Bảo mật SSL 256-bit", color: "from-green-500 to-emerald-500" },
                { icon: Clock, text: "Link có hiệu lực trong 15 phút", color: "from-blue-500 to-indigo-500" },
                { icon: CheckCircle, text: "Xác thực email an toàn", color: "from-purple-500 to-pink-500" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-purple-100">
                  <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mr-3`}>
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  {feature.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gradient-to-br from-gray-50 to-white">
        {/* Back to Home Button */}
        <div className="absolute top-8 left-8">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-300 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Về trang chủ
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Mail className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Quên Mật Khẩu?
            </h2>
            <p className="text-gray-600">
              Nhập email của bạn để nhận link đặt lại mật khẩu
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 
                      focus:outline-none focus:ring-0 focus:border-purple-500 focus:bg-white transition-all duration-300
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 hover:from-purple-700 hover:via-violet-700 hover:to-fuchsia-700 shadow-lg'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Đang gửi...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="h-5 w-5 mr-2" />
                    Gửi link đặt lại mật khẩu
                  </div>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <Link
                  to="/login"
                  className="flex items-center justify-center text-purple-600 hover:text-purple-500 font-medium transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Bạn sẽ nhận được email trong vòng vài phút. 
              Hãy kiểm tra cả thư mục spam nếu cần thiết.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;