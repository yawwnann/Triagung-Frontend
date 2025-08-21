import axios from "axios";

// Tentukan baseURL dari environment variable, fallback ke lokal
type ViteEnv = { VITE_API_BASE_URL?: string };
const BASE_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: ViteEnv }).env?.VITE_API_BASE_URL) ||
  // "https://trijaya-backend-backup-production-ed79.up.railway.app/api";
  "http://127.0.0.1:8000/api";

// Konfigurasi utama untuk koneksi API backend
const ApiConfig = axios.create({
  baseURL: BASE_URL,
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
    const status = error?.response?.status;
    const data = error?.response?.data;
    const config = error?.config;
    const method = config?.method?.toUpperCase();
    const url = `${config?.baseURL || ""}${config?.url || ""}`;
    const message = error?.message;

    console.error(
      "[API] Kesalahan:",
      status ?? "JARINGAN",
      `${method || "REQ"} ${url || "-"}`,
      data ?? message
    );

    if (status === 401) {
      try {
        localStorage.removeItem("access_token");
      } catch {
        // abaikan error pembersihan storage
      }
      window.__forceLogout = true;
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        // Arahkan ke halaman login saat tidak berizin
        window.location.href = "/login";
      }
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
