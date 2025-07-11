import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: "https://triagung-backend.up.railway.app/api",
=======
  baseURL: "https://triagung-backend-production.up.railway.app/api",
  // baseURL: "http://127.0.0.1:8000/api",
>>>>>>> 237fd43a7d032cff894f049bb73030ece15baa5d
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
