import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Youtube,
  Instagram,
  CheckCircle,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    // Simulate send
    setSubmitted(true);
    toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.');
  };

  const contactCards = [
    {
      icon: <Phone className="w-6 h-6" />,
      label: 'Điện thoại',
      value: '0909 123 456',
      sub: 'Thứ 2 – Chủ nhật, 8:00 – 21:00',
      gradient: 'from-violet-500 to-indigo-500',
      href: 'tel:0909123456',
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: 'Email',
      value: 'support@billiardcue.vn',
      sub: 'Phản hồi trong 24 giờ làm việc',
      gradient: 'from-pink-500 to-rose-500',
      href: 'mailto:support@billiardcue.vn',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Địa chỉ',
      value: '123 Nguyễn Văn Linh, Q.7',
      sub: 'TP. Hồ Chí Minh, Việt Nam',
      gradient: 'from-emerald-500 to-teal-500',
      href: 'https://maps.google.com',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Giờ mở cửa',
      value: '8:00 – 21:00',
      sub: 'Tất cả các ngày trong tuần',
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* decorative blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-white/80 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            Chúng tôi luôn lắng nghe bạn
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Liên Hệ{' '}
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Với Chúng Tôi
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Có câu hỏi về sản phẩm hay cần tư vấn? Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
          </p>

          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 mt-8 text-white/50 text-sm">
            <ShoppingBag className="w-4 h-4" />
            <span>Trang chủ</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90 font-medium">Liên hệ</span>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-12">
            {contactCards.map((card, i) => (
              <a
                key={i}
                href={card.href || '#'}
                target={card.href?.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center cursor-pointer transform hover:-translate-y-1"
                onClick={!card.href ? (e) => e.preventDefault() : undefined}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {card.icon}
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{card.label}</p>
                <p className="text-base font-bold text-gray-900 mb-1">{card.value}</p>
                <p className="text-sm text-gray-500">{card.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main content: form + info */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left: info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Hãy để chúng tôi <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">giúp bạn</span>
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Với hơn 10 năm kinh nghiệm trong ngành bi-a, đội ngũ BilliardCue Store luôn sẵn sàng tư vấn và hỗ trợ bạn chọn sản phẩm phù hợp nhất.
                </p>
              </div>

              {/* Why contact us */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="font-bold text-gray-900 mb-4">Chúng tôi hỗ trợ</h3>
                <ul className="space-y-3">
                  {[
                    'Tư vấn chọn gậy bi-a phù hợp theo trình độ',
                    'Giải đáp thắc mắc về sản phẩm, chính sách',
                    'Hỗ trợ sau mua hàng và bảo hành',
                    'Tư vấn trang bị cho câu lạc bộ, giải đấu',
                    'Đặt hàng số lượng lớn và hợp tác kinh doanh',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Theo dõi chúng tôi</h3>
                <div className="flex gap-3">
                  {[
                    { icon: <Facebook className="w-5 h-5" />, label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
                    { icon: <Youtube className="w-5 h-5" />, label: 'YouTube', color: 'bg-red-600 hover:bg-red-700' },
                    { icon: <Instagram className="w-5 h-5" />, label: 'Instagram', color: 'bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' },
                  ].map((s, i) => (
                    <a
                      key={i}
                      href="#"
                      className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center text-white transition-all duration-200 transform hover:scale-110 shadow-md`}
                      title={s.label}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Gửi thành công!</h3>
                    <p className="text-gray-500 max-w-sm">
                      Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng <strong>24 giờ</strong> làm việc.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                      className="mt-8 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                      Gửi tin nhắn khác
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Gửi tin nhắn</h3>
                      <p className="text-gray-500 mt-1 text-sm">Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại sớm nhất.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Họ và tên <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nguyễn Văn A"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số điện thoại</label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="0909 123 456"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Chủ đề</label>
                          <select
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all bg-white"
                          >
                            <option value="">Chọn chủ đề…</option>
                            <option value="tuvan">Tư vấn sản phẩm</option>
                            <option value="donhang">Hỏi về đơn hàng</option>
                            <option value="baohanh">Bảo hành & đổi trả</option>
                            <option value="hopgiac">Hợp tác kinh doanh</option>
                            <option value="khac">Khác</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Nội dung <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Mô tả chi tiết yêu cầu của bạn…"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg"
                      >
                        <Send className="w-5 h-5" />
                        Gửi tin nhắn
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Showroom của chúng tôi</h3>
                <p className="text-sm text-gray-500">123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</p>
              </div>
            </div>
            <iframe
              title="BilliardCue Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0323697093546!2d106.69945531474895!3d10.73250629234894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9e2f9543f3%3A0x5dd1c80e7a7d3c7!2zUXXhuq1uIDcsIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2svn!4v1609000000000!5m2!1svi!2svn"
              width="100%"
              height="360"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default ContactPage;
