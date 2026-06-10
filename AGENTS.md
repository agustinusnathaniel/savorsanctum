# AGENTS.md

**Canonical Instructions for AI Agents**

This file outlines the constraints, patterns, and commands that AI agents must follow when working in this repository. 
It inherits rules from the [Canonical Guidelines](https://github.com/agustinusnathaniel/canonical-guidelines).

## 1. Context & Invariants

- **Project Type**: React 19 + Vite Web Application.
- **Package Manager**: `pnpm`. **DO NOT** use `npm` or `yarn`.
- **Language**: TypeScript. Strict mode is enabled.
- **Style**: 
  - **Styling**: TailwindCSS 4. Use utility classes; avoid inline styles.
  - **Formatting**: Biome. Run `pnpm biome:check` to verify.
- **Routing**: TanStack Router. File-based routing in `src/routes`.

## 2. Operational Constraints

### DO NOT:
- **Do not** modify `pnpm-lock.yaml` manually.
- **Do not** use `any` type. Always define proper interfaces or use `unknown` if necessary.
- **Do not** create new CSS files. Use `globals.css` or Tailwind utilities.
- **Do not** use `useEffect` for data fetching. Use appropriate services or TanStack Query (if added).

### MUST DO:
- **Must** run `pnpm biome:check` before confirming changes.
- **Must** use absolute imports (e.g., `@/lib/...`) defined in `tsconfig.json`.
- **Must** ensure all environment variables are accessed via `import.meta.env`.

## 3. Common Tasks

### Build & Verification
```bash
# Type check
pnpm type:check

# Lint and Format check
pnpm biome:check

# Fix formatting
pnpm biome:fix

# Run tests
pnpm test
```

### File Structure
- `src/routes`: Application routes (TanStack Router).
- `src/lib/services/notion`: Notion API integration logic.
- `src/lib/components/ui`: Reusable UI components.
- `src/lib/models`: Data type definitions.
- `content/changelog`: User-facing changelog entries (MDX).

### Changelog Conventions

Changelog entries are **user-facing product updates**, not developer-facing commit logs. They live in `content/changelog/` as MDX files and are picked up automatically by the glob loader in `src/lib/pages/changelog/entries.tsx`.

**To add a new entry:** Create `content/changelog/vX.Y.Z.mdx` (or `unreleased.mdx` for unreleased work). No other code changes needed.

**MDX file format:**
```mdx
export const version = "X.Y.Z";
export const date = "YYYY-MM-DD";
export const tag = "new" | "improved" | "fixed";
export const title = "Short Catchy Title";

One sentence summarizing the value, not the implementation.

### What's Included

- **Feature name** — description of what the user can do now
```

**Writing rules:**
- **Title**: Short and punchy (2-4 words). No version numbers, no developer jargon.
- **Subtitle**: One sentence summarizing the value to the user, not the implementation.
- **Sections**: Use "What's Included" as the main section. Omit empty sections.
- **List items**: `**Bold label** — plain description` format.
- **Tone**: Active voice, direct, second-person ("you"/"your"). No marketing fluff, no "we" statements, no emojis.
- **Tag values**: `"new"` for new features, `"improved"` for fixes/refinements, `"fixed"` for bug fixes.
- **Perspective**: Always from the user's point of view. Describe what they can do, not how it was built.
- **No technical jargon**: Never mention libraries, frameworks, APIs, or implementation details (e.g., "Notion", "ISR", "CSP", "fuzzy search"). Use plain language instead (e.g., "constantly updated", "faster loading", "smoother browsing").
- **No technical jargon**: Never mention libraries, frameworks, APIs, or implementation details (e.g., "Notion", "ISR", "CSP", "fuzzy search"). Use plain language instead (e.g., "constantly updated", "faster loading", "smoother browsing").

## 4. Documentation References

- **Architecture**: See `README.md`.
- **Data Specs**: See `SPEC.md`.
- **External Rules**: [Canonical Guidelines](https://github.com/agustinusnathaniel/canonical-guidelines).

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
