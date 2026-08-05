import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, ExternalLink } from 'lucide-react';

import { ImageWithLoader } from '@/lib/components/image-with-loader';
import { Badge } from '@/lib/components/ui/badge';
import { Button } from '@/lib/components/ui/button';
import type { DirectoryItem } from '@/lib/models/collection-data';
import { getItems } from '@/lib/services/notion/get-items';

const FALLBACK_OG_IMAGE =
  'https://og.sznm.dev/api/generate?heading=SavorSanctum&text=Discover%20amazing%20culinary%20experiences%20and%20products&template=color';

function formatAddedDate(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export const Route = createFileRoute('/item/$id')({
  loader: async ({ params }): Promise<DirectoryItem | undefined> => {
    const result = await getItems();
    return result.items.find((item) => item.id === params.id);
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
  }),
  head: ({ loaderData }) => {
    const item = loaderData;
    const title = item
      ? `${item.name} — SavorSanctum`
      : 'Item not found — SavorSanctum';
    const description = item
      ? `A curated find on SavorSanctum: ${item.name}.`
      : 'This item could not be found.';
    const ogImage = item?.image || FALLBACK_OG_IMAGE;

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { name: 'og:type', content: 'website' },
        { name: 'og:title', content: title },
        { name: 'og:description', content: description },
        { name: 'og:image', content: ogImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImage },
      ],
    };
  },
  component: ItemDetailPage,
});

function ItemDetailPage() {
  const item = Route.useLoaderData();

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="mb-4 text-5xl">🍽️</div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Item not found
        </h2>
        <p className="text-muted-foreground text-center mb-6">
          This item may have been removed or the link is incorrect.
        </p>
        <Button render={<Link to="/" />}>
          <ArrowLeft className="h-4 w-4" />
          Back to the collection
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/"
        preload={false}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <article className="rounded-lg bg-card p-4 border border-border">
        {item.image && (
          <ImageWithLoader
            ratio="4/3"
            containerClassName="mb-4 overflow-hidden rounded-md bg-muted"
            className="object-cover"
            src={item.image}
            alt={item.name}
          />
        )}

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {item.name}
        </h1>

        <div className="mt-3 mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize shadow-sm bg-secondary text-secondary-foreground">
            {item.category}
          </span>
          {item.reviews.map((review) => (
            <Badge variant="outline" key={review.name}>
              {review.name}
            </Badge>
          ))}
          {item.tags.map((tag) => (
            <Badge variant="outline" key={tag.name}>
              {tag.name}
            </Badge>
          ))}
        </div>

        {item.location.length > 0 && (
          <p className="text-sm text-muted-foreground mb-6">
            {item.location.map((location) => location.name).join(', ')}
          </p>
        )}

        {item.created_time && formatAddedDate(item.created_time) && (
          <p className="text-xs text-muted-foreground mb-6">
            Added {formatAddedDate(item.created_time)}
          </p>
        )}

        {item.link && (
          <Button
            render={
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="item-detail-visit"
                data-umami-event-itemname={item.name}
              />
            }
            className="w-full"
          >
            <ExternalLink className="h-4 w-4" />
            Visit site
          </Button>
        )}
      </article>
    </div>
  );
}
