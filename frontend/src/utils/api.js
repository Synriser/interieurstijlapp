import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Styles API
export const getStyles = () => api.get('/styles');
export const getStyleById = (id) => api.get(`/styles/${id}`);

// Upload API
export const uploadImage = (formData) =>
  api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Projects API
export const createProject = (data) => api.post('/projects', data);

// Paint Products API
export const getAllPaintProducts = (params) => api.get('/paint', { params });
export const getPaintProductById = (id) => api.get(`/paint/${id}`);
export const matchColorToPaint = (hexColor, options = {}) =>
  api.post('/paint/match-color', { hexColor, ...options });
export const getPopularPaintProducts = (limit = 10) =>
  api.get('/paint/popular', { params: { limit } });
export const getPaintBrands = () => api.get('/paint/brands');
export const searchPaintProducts = (query, limit = 20) =>
  api.get('/paint/search', { params: { q: query, limit } });

export default api;
