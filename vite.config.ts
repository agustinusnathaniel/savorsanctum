import { cloudflare } from '@cloudflare/vite-plugin';
import { ValidateEnv } from '@julr/vite-plugin-validate-env';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa';
import { defineConfig } from 'vite-plus';

const pwaOptions: Partial<VitePWAOptions> = {
  // TODO: enable if you want to enable PWA service worker
  disable: true,
  registerType: 'autoUpdate',
  base: '/',
  manifest: {
    short_name: 'vite-react-tailwind-starter',
    name: 'Vite React App Template',
    theme_color: '#000000',
    lang: 'en',
    start_url: '/',
    background_color: '#FFFFFF',
    dir: 'ltr',
    display: 'standalone',
    prefer_related_applications: false,
  },
  pwaAssets: {
    disabled: false,
    config: true,
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isCheckDisabled = mode === 'production' || !!process.env.VITEST;
  return {
    lint: {
      options: { typeAware: true, typeCheck: true },
      // disable vp check
      ignorePatterns: ['**/*'],
    },
    fmt: {
      singleQuote: true,
      // disable vp fmt
      ignorePatterns: ['**/*'],
    },
    staged: {
      'src/**/*.{js,jsx,ts,tsx,json,css,scss,md}': [
        'biome check --write --no-errors-on-unmatched --error-on-warnings',
      ],
      '*.{ts,js,json,md}': [
        'biome check --write --no-errors-on-unmatched --error-on-warnings',
      ],
    },
    plugins: [
      ValidateEnv(),
      devtools(),
      mdx(),
      cloudflare({ viteEnvironment: { name: 'ssr' } }),
      tanstackStart({
        prerender: {
          enabled: true,
          crawlLinks: true,
        },
        sitemap: {
          host: 'https://savorsanctum.sznm.dev',
          enabled: true,
        },
      }),
      viteReact(),
      tailwindcss(),
      ...(!isCheckDisabled
        ? [
            checker({
              typescript: true,
            }),
          ]
        : []),
      VitePWA(pwaOptions),
    ],
    server: {
      open: true,
    },
    resolve: {
      tsconfigPaths: true,
    },
  };
});
