import axios from 'axios';

// Dynamically use the deployed cloud URL or fallback to local port 5000
// Dynamically use the deployed cloud URL or fallback to the live production Render Docker URL
// Hardcoded production URL with /api suffix included to prevent routing 404s
export const API_BASE_URL = 'https://codeshield-backend-docker.onrender.com/api';
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('codeshield_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;