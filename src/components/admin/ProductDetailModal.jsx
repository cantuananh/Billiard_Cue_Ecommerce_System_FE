import React, { useState } from 'react';
import {
  X,
  Edit,
  Tag,
  Package,
  Layers,
  DollarSign,
  BarChart2,
  Calendar,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';

const formatPrice = (price) => {
  if (price == null) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
};

const ProductDetailModal = ({ isOpen, onClose, product, onEdit }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const images = (() => {
    if (product.images && product.images.length > 0) {
      return product.images.map(img => img.imageUrl || img.url);
    }
    if (product.imageUrl) return [product.imageUrl];
    return [];
  })();

  const currentImage = images[activeImageIndex];

  const discountPercent =
    product.originalPrice && product.price && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const stockStatus =
    (product.stockQuantity || 0) > 10
      ? { label: 'Còn hàng', color: 'text-green-600 bg-green-50 border-green-200' }
      : (product.stockQuantity || 0) > 0
      ? { label: 'Sắp hết hàng', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' }
      : { label: 'Hết hàng', color: 'text-red-600 bg-red-50 border-red-200' };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-start justify-center pt-8 pb-8 px-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Info className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Chi tiết sản phẩm</h2>
              <p className="text-xs text-gray-500 mt-0.5">ID: #{product.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onClose(); onEdit(product); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row gap-0">
          {/* Left: Image gallery */}
          <div className="md:w-2/5 bg-gray-50 p-6 border-r border-gray-100">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm mb-3">
              {currentImage ? (
                <img
                  src={currentImage.startsWith('http') ? currentImage : `http://localhost:8080${currentImage}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className="absolute inset-0 flex items-center justify-center bg-gray-100"
                style={{ display: currentImage ? 'none' : 'flex' }}
              >
                <ImageIcon className="w-16 h-16 text-gray-300" />
              </div>

              {/* Prev/Next buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex(i => Math.max(0, i - 1))}
                    disabled={activeImageIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow disabled:opacity-30 transition"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex(i => Math.min(images.length - 1, i + 1))}
                    disabled={activeImageIndex === images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow disabled:opacity-30 transition"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex
                        ? 'border-indigo-500 shadow-md'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img.startsWith('http') ? img : `http://localhost:8080${img}`}
                      alt={`Ảnh ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <p className="text-center text-xs text-gray-400 mt-2">Chưa có hình ảnh</p>
            )}

            {/* Status badge */}
            <div className="mt-4 flex justify-center">
              {product.isActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full border border-green-200">
                  <CheckCircle className="w-3.5 h-3.5" /> Đang hiển thị
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-full border border-red-200">
                  <XCircle className="w-3.5 h-3.5" /> Đang ẩn
                </span>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div className="md:w-3/5 p-6 overflow-y-auto max-h-[75vh]">
            {/* Name + discount */}
            <div className="mb-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h3>
                {discountPercent && (
                  <span className="flex-shrink-0 px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                    -{discountPercent}%
                  </span>
                )}
              </div>
            </div>

            {/* Price section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-5 border border-indigo-100">
              <div className="flex items-end gap-3 flex-wrap">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5 uppercase tracking-wide">Giá bán</p>
                  <p className="text-2xl font-bold text-indigo-700">{formatPrice(product.price)}</p>
                </div>
                {product.originalPrice && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5 uppercase tracking-wide">Giá gốc</p>
                    <p className="text-base text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <InfoItem icon={<Tag className="w-4 h-4" />} label="Mã SKU" value={product.sku || '—'} />
              <InfoItem
                icon={<Layers className="w-4 h-4" />}
                label="Danh mục"
                value={product.categoryName || product.category?.name || '—'}
              />
              <InfoItem
                icon={<Package className="w-4 h-4" />}
                label="Tồn kho"
                value={
                  <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full border ${stockStatus.color}`}>
                    {product.stockQuantity ?? 0} &nbsp;·&nbsp; {stockStatus.label}
                  </span>
                }
              />
              <InfoItem
                icon={<Calendar className="w-4 h-4" />}
                label="Ngày tạo"
                value={formatDate(product.createdAt)}
              />
              {product.updatedAt && (
                <InfoItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="Cập nhật lần cuối"
                  value={formatDate(product.updatedAt)}
                  className="col-span-2"
                />
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mô tả sản phẩm</p>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description || <span className="text-gray-400 italic">Chưa có mô tả</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-100 px-4 py-3 ${className}`}>
    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
      {icon}
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
    </div>
    <div className="text-sm font-semibold text-gray-800">{value}</div>
  </div>
);

export default ProductDetailModal;
