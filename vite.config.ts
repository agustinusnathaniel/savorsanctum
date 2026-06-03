import { ValidateEnv } from '@julr/vite-plugin-validate-env';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
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
    lint: { options: { typeAware: true, typeCheck: true } },
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
      nitro({
        routeRules: {
          '/**': {
            headers: {
              'Strict-Transport-Security':
                'max-age=31536000; includeSubDomains; preload',
              'X-Content-Type-Options': 'nosniff',
              'X-Frame-Options': 'DENY',
              'Referrer-Policy': 'strict-origin-when-cross-origin',
              'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
              'Cross-Origin-Opener-Policy': 'same-origin',
              'Cross-Origin-Resource-Policy': 'same-origin',
              'Content-Security-Policy':
                "default-src 'self'; script-src 'self' 'unsafe-inline' umami.sznm.dev *.sznm.dev; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com *.sznm.dev; img-src 'self' blob: data: https: *.sznm.dev; media-src 'none'; connect-src 'self' https://api.notion.com https://umami.sznm.dev *.sznm.dev; font-src 'self' https://fonts.gstatic.com *.sznm.dev; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
            },
          },
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
