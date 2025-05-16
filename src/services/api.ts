import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001'
});

export default api;

export const getUnits = async () => {
  const response = await api.get('/api/units');
  return response.data;
};

export const getTables = async (unitId: number) => {
  const response = await api.get(`/api/units/${unitId}/tables`);
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

export const testConnection = async () => {
  const response = await api.get('/api/test');
  return response.data;
};