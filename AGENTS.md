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
