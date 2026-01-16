import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getPosterUrl(posterPath) {
  if (!posterPath) return "";
  if (posterPath.startsWith("http")) return posterPath;
  return `http://localhost:5000${posterPath}`;
}
