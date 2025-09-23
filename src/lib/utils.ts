import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function getSeasonFromDate(date: Date): string {
  const month = date.getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'fall'
  return 'winter'
}

export function getCurrentSeason(): string {
  return getSeasonFromDate(new Date())
}

// Map font keys to CSS font-family stacks for cross-browser compatibility
export function getFontStack(fontKey: string): string {
  switch (fontKey) {
    case 'inter':
      return 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
    case 'poppins':
      return 'Poppins, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
    case 'merriweather':
      return 'Merriweather, Georgia, Cambria, "Times New Roman", Times, serif'
    case 'playfair':
      return '"Playfair Display", Georgia, Cambria, "Times New Roman", Times, serif'
    case 'dancing-script':
      return '"Dancing Script", "Segoe Script", "Bradley Hand", cursive'
    case 'pacifico':
      return 'Pacifico, "Segoe Script", "Brush Script MT", cursive'
    case 'caveat':
      return 'Caveat, "Segoe Script", "Bradley Hand", cursive'
    case 'special-elite':
      return '"Special Elite", "Courier New", Courier, monospace'
    case 'roboto-mono':
      return '"Roboto Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    default:
      return 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
  }
}