import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

const api = axios.create({
  baseURL: "https://triagung-backend.up.railway.app/api",
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
