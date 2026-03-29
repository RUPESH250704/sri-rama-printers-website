import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

export const cardsAPI = {
  getAll: () => api.get('/cards'),
  getById: (id: string) => api.get(`/cards/${id}`),
  create: (formData: FormData) => api.post('/cards', formData),
  update: (id: string, formData: FormData) => api.put(`/cards/${id}`, formData),
  delete: (id: string) => api.delete(`/cards/${id}`),
};

export const ordersAPI = {
  create: (orderData: any) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getAll: () => api.get('/orders'),
  updateStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, { status }),
};

export const servicesAPI = {
  createOrder: (orderData: any) => api.post('/services/order', orderData),
  getAllOrders: () => api.get('/services/orders'),
  updateStatus: (id: string, status: string) => api.put(`/services/orders/${id}/status`, { status }),
};

export const shopsAPI = {
  submitReport: (reportData: any) => api.post('/shops/report', reportData),
  getAllReports: () => api.get('/shops/reports'),
  getLatestStock: (shopId: string) => api.get(`/shops/latest-stock/${shopId}`),
  getThisMonthEntries: (shopId: string) => api.get(`/shops/this-month-entries/${shopId}`),
};

export default api;