# Contributing to SavorSanctum

We welcome contributions! Please follow the guidelines below to ensure a smooth collaboration.

## 1. Workflow

1.  **Fork & Clone**: Fork the repository and clone it locally.
2.  **Branch**: Create a feature branch (`git checkout -b feature/my-feature`).
3.  **Install**: Run `pnpm install` to ensure dependencies are up to date.
4.  **Develop**: Make your changes.
5.  **Verify**: Run the verification suite:
    ```bash
    pnpm check:turbo
    ```
    This runs Biome, Type Check, and Tests.
6.  **Commit**: Use Conventional Commits (e.g., `feat: add new filter`).
7.  **Push & PR**: Push to your fork and open a Pull Request.

## 2. Coding Standards

This project follows strict coding standards enforced by **Biome** and **TypeScript**.

- **Formatting**: We use Biome. Do not use Prettier or ESLint.
- **Type Safety**: No `any`. Strict null checks are on.
- **Components**: Functional components only. Use hooks.
- **Styling**: TailwindCSS. Keep standard sizing and colors.

## 3. Documentation

- Update `README.md` if architectural changes are made.
- Update `SPEC.md` if data models change.
- Respect the rules in `AGENTS.md`.

## 4. Canonical Guidelines

Please review the [Canonical Guidelines](https://github.com/agustinusnathaniel/canonical-guidelines) for deeper insight into our engineering philosophy.
