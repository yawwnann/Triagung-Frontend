import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

const api = axios.create({
  baseURL: "https://12737d69bb45.ngrok-free.app/api",
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
