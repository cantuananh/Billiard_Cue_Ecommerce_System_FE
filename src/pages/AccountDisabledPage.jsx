import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, Mail, ArrowLeft, AlertTriangle } from 'lucide-react';

const AccountDisabledPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <ShieldOff className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Tài khoản bị vô hiệu hoá</h1>
            <p className="text-red-100 mt-2 text-sm">Account Disabled</p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Alert box */}
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">
                  Tài khoản của bạn đã bị vô hiệu hoá
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Bạn hiện không thể đăng nhập vào hệ thống vì tài khoản đã bị quản trị viên tạm ngừng hoạt động.
                </p>
              </div>
            </div>

            {/* Reasons */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Nguyên nhân có thể:</p>
              <ul className="space-y-2">
                {[
                  'Vi phạm điều khoản sử dụng dịch vụ',
                  'Hoạt động bất thường được phát hiện trên tài khoản',
                  'Yêu cầu xác minh danh tính chưa hoàn tất',
                  'Tài khoản đang trong quá trình xem xét',
                ].map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact support */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">Liên hệ hỗ trợ</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ với chúng tôi để được hỗ trợ kịp thời.
                  </p>
                  <a
                    href="mailto:support@billiardcue.vn"
                    className="inline-block mt-2 text-sm font-medium text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors"
                  >
                    support@billiardcue.vn
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại trang đăng nhập
              </button>

              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:bg-gray-50"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2025 BilliardCue Store. Mã lỗi: ACCOUNT_DISABLED
        </p>
      </div>
    </div>
  );
};

export default AccountDisabledPage;
