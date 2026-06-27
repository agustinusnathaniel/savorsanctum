import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.*', 'src/**/*.spec.*', 'src/routeTree.gen.ts'],
    },
    globals: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
});
