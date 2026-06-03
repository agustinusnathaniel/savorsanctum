/**
 * Centralized security headers configuration.
 * Update CSP here — all platform configs import from this source.
 *
 * NOTE: CSP must be set via HTTP headers (not <meta> tags) for script-src to work.
 * The <meta> CSP spec only allows default-src.
 *
 * @docs
 * - https://scotthelme.co.uk/content-security-policy-an-introduction/
 * - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
 */

export const CSP_VALUE = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' umami.sznm.dev *.sznm.dev",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com *.sznm.dev",
  "img-src 'self' blob: data: https: *.sznm.dev",
  "media-src 'none'",
  "connect-src 'self' https://api.notion.com https://umami.sznm.dev *.sznm.dev",
  "font-src 'self' https://fonts.gstatic.com *.sznm.dev",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

/**
 * @docs
 * - https://scotthelme.co.uk/content-security-policy-an-introduction/
 * - https://scotthelme.co.uk/hardening-your-http-response-headers/#x-content-type-options
 */
export const securityHeaders = {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  'Content-Security-Policy': CSP_VALUE,
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  'X-Frame-Options': 'DENY',
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  'X-Content-Type-Options': 'nosniff',
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
  'Cross-Origin-Opener-Policy': 'same-origin',
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy
  'Cross-Origin-Resource-Policy': 'same-origin',
};
