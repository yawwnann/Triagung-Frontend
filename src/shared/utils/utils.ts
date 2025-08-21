import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

const api = axios.create({
  baseURL: "https://trijaya-backend-backup-production-ed79.up.railway.app/api",
  // baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default api;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
