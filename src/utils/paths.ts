/**
 * Resolve a page path relative to the app base URL.
 * Works correctly on both GitHub Pages (/taskform/) and Walrus Site (/).
 */
export function pagePath(path: string): string {
  const base = import.meta.env.BASE_URL
  // Remove leading slash from path to avoid double slashes
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${base}${clean}`
}
