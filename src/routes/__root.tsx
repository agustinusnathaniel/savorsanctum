import { TanStackDevtools } from '@tanstack/react-devtools';
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { securityHeaders } from '@/lib/constants/security-headers';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/lib/constants/site';
import { Layout } from '@/lib/layout';
import globalCss from '@/lib/styles/globals.css?url';

const ogImgUrl = `https://og.sznm.dev/api/generate?heading=${encodeURIComponent(SITE_TITLE)}&text=${encodeURIComponent(SITE_DESCRIPTION)}&template=color`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title: SITE_TITLE,
      },
      {
        name: 'description',
        content: SITE_DESCRIPTION,
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
      {
        name: 'application-name',
        content: SITE_TITLE,
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: SITE_TITLE,
      },
      {
        name: 'format-detection',
        content: 'telephone=no',
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'theme-color',
        content: '#faf7f2',
        media: '(prefers-color-scheme: light)',
      },
      {
        name: 'theme-color',
        content: '#2d2520',
        media: '(prefers-color-scheme: dark)',
      },
      {
        name: 'og:type',
        content: 'website',
      },
      {
        name: 'og:url',
        content: SITE_URL,
      },
      {
        name: 'og:title',
        content: SITE_TITLE,
      },
      {
        name: 'og:description',
        content: SITE_DESCRIPTION,
      },
      {
        name: 'og:image',
        content: ogImgUrl,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:url',
        content: SITE_URL,
      },
      {
        name: 'twitter:title',
        content: SITE_TITLE,
      },
      {
        name: 'twitter:description',
        content: SITE_DESCRIPTION,
      },
      {
        name: 'twitter:image',
        content: ogImgUrl,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: globalCss,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon-180x180.png',
      },
    ],
    scripts: [
      ...(import.meta.env.VITE_UMAMI_SCRIPT_URL &&
      import.meta.env.VITE_UMAMI_WEBSITE_ID
        ? [
            {
              src: import.meta.env.VITE_UMAMI_SCRIPT_URL,
              async: true,
              'data-website-id': import.meta.env.VITE_UMAMI_WEBSITE_ID,
              'data-performance': 'true',
            },
          ]
        : []),
    ],
  }),
  headers: () => securityHeaders,
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <Scripts />
        <TanStackDevtools
          plugins={[
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </body>
    </html>
  ),
});
