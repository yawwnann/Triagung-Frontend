import axios from "axios";

// Konfigurasi utama untuk koneksi API backend
const ApiConfig = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 detik
});

// Interceptor global untuk auto logout saat token expired
ApiConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Simpan flag di window agar App.tsx bisa mendeteksi
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
