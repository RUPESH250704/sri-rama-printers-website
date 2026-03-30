import axios from 'axios';

const configuredApiUrl = process.env.REACT_APP_API_URL?.trim();
const defaultApiUrl = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:5000/api';

export const API_URL = (configuredApiUrl || defaultApiUrl).replace(/\/$/, '');

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
  getInchargeOptions: () => api.get('/auth/incharge-options'),
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
  getReportedDates: (shopId: string) => api.get(`/shops/reported-dates/${shopId}`),
  getEntriesByMonth: (shopId: string, month: number, year: number) =>
    api.get(`/shops/entries/${shopId}?month=${month}&year=${year}`),
  getLatestStock: (shopId: string) => api.get(`/shops/latest-stock/${shopId}`),
  getThisMonthEntries: (shopId: string) => api.get(`/shops/this-month-entries/${shopId}`),
};

export default api;