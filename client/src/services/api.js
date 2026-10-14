import axios from 'axios';

// Create central Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stayease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle centralized errors (such as 401 unauthorized)
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired
      localStorage.removeItem('stayease_token');
      localStorage.removeItem('stayease_user');
    }
    return Promise.reject(error);
  }
);

export default api;
