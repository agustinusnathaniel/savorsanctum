# Security

## Content Security Policy (CSP)

The CSP is applied at two layers:

1. **SSR layer** — `src/lib/constants/security-headers.ts` applied via TanStack Start's `headers()` in `src/routes/__root.tsx`
2. **Platform layer** — `vercel.json`, `netlify.toml`, `public/_headers` (Cloudflare Pages) as defense-in-depth

All platform configs must match the source of truth in `security-headers.ts`. Run `pnpm validate:csp` to verify.

### Policy Directives

| Directive | Value | Rationale |
|-----------|-------|-----------|
| `default-src` | `'self'` | Fallback: same-origin only |
| `script-src` | `'self' 'unsafe-inline' umami.sznm.dev *.sznm.dev` | `'unsafe-inline'` required for TanStack Start hydration; Umami analytics |
| `style-src` | `'self' 'unsafe-inline' https://fonts.googleapis.com *.sznm.dev` | Google Fonts; inline styles for React components |
| `img-src` | `'self' blob: data: https: *.sznm.dev` | HTTPS images from any source (og.sznm.dev proxies images) |
| `media-src` | `'none'` | No media elements |
| `connect-src` | `'self' https://api.notion.com https://umami.sznm.dev *.sznm.dev` | Notion API, Umami analytics |
| `font-src` | `'self' https://fonts.gstatic.com *.sznm.dev` | Google Fonts |
| `frame-ancestors` | `'none'` | Prevents framing (clickjacking protection) |
| `base-uri` | `'self'` | Prevents base tag injection |
| `form-action` | `'self'` | Form submissions same-origin only |

### Other Security Headers

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |

### CSP Evaluator

Test your CSP at: https://csp-evaluator.withgoogle.com/

## Production Checklist

- [ ] Verify CSP headers on your host (Vercel/Netlify/Cloudflare)
- [ ] Confirm `connect-src` only allows required API origins
- [ ] Check no console errors from CSP violations in production
- [ ] Validate `frame-ancestors 'none'` prevents embedding
- [ ] Ensure HSTS is active with preload

## What NOT to Do

- Add `'unsafe-eval'` to `script-src` unless absolutely required
- Use `connect-src *` — always specify allowed origins
- Use `img-src *` — use `https:` if broad HTTPS access is needed
- Commit `.env` files with secrets
- Use `dangerouslySetInnerHTML` with unsanitized content
