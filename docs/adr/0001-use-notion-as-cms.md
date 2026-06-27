# ADR-0001: Use Notion as CMS

**Status:** Accepted
**Date:** 2026-06-27
**Deciders:** @agustinusnathaniel

## Context

The application needs a content management system for curating culinary items, products, and reading materials. The content is maintained by a non-technical editor who needs a familiar interface for adding and updating entries. A headless CMS would introduce third-party costs and a separate admin panel to learn.

## Decision

Use Notion as the content management system. Each content category (food, products) has its own Notion database. The application authenticates via a Notion integration token (`VITE_NOTION_TOKEN`) and queries the databases by their IDs (`VITE_NOTION_CULINARIES_DATASOURCE_ID`, `VITE_NOTION_PRODUCTS_DATASOURCE_ID`) using the Notion SDK (`@notionhq/client`).

## Consequences

- **Positive**: Editors use a familiar interface with zero additional tooling costs. Notion's built-in permissions and audit log handle access control.
- **Positive**: Adding or modifying entries requires no code changes or redeployment — data is fetched at runtime.
- **Negative**: The application depends on Notion API availability and rate limits. API changes from Notion could break data fetching.
- **Negative**: The Notion SDK only runs server-side; client-side code cannot query Notion directly.

## Alternatives Considered

- **Sanity / Contentful**: Feature-rich but introduce monthly costs and a second interface to learn.
- **Custom admin panel**: Full control but high development and maintenance effort for a content-curation-only use case.
