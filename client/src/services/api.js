import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vibely_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on a protected route, remove stored token
      const isAuthRoute = error.config.url.includes('/auth/me');
      if (isAuthRoute) {
        localStorage.removeItem('vibely_token');
        localStorage.removeItem('vibely_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
