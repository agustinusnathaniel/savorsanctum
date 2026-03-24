import { createRouter } from '@tanstack/react-router';

import Page404 from '@/lib/pages/404';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createRouter({
    routeTree,
    context: {},
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: () => (
      <div className="mx-auto">
        <p>Loading…</p>
      </div>
    ),
    defaultErrorComponent: ({ error }) => <div>{error.message}</div>,
    defaultNotFoundComponent: () => <Page404 />,
  });

  return router;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
