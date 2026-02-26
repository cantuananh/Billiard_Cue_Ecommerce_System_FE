import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If data is FormData, remove Content-Type so axios/browser sets multipart with boundary automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log detailed error info
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data
    });

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken: refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Show error toast for other errors
    // Skip toast for disabled account on login — Login.jsx will redirect to dedicated page
    const isDisabledError = error.response?.data?.message?.toLowerCase().includes('disabled');
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    
    // Don't show duplicate toasts - check if one is already showing
    if (!(isDisabledError && isLoginRequest)) {
      // Only show toast if it's not already showing (avoid spam)
      const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại!';
      
      // Use a flag to prevent duplicate toasts
      if (!error.config._toastShown) {
        error.config._toastShown = true;
        setTimeout(() => {
          if (error.config) error.config._toastShown = false;
        }, 1000);
        
        toast.error(errorMessage, {
          id: error.config?.url // Use URL as unique ID to prevent duplicates
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;