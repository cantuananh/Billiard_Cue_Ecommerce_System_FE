import api from './api';

export const adminCategoryService = {
  // Get all categories with filters and pagination
  getAllCategories: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.search) queryParams.append('search', params.search);
    // Only add isActive if it's a boolean (not null or undefined)
    if (params.status !== null && params.status !== undefined) {
      queryParams.append('isActive', params.status);
    }
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDir) queryParams.append('sortDir', params.sortDir);
    
    const response = await api.get(`/admin/categories?${queryParams}`);
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
  },

  // Create new category
  createCategory: async (categoryData) => {
    console.log('Sending category data:', categoryData);
    const response = await api.post('/admin/categories', categoryData);
    console.log('Response:', response.data);
    return response.data;
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // Toggle category status (active/inactive)
  toggleCategoryStatus: async (id) => {
    const response = await api.patch(`/admin/categories/${id}/toggle-status`);
    return response.data;
  },

  // Get active categories
  getActiveCategories: async () => {
    const response = await api.get('/admin/categories/active');
    return response.data;
  }
};