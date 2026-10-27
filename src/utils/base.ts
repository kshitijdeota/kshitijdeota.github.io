/**
 * Base-path helper.
 *
 * The production site is served from the domain root, but the local test
 * deploy builds with KDPX_BASE=/kdpixels/ (subfolder inside the server's
 * existing dev docroot). Every internal href / asset path must go through
 * these helpers so both builds work without changes.
 */

const RAW_BASE = import.meta.env.BASE_URL || '/';

/** '' for root builds, '/kdpixels' for subfolder builds */
const B = RAW_BASE === '/' ? '' : RAW_BASE.replace(/\/$/, '');

/** Prefix an absolute site path ('/apps/') with the configured base */
export function p(path: string): string {
  return `${B}${path}`;
}

/** Strip the base prefix from a URL path (inverse of p) */
export function strip(path: string): string {
  return B && path.startsWith(B) ? path.slice(B.length) : path;
}
