/**
 * @docs
 * - https://scotthelme.co.uk/content-security-policy-an-introduction/
 * - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
 */
const contentSecurityPolicy = `
  default-src 'self' *.sznm.dev *.agustinusnathaniel.com;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' umami.sznm.dev cdn.vercel-insights.com vercel.live *.sznm.dev *.agustinusnathaniel.com;
  frame-src vercel.live;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/ *.sznm.dev *.agustinusnathaniel.com;
  img-src * blob: data: *.freepik.com;
  media-src 'none';
  connect-src *;
  font-src 'self' https://fonts.gstatic.com/ *.sznm.dev *.agustinusnathaniel.com;
`;

/**
 * @docs
 * - https://scotthelme.co.uk/content-security-policy-an-introduction/
 * - https://scotthelme.co.uk/hardening-your-http-response-headers/#x-content-type-options
 */
export const securityHeaders = {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  'Content-Security-Policy': contentSecurityPolicy.replace(/\n/g, ''),
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  'X-Frame-Options': 'DENY',
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  'X-Content-Type-Options': 'nosniff',
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  'X-DNS-Prefetch-Control': 'on',
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  'Permissions-Policy': 'geolocation=()',
};
