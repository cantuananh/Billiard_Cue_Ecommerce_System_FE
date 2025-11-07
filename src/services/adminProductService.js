import api from './api';

export const adminProductService = {
  // Get all products with filters and pagination
  getAllProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.status !== undefined) queryParams.append('status', params.status);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDir) queryParams.append('sortDir', params.sortDir);
    
    const response = await api.get(`/admin/products?${queryParams}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Toggle product status (active/inactive)
  toggleProductStatus: async (id) => {
    const response = await api.patch(`/admin/products/${id}/toggle-status`);
    return response.data;
  },

  // Upload product image
  uploadProductImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admin/products/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/admin/products/categories');
    return response.data;
  }
};