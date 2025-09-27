import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Функция для получения первой буквы имени пользователя
export function getInitials(name) {
  if (!name) return "U";
  return name.charAt(0).toUpperCase();
}
