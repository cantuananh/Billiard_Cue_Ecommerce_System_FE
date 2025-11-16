import api from './api';

const categoryService = {
  // Get all categories (public API)
  getAllCategories: async () => {
    const response = await api.get('/public/categories');
    return response.data;
  },

  // Get category by ID (public API)
  getCategoryById: async (categoryId) => {
    const response = await api.get(`/public/categories/${categoryId}`);
    return response.data;
  },

  // Get featured categories (public API)
  getFeaturedCategories: async (limit = 6) => {
    const response = await api.get(`/public/categories/featured?limit=${limit}`);
    return response.data;
  }
};

export default categoryService;