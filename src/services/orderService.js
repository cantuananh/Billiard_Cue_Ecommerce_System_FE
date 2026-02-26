import api from './api';

const orderService = {
  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    const response = await api.post('/customer/orders', orderData);
    return response.data;
  },

  // Lấy danh sách đơn hàng của tôi
  getMyOrders: async (page = 0, size = 10) => {
    const response = await api.get('/customer/orders', { params: { page, size } });
    return response.data;
  },

  // Lấy chi tiết đơn hàng theo ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/customer/orders/${orderId}`);
    return response.data;
  },

  // Lấy đơn hàng theo orderNumber
  getOrderByOrderNumber: async (orderNumber) => {
    const response = await api.get(`/customer/orders/order-number/${orderNumber}`);
    return response.data;
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId, reason) => {
    const response = await api.put(`/customer/orders/${orderId}/cancel`, null, {
      params: { reason },
    });
    return response.data;
  },
};

export default orderService;
