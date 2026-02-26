import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import LoadingButton from '../ui/LoadingButton';

const OrderStatusModal = ({ isOpen, onClose, order, loading, onSubmit }) => {
  const [formData, setFormData] = useState({
    status: '',
    adminNotes: '',
    trackingNumber: '',
    cancelReason: ''
  });

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || '',
        adminNotes: order.adminNotes || '',
        trackingNumber: order.trackingNumber || '',
        cancelReason: order.cancelReason || ''
      });
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(order.id, formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ xác nhận', description: 'Đơn hàng mới, chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận', description: 'Đơn hàng đã được xác nhận' },
    { value: 'PROCESSING', label: 'Đang xử lý', description: 'Đang chuẩn bị hàng' },
    { value: 'SHIPPING', label: 'Đang giao hàng', description: 'Hàng đang được vận chuyển' },
    { value: 'DELIVERED', label: 'Đã giao hàng', description: 'Hàng đã được giao thành công' },
    { value: 'COMPLETED', label: 'Hoàn thành', description: 'Đơn hàng hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy', description: 'Đơn hàng đã bị hủy' },
    { value: 'RETURNED', label: 'Đã trả hàng', description: 'Hàng đã được trả lại' }
  ];

  const needsTrackingNumber = formData.status === 'SHIPPING';
  const needsCancelReason = formData.status === 'CANCELLED' || formData.status === 'RETURNED';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Cập nhật trạng thái đơn hàng
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Đơn hàng:</div>
          <div className="font-medium text-gray-900">{order.orderNumber}</div>
          <div className="text-sm text-gray-600 mt-1">
            Khách hàng: {order.customerName}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái mới *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formData.status && (
              <p className="mt-1 text-xs text-gray-500">
                {statusOptions.find(opt => opt.value === formData.status)?.description}
              </p>
            )}
          </div>

          {/* Tracking Number - Show only for SHIPPING status */}
          {needsTrackingNumber && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã vận đơn
              </label>
              <input
                type="text"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleInputChange}
                placeholder="Nhập mã vận đơn..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          {/* Cancel Reason - Show only for CANCELLED or RETURNED status */}
          {needsCancelReason && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do {formData.status === 'CANCELLED' ? 'hủy' : 'trả hàng'} *
              </label>
              <textarea
                name="cancelReason"
                value={formData.cancelReason}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder={`Nhập lý do ${formData.status === 'CANCELLED' ? 'hủy' : 'trả hàng'}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
            </div>
          )}

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú admin
            </label>
            <textarea
              name="adminNotes"
              value={formData.adminNotes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Thêm ghi chú cho đơn hàng này..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hủy
            </button>
            <LoadingButton
              type="submit"
              loading={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              loadingClassName="px-4 py-2 text-sm font-medium text-white bg-indigo-400 border border-transparent rounded-md cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              Cập nhật
            </LoadingButton>
          </div>
        </form>

        {/* Status Change Warning */}
        {formData.status && formData.status !== order.status && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Lưu ý khi thay đổi trạng thái
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  {formData.status === 'CANCELLED' || formData.status === 'RETURNED' ? (
                    <p>Khi hủy/trả hàng, số lượng sản phẩm sẽ được hoàn lại kho.</p>
                  ) : formData.status === 'SHIPPING' ? (
                    <p>Đơn hàng sẽ chuyển sang trạng thái đang giao hàng.</p>
                  ) : (
                    <p>Trạng thái đơn hàng sẽ được cập nhật và gửi thông báo cho khách hàng.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusModal;