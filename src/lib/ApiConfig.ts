import axios from "axios";

// Konfigurasi utama untuk koneksi API backend
const ApiConfig = axios.create({
  baseURL: "https://triagung-backend-production.up.railway.app/api",
  // baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 detik
});

ApiConfig.interceptors.response.use(
  (response) => response,
  (error) => {
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
