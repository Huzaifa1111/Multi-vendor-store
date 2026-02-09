// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true,
});

// Add request/response interceptors for debugging
api.interceptors.request.use(request => {
  console.log('Request URL:', (request.baseURL || '') + (request.url || ''));
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('API Error:', message);

    // Create a new error with the better message
    const enhancedError = new Error(message);
    (enhancedError as any).response = error.response;
    (enhancedError as any).status = error.response?.status;

    return Promise.reject(enhancedError);
  }
);

export default api;