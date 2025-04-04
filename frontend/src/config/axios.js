import axios from 'axios';

export const axiosi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://apex-store-backend-y1tk.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
axiosi.interceptors.request.use(
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