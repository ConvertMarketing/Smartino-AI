/**
 * Prefix an internal path with the deployment base path.
 *
 * GitHub Pages serves this site from /Smartino-AI/, so a bare "/foo" link
 * would 404. Astro exposes the base as import.meta.env.BASE_URL, but whether
 * it carries a trailing slash depends on config, so naive template
 * concatenation silently produces "/Smartino-AIfoo". Always route internal
 * paths through here.
 *
 * External URLs (http:, mailto:, tel:) must NOT be passed to this function.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
