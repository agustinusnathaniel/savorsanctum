import type { ComponentType } from 'react';

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

const compareSemver = (a: string, b: string): number => {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);

  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na !== nb) {
      return nb - na;
    }
  }
  return 0;
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
