import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      if (window.location.pathname.startsWith('/student') || window.location.pathname.startsWith('/$/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
