import axios from "axios";

// Konfigurasi utama untuk koneksi API backend
const ApiConfig = axios.create({
  baseURL: "https://trijaya-backend-backup-production.up.railway.app/api",

  // baseURL: "https://triagung-backend-production.up.railway.app/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 detik
});

// Add request interceptor to automatically add Authorization header
ApiConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

ApiConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    if (error.response && error.response.status === 401) {
      window.__forceLogout = true;
    }
    return Promise.reject(error);
  }
);

declare global {
  interface Window {
    __forceLogout?: boolean;
  }
}

export default ApiConfig;
