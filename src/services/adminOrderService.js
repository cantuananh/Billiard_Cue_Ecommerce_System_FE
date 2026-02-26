import api from './api';

const adminOrderService = {
  // Get all orders with pagination and filters
  getOrders: async (page = 0, size = 10, status = '', search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const response = await api.get(`/admin/orders?${params.toString()}`);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data;
  },

  // Get order by order number
  getOrderByOrderNumber: async (orderNumber) => {
    const response = await api.get(`/admin/orders/order-number/${orderNumber}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, statusData);
    return response.data;
  },

  // Get order statistics
  getOrderStatistics: async () => {
    const response = await api.get('/admin/orders/statistics');
    return response.data;
  },

  // Get revenue statistics
  getRevenueStatistics: async (startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/admin/orders/statistics/revenue?${params.toString()}`);
    return response.data;
  },

  // Get recent orders
  getRecentOrders: async (limit = 10) => {
    const response = await api.get(`/admin/orders/recent?limit=${limit}`);
    return response.data;
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get('/admin/orders/dashboard-stats');
    return response.data;
  }
};

export default adminOrderService;