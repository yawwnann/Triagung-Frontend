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

export default ApiConfig;
