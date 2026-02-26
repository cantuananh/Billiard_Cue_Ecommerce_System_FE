import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, User, CreditCard, Truck, ChevronRight,
  ShoppingBag, AlertCircle, CheckCircle, Loader2, MessageSquare,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { useCartContext } from '../context/CartContext';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';

const SHIPPING_FEE = 30000;
const FREE_SHIPPING_THRESHOLD = 1000000;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCartContext();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    shippingName: currentUser?.fullName || '',
    shippingPhone: currentUser?.phone || '',
    shippingAddress: '',
    shippingWard: '',
    shippingDistrict: '',
    shippingProvince: '',
    paymentMethod: 'COD',
    customerNotes: '',
  });

  const [errors, setErrors] = useState({});

  const shippingFee = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const finalAmount = totalPrice + shippingFee;

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN').format(price) + '₫';

  const getProductImage = (item) =>
    item.image || item.primaryImageUrl || item.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.shippingName.trim()) newErrors.shippingName = 'Vui lòng nhập họ tên';
    if (!form.shippingPhone.trim()) newErrors.shippingPhone = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)[0-9]{9}$/.test(form.shippingPhone.trim()))
      newErrors.shippingPhone = 'Số điện thoại không hợp lệ';
    if (!form.shippingAddress.trim()) newErrors.shippingAddress = 'Vui lòng nhập địa chỉ';
    if (!form.shippingDistrict.trim()) newErrors.shippingDistrict = 'Vui lòng nhập quận/huyện';
    if (!form.shippingProvince.trim()) newErrors.shippingProvince = 'Vui lòng nhập tỉnh/thành phố';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để đặt hàng');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống');
      navigate('/cart');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingName: form.shippingName.trim(),
        shippingPhone: form.shippingPhone.trim(),
        shippingAddress: form.shippingAddress.trim(),
        shippingWard: form.shippingWard.trim(),
        shippingDistrict: form.shippingDistrict.trim(),
        shippingProvince: form.shippingProvince.trim(),
        paymentMethod: form.paymentMethod,
        customerNotes: form.customerNotes.trim(),
        shippingFee: shippingFee,
        discountAmount: 0,
      };

      const order = await orderService.createOrder(orderData);
      clearCart();
      toast.success('Đặt hàng thành công!');
      navigate('/order-success', { state: { order } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="pt-16 flex flex-col items-center justify-center min-h-[60vh]">
          <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-xl text-gray-500 mb-6">Giỏ hàng của bạn đang trống</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center text-sm text-gray-500 space-x-2">
              <button onClick={() => navigate('/')} className="hover:text-indigo-600 transition-colors">Trang chủ</button>
              <ChevronRight className="h-4 w-4" />
              <button onClick={() => navigate('/cart')} className="hover:text-indigo-600 transition-colors">Giỏ hàng</button>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-800 font-medium">Thanh toán</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Thông tin thanh toán</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT: Shipping + Payment */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    Địa chỉ nhận hàng
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="shippingName"
                          value={form.shippingName}
                          onChange={handleChange}
                          placeholder="Nhập họ và tên người nhận hàng (VD: Nguyễn Văn A)"
                          className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                            errors.shippingName ? 'border-red-400 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.shippingName && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.shippingName}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          name="shippingPhone"
                          value={form.shippingPhone}
                          onChange={handleChange}
                          placeholder="Nhập số điện thoại để shipper liên hệ khi giao hàng (VD: 0901234567)"
                          className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                            errors.shippingPhone ? 'border-red-400 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.shippingPhone && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.shippingPhone}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số nhà, tên đường <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="shippingAddress"
                        value={form.shippingAddress}
                        onChange={handleChange}
                        placeholder="Nhập số nhà, tên đường (VD: 123 Đường Nguyễn Huệ)"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                          errors.shippingAddress ? 'border-red-400 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.shippingAddress && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.shippingAddress}
                        </p>
                      )}
                    </div>

                    {/* Ward */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                      <input
                        type="text"
                        name="shippingWard"
                        value={form.shippingWard}
                        onChange={handleChange}
                        placeholder="Nhập phường/xã/thị trấn (VD: Phường Bến Nghé)"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quận/Huyện <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="shippingDistrict"
                        value={form.shippingDistrict}
                        onChange={handleChange}
                        placeholder="Nhập quận/huyện (VD: Quận 1, Huyện Bình Chánh)"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                          errors.shippingDistrict ? 'border-red-400 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.shippingDistrict && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.shippingDistrict}
                        </p>
                      )}
                    </div>

                    {/* Province */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="shippingProvince"
                        value={form.shippingProvince}
                        onChange={handleChange}
                        placeholder="Nhập tỉnh/thành phố (VD: TP. Hồ Chí Minh, Hà Nội, Đà Nẵng)"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                          errors.shippingProvince ? 'border-red-400 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.shippingProvince && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.shippingProvince}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                    Phương thức thanh toán
                  </h2>
                  <div className="space-y-3">
                    {[
                      {
                        value: 'COD',
                        label: 'Thanh toán khi nhận hàng (COD)',
                        desc: 'Thanh toán bằng tiền mặt khi nhận hàng',
                        icon: <Truck className="h-6 w-6 text-green-600" />,
                      },
                      {
                        value: 'BANK_TRANSFER',
                        label: 'Chuyển khoản ngân hàng',
                        desc: 'Chuyển khoản trước, đơn hàng sẽ được xác nhận sau khi thanh toán',
                        icon: <CreditCard className="h-6 w-6 text-blue-600" />,
                      },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          form.paymentMethod === method.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={form.paymentMethod === method.value}
                          onChange={handleChange}
                          className="mt-1 accent-indigo-600"
                        />
                        <div className="flex items-start gap-3 flex-1">
                          {method.icon}
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{method.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                          </div>
                        </div>
                        {form.paymentMethod === method.value && (
                          <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Bank transfer info */}
                  {form.paymentMethod === 'BANK_TRANSFER' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm">
                      <p className="font-semibold text-blue-800 mb-2">Thông tin chuyển khoản:</p>
                      <div className="space-y-1 text-blue-700">
                        <p>Ngân hàng: <strong>Vietcombank</strong></p>
                        <p>Số tài khoản: <strong>1234567890</strong></p>
                        <p>Chủ tài khoản: <strong>BILLIARD CUE STORE</strong></p>
                        <p className="text-xs text-blue-600 mt-2">* Nội dung: [Họ tên] + [Số điện thoại]</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                    Ghi chú đơn hàng
                  </h2>
                  <textarea
                    name="customerNotes"
                    value={form.customerNotes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="VD: Giao hàng giờ hành chính (8h–17h), gọi điện trước 30 phút, để hàng tại bảo vệ nếu vắng nhà..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* RIGHT: Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-indigo-600" />
                    Đơn hàng ({cartItems.length} sản phẩm)
                  </h2>

                  {/* Items */}
                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1 mb-5">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <img
                          src={getProductImage(item)}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/64x64?text=No+Image'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Số lượng: {item.quantity}</p>
                          <p className="text-sm font-semibold text-indigo-600 mt-1">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tạm tính</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Phí vận chuyển</span>
                      <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                        {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                      </span>
                    </div>
                    {shippingFee === 0 && (
                      <p className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                        🎉 Bạn được miễn phí vận chuyển!
                      </p>
                    )}
                    {shippingFee > 0 && (
                      <p className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        Mua thêm {formatPrice(FREE_SHIPPING_THRESHOLD - totalPrice)} để được miễn phí ship
                      </p>
                    )}

                    <div className="flex justify-between font-bold text-base text-gray-900 pt-3 border-t border-gray-200">
                      <span>Tổng cộng</span>
                      <span className="text-indigo-700 text-lg">{formatPrice(finalAmount)}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-base"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Đặt hàng ngay
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-3">
                    Bằng cách đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default CheckoutPage;
