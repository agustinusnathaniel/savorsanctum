# ADR-0002: Use TanStack Start with Cloudflare Workers

**Status:** Accepted
**Date:** 2026-06-27
**Deciders:** @agustinusnathaniel

## Context

The application needs a React-based full-stack framework that supports server-side rendering, static prerendering, and deployment on edge infrastructure. The hosting platform is Cloudflare Workers, which requires Workers-compatible output.

## Decision

Use TanStack Start (via `@tanstack/react-start`) as the React metaframework, deployed to Cloudflare Workers using the official `@cloudflare/vite-plugin`. The framework provides file-based routing, server functions, prerendering, and sitemap generation out of the box. Deployment is handled via `wrangler deploy`.

## Consequences

- **Positive**: Full-stack React with server functions, static prerendering, and edge deployment from a single framework. File-based routing follows the TanStack Router convention already in use.
- **Positive**: The Cloudflare Vite plugin integrates seamlessly with the existing Vite-based build pipeline.
- **Negative**: TanStack Start is a relatively new framework with a smaller ecosystem than Next.js. Documentation and community resources are limited.
- **Negative**: Debugging server functions locally can be inconsistent with production behavior on Cloudflare Workers.

## Alternatives Considered

- **Next.js**: More mature ecosystem but requires the Next.js-specific router and has less straightforward Cloudflare Workers deployment.
- **Remix / React Router**: Strong data loading patterns but would have introduced a different routing paradigm than the existing TanStack Router setup.
