import { createFileRoute } from '@tanstack/react-router';

import { ChangelogPage } from '@/lib/pages/changelog';

export const Route = createFileRoute('/changelog')({
  component: ChangelogPage,
  head: () => ({
    meta: [
      {
        title: 'Changelog -- SavorSanctum',
      },
      {
        name: 'description',
        content:
          "What's new in SavorSanctum -- product updates and improvements.",
      },
    ],
  }),
});
