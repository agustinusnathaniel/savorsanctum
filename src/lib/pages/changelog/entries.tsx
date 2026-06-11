import type { ComponentType } from 'react';

import { compareSemver } from './semver';

const mdxModules = import.meta.glob<{
  default: ComponentType;
  date: string;
  tag: 'new' | 'improved' | 'fixed';
  title: string;
  version: string;
}>('/content/changelog/*.mdx', { eager: true });

export type ChangelogTag = 'new' | 'improved' | 'fixed';

export type ChangelogEntry = {
  content: ComponentType;
  date: string;
  slug: string;
  tag: ChangelogTag;
  title: string;
  version: string;
};

export const getChangelogEntries = (): Array<ChangelogEntry> => {
  const entries = Object.entries(mdxModules).map(([path, mod]) => {
    const slug = path.replace('/content/changelog/', '').replace('.mdx', '');

    return {
      content: mod.default,
      date: mod.date,
      slug,
      tag: mod.tag,
      title: mod.title,
      version: mod.version,
    };
  });

  return entries.sort((a, b) => compareSemver(a.version, b.version));
};
