import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/lib/components/ui/badge';

import {
  type ChangelogEntry,
  type ChangelogTag,
  getChangelogEntries,
} from './entries';

const TAG_LABEL: Record<ChangelogTag, string> = {
  fixed: 'Fixed',
  improved: 'Improved',
  new: 'New',
};

const TAG_VARIANT: Record<ChangelogTag, 'default' | 'secondary' | 'outline'> = {
  fixed: 'outline',
  improved: 'secondary',
  new: 'default',
};

const formatDate = (dateString: string): string => {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

function ChangelogCard({ entry }: { entry: ChangelogEntry }) {
  const Content = entry.content;

  return (
    <article className="pb-10 last:pb-0">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Badge variant={TAG_VARIANT[entry.tag]}>{TAG_LABEL[entry.tag]}</Badge>
        <span className="text-sm text-muted-foreground">v{entry.version}</span>
        {entry.date && (
          <span className="text-sm text-muted-foreground">
            {formatDate(entry.date)}
          </span>
        )}
      </div>

      <h2 className="text-xl font-bold text-foreground mb-3">{entry.title}</h2>

      <div className="prose prose-sm prose-neutral max-w-none text-muted-foreground">
        <Content />
      </div>
    </article>
  );
}

export function ChangelogPage() {
  const entries = getChangelogEntries();

  return (
    <div className="wrapper">
      <header className="mb-10">
        <Link
          to="/"
          preload={false}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1>Changelog</h1>
        <p className="text-muted-foreground mt-2">
          What's new in SavorSanctum.
        </p>
      </header>

      <div className="space-y-0">
        {entries.map((entry) => (
          <ChangelogCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </div>
  );
}
