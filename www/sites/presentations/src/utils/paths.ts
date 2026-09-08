// Centralized path helper for base URL support.
// All internal links should use href() to respect the base path
// configured in astro.config.mjs (e.g., '/presentations' for GitHub Pages).

const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export function href(path: string): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
