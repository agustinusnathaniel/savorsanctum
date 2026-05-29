import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/lib/components/ui/button';

const Page404 = () => {
  return (
    <div className="grid gap-8 md:grid-cols-2 md:min-h-[60vh] md:items-center">
      <div className="flex justify-center">
        <img
          width={400}
          height={400}
          src="/assets/404 Error-rafiki.svg"
          alt="A confused person looking at a broken page"
          className="max-w-full h-auto"
        />
      </div>

      <div className="text-center md:text-start">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Looks like this page wandered off
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          We couldn&apos;t find what you&apos;re looking for. Maybe a fresh
          start will help you discover something delicious.
        </p>
        <Button render={<Link to="/" />}>
          <ArrowLeft className="h-4 w-4" />
          Back to the collection
        </Button>
      </div>
    </div>
  );
};

export default Page404;
