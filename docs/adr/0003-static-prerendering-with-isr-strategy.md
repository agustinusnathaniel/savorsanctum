# ADR-0003: Static Prerendering with ISR Strategy

**Status:** Accepted
**Date:** 2026-06-27
**Deciders:** @agustinusnathaniel

## Context

The application fetches content from Notion at runtime. Serving every request from the origin server adds latency and load. The content changes infrequently (editor updates a few times a week), so full dynamic rendering is wasteful. However, content is not entirely static — editors do add and update entries.

## Decision

Use TanStack Start's prerendering to generate static HTML at build time for all pages (`crawlLinks: true`). Deploy on Cloudflare Workers, which handles caching at the edge automatically. This provides the performance of static content while allowing cache invalidation when new builds are deployed.

## Consequences

- **Positive**: Static HTML loads instantly on first visit with no server round-trip. Edge caching from Cloudflare Workers serves subsequent requests from the nearest region.
- **Positive**: Build-time prerendering catches link errors and missing pages before deployment.
- **Negative**: Content updates require a new build and deployment to reflect on the site. This is acceptable given the update frequency (a few times per week).
- **Negative**: Pages with dynamic query parameters (filters, search) cannot be fully prerendered for every combination and require client-side hydration.

## Alternatives Considered

- **Full SSR**: Every request rendered on the server — higher latency and infrastructure cost for content that changes infrequently.
- **Full static (no ISR)**: Fastest performance but stale content until the next manual build. No mechanism to trigger rebuilds from Notion updates.
- **On-demand ISR**: Would allow cache invalidation on Notion webhook — more complex to implement and requires a publicly accessible invalidation endpoint.
