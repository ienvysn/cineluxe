import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getPosterUrl(posterPath) {
  if (!posterPath) return "";
  if (posterPath.startsWith("http")) return posterPath;
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${API_BASE}${posterPath}`;
}
