import axios from 'axios';
import { toast } from 'react-toastify';
import { storage } from '../utils/storage';
import { uploadAPI } from '../utils/imageUpload';

// Base URL for API requests
// const BASE_URL = 'https://srv694651.hstgr.cloud/solar/api/v1';
// const BASE_URL = 'http://localhost:5005/api/v1';
const BASE_URL = 'https://srv694651.hstgr.cloud/solar/api/v1'; 

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management state
let authState = {
  token: null,
  isInitialized: false
};

// Function to update token in axios and cache
export const updateApiToken = (token) => {
  console.log('🔐 updateApiToken called with token:', token ? 'present' : 'null');
  
  authState.token = token;
  authState.isInitialized = true;
  
  if (token) {
    // Set in axios default headers for immediate effect
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('🔐 Token set in axios default headers');
  } else {
    // Remove from axios default headers
    delete api.defaults.headers.common['Authorization'];
    console.log('🔐 Token removed from axios default headers');
  }
};

// Initialize token on app start
const initializeToken = () => {
  try {
    console.log('🔐 Initializing token from storage...');
    const token = storage.getToken();
    if (token) {
      console.log('🔐 Found token in storage, setting up auth');
      updateApiToken(token);
    } else {
      console.log('🔐 No token found in storage');
      authState.isInitialized = true;
    }
  } catch (error) {
    console.error('🔐 Error initializing token:', error);
    authState.isInitialized = true;
  }
};

// Initialize immediately
initializeToken();

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      // Wait for initialization if not done yet
      if (!authState.isInitialized) {
        console.log('🔐 Waiting for token initialization...');
        initializeToken();
      }

      // Get fresh token from storage for each request
      const token = storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Request interceptor - Token added to request');
      }
      
      return config;
    } catch (error) {
      console.error('🔐 Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only data part
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('🔐 Token expired, clearing auth data');
      
      try {
        // Clear expired token
        storage.clearAuthData();
        updateApiToken(null);
        
        // Redirect to login - you might want to use navigation service here
        window.location.href = '/';
        return Promise.reject(error);
      } catch (tokenError) {
        console.error('🔐 Error handling token expiration:', tokenError);
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'فشل في الاتصال بالخادم. تحقق من اتصال الإنترنت.',
        type: 'network'
      });
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ غير متوقع';
    console.error('API Error:', error.response?.data || error.message);
    
    return Promise.reject({
      ...error.response?.data,
      message: errorMessage,
      status: error.response?.status
    });
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  
  verifyOTP: async (phone, otp) => {
    try {
      console.log('🔐 API verifyOTP starting...');
      const response = await api.post(`/auth/verify-otp/${phone}`, { otp });
      console.log('🔐 API verifyOTP response received');

      // Save token and user data if verification is successful
      if (response?.data?.token) {
        console.log('🔐 OTP verified, saving token and updating axios...');
        storage.setToken(response.data.token);
        updateApiToken(response.data.token);
        console.log('🔐 Token saved and axios updated after OTP verification');
      }
      if (response?.data?.user) { 
        storage.setUserData(response.data.user);
        console.log('🔐 User data saved after OTP verification');
      }

      return response;
    } catch (error) {
      console.error('🔐 API verifyOTP error:', error);
      throw error;
    }
  },
  
  requestOTP: (phone) => api.post("/auth/request-otp", { phone }),
  
  login: async (data) => {
    try {
      console.log('🔐 API login starting...');
      const response = await api.post("/auth/login", data);
      console.log('🔐 API login response received');

      // Save token and user data and immediately update axios
      if (response?.data?.token) {
        console.log('🔐 Saving token and updating axios...');
        storage.setToken(response.data.token);
        updateApiToken(response.data.token);
        console.log('🔐 Token saved and axios updated successfully');
      }
      if (response?.data?.user) { 
        storage.setUserData(response.data.user);
        console.log('🔐 User data saved successfully');
      }

      return response;
    } catch (error) {
      console.error('🔐 API login error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      console.log('🔐 API logout starting...');
      const response = await api.post("/auth/logout");
      // Always clear local storage and token cache regardless of API response
      storage.clearAuthData();
      updateApiToken(null);
      console.log('🔐 Logout completed, token cleared');
      return response;
    } catch (error) {
      // Clear local storage and token cache even if API call fails
      console.log('🔐 Logout API failed, clearing token anyway');
      storage.clearAuthData();
      updateApiToken(null);
      throw error;
    }
  },
  
  getProfile: () => {
    console.log('🔐 Getting profile, current auth header:', api.defaults.headers.common['Authorization'] ? 'present' : 'missing');
    return api.get("/auth/profile");
  },
  
  updateProfile: (data) => {
    console.log('🔐 Updating profile, current auth header:', api.defaults.headers.common['Authorization'] ? 'present' : 'missing');
    return api.put("/auth/update-profile", data);
  },
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get("/marketplace/browse-products", { params }),

  searchProducts: (params) => api.get("/marketplace/search-products", { params }),

  filterProducts: (params) => api.get("/marketplace/filters-product", { params }),

  getProductById: (id) => api.get(`/marketplace/getOneProduct/${id}`),

  createProduct: async (productData) => {
    console.log('🔐 Creating product, current auth header:', api.defaults.headers.common['Authorization'] ? 'present' : 'missing');
    // Images are already uploaded and URLs are provided in productData.images
    return api.post("/products/post", productData);
  },

  getUserProducts: (params = {}) => {
    console.log('🔐 Getting user products, current auth header:', api.defaults.headers.common['Authorization'] ? 'present' : 'missing');
    return api.get(`/products/user-products`, { params });
  },
  
  updateProduct: (id, data) => {
    console.log('🔐 Updating product, current auth header:', api.defaults.headers.common['Authorization'] ? 'present' : 'missing');
    return api.patch(`/products/update-products/${id}`, data);
  },
  
  deleteProduct: (id) => {
    console.log('🔐 Deleting product, current auth header:', api.defaults.headers.common['Authorization'] ? 'present' : 'missing');
    return api.delete(`/products/delete-product/${id}`);
  },
  
  likeProduct: (id) => api.post(`/products/${id}/like`),
  
  unlikeProduct: (id) => api.delete(`/products/${id}/like`),
};

// Engineers API
export const engineersAPI = {
  getEngineers: (params) => api.get("/marketplace/getAllEngineer", { params }),
  searchEngineers: (params) => api.get("/marketplace/filters-engineer", { params }),
  getEngineerById: (id) => api.get(`/marketplace/getOneEngineer/${id}`),
};

// Shops API
export const shopsAPI = {
  getShops: (params) => api.get("/marketplace/getAllShops", { params }),
  searchShops: (params) => api.get("/marketplace/filters-shop", { params }),
  getShopById: (id) => api.get(`/marketplace/getOneShop/${id}`),
};

// Ads API
export const adsAPI = {
  getAds: (params) => api.get("/marketplace/getAllAds", { params }),
  searchAds: (params) => api.get("/marketplace/filters-ads", { params }),
};

export const getAllAds = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/marketplace/getAllAds`);
    return {
      data: response.data.data || [],
      total: response.data.total || 0,
      message: response.data.message || '',
      status: response.data.status || 200
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch ads');
  }
};

// Governorates API
export const governoratesAPI = {
  getGovernorates: () => api.get("/marketplace/get/governorate-data"),
};

// Unified search API for all content types
export const searchAPI = {
  searchAll: async (params) => {
    const { search_keyword, ...filters } = params;
    
    if (!search_keyword?.trim()) {
      return {
        products: { data: [], total: 0 },
        engineers: { data: [], total: 0 },
        shops: { data: [], total: 0 },
        ads: { data: [], total: 0 }
      };
    }

    try {
      const [productsRes, engineersRes, shopsRes, adsRes] = await Promise.allSettled([
        productsAPI.searchProducts({ search_keyword, ...filters }),
        engineersAPI.searchEngineers({ search_keyword, ...filters }),
        shopsAPI.searchShops({ search_keyword, ...filters }),
        adsAPI.searchAds({ search_keyword, ...filters })
      ]);

      return {
        products: productsRes.status === 'fulfilled' ? productsRes.value : { data: [], total: 0 },
        engineers: engineersRes.status === 'fulfilled' ? engineersRes.value : { data: [], total: 0 },
        shops: shopsRes.status === 'fulfilled' ? shopsRes.value : { data: [], total: 0 },
        ads: adsRes.status === 'fulfilled' ? adsRes.value : { data: [], total: 0 }
      };
    } catch (error) {
      console.error('Unified search error:', error);
      throw error;
    }
  }
};

export default api;