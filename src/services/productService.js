import api from './api';

const productService = {
  // Get all products with pagination and filters (public API)
  getProducts: async (page = 0, size = 20, filters = {}) => {
    const {
      categoryId = null,
      search = '',
      sortBy = 'createdAt',
      sortDir = 'desc',
      minPrice = null,
      maxPrice = null
    } = filters;

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });
    
    if (categoryId) params.append('categoryId', categoryId);
    if (search) params.append('search', search);
    if (minPrice !== null && minPrice >= 0) params.append('minPrice', minPrice.toString());
    if (maxPrice !== null && maxPrice >= 0) params.append('maxPrice', maxPrice.toString());
    
    const response = await api.get(`/public/products?${params.toString()}`);
    return response.data;
  },

  // Get product by ID (public API)
  getProductById: async (productId) => {
    const response = await api.get(`/public/products/${productId}`);
    return response.data;
  },

  // Get featured products (public API)
  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get(`/public/products/featured?limit=${limit}`);
    return response.data;
  },

  // Get products by category (public API)
  getProductsByCategory: async (categoryId, page = 0, size = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });
    
    const response = await api.get(`/public/products/category/${categoryId}?${params.toString()}`);
    return response.data;
  },

  // Search products (public API)
  searchProducts: async (query, page = 0, size = 20) => {
    const params = new URLSearchParams({
      search: query,
      page: page.toString(),
      size: size.toString()
    });
    
    const response = await api.get(`/public/products/search?${params.toString()}`);
    return response.data;
  }
};

export default productService;