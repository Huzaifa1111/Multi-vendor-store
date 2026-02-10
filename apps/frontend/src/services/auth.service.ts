// apps/frontend/src/services/auth.service.ts - UPDATED
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }

    if (!error.response) {
      // Network error or server not running
      throw new Error(`Cannot connect to server. Please make sure the backend is running on ${API_URL}`);
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await api.post('/auth/login', credentials);

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      if (error.message.includes('Cannot connect to server')) {
        throw new Error(`Backend server is not running. Please start the backend on ${API_URL}`);
      }

      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Login failed'
      );
    }
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string
  }) {
    try {
      const response = await api.post('/auth/register', userData);

      // NEW: Check if OTP verification is required
      if (response.data.requiresVerification) {
        return {
          requiresVerification: true,
          email: response.data.email,
          message: response.data.message
        };
      }

      // Old flow - direct login
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      if (error.message.includes('Cannot connect to server')) {
        throw new Error(`Backend server is not running. Please start the backend on ${API_URL}`);
      }

      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Registration failed'
      );
    }
  },

  // NEW: Verify OTP
  async verifyOtp(otpData: { email: string; otp: string }) {
    try {
      const response = await api.post('/auth/verify-otp', otpData);

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'OTP verification failed'
      );
    }
  },

  // NEW: Resend OTP
  async resendOtp(email: string) {
    try {
      const response = await api.post('/auth/resend-otp', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to resend OTP'
      );
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Session expired. Please login again.');
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Also export individual functions
export const login = authService.login;
export const register = authService.register;
export const verifyOtp = authService.verifyOtp;
export const resendOtp = authService.resendOtp;
export const getCurrentUser = authService.getCurrentUser;
export const logout = authService.logout;