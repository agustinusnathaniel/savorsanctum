import { debounce } from '@tanstack/react-pacer';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import Fuse from 'fuse.js';
import { MapPinIcon, SearchIcon } from 'lucide-react';
import { domAnimation, LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { useMemo } from 'react';
import z from 'zod';

import { TextField } from '@/lib/components/text-field';
import { Badge } from '@/lib/components/ui/badge';
import { Button } from '@/lib/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/lib/components/ui/card';
import { getPlaces } from '@/lib/services/notion/food-db';

const placeSearchSchema = z.object({
  keyword: z.string().default('').catch(''),
  page: z.number().min(1).default(1).catch(1),
  pageSize: z.number().default(20).catch(20),
});

const defaultSearchParams: z.infer<typeof placeSearchSchema> = {
  keyword: '',
  page: 1,
  pageSize: 20,
};

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async () => {
    const foodPlaces = await getPlaces();

    return {
      foodPlaces,
    };
  },
  validateSearch: placeSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearchParams)],
  },
  /**
   * prevent running loader again
   * https://tanstack.com/router/v1/docs/framework/react/guide/data-loading#using-shouldreload-and-gctime-to-opt-out-of-caching
   * for this to work we also need to disable or not use loaderDeps
   */
  shouldReload: false,
});

function RouteComponent() {
  const { foodPlaces } = Route.useLoaderData();
  const { keyword, page, pageSize } = Route.useSearch();
  const navigate = Route.useNavigate();

  const fused = useMemo(
    () =>
      new Fuse(foodPlaces, {
        includeMatches: true,
        ignoreDiacritics: true,
        threshold: 0.3,
        keys: [
          'name',
          ['tags', 'name'],
          ['reviews', 'name'],
          ['location', 'name'],
        ],
      }),
    [foodPlaces],
  );
  const filtered = useMemo(
    () =>
      keyword
        ? fused
            .search(keyword)
            .map(({ item, matches }) => ({ ...item, matches }))
        : foodPlaces,
    [fused, keyword, foodPlaces],
  );

  const pageCount = useMemo(
    () => Math.ceil(filtered.length / pageSize),
    [filtered, pageSize],
  );

  const currentPageData = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  );

  const handleChangeKeyword = debounce(
    (keyword: string) => {
      navigate({
        to: '/',
        search: (prev) => ({ ...prev, keyword, page: 1 }),
      });
    },
    {
      wait: 500,
    },
  );

  const handleChangePage = (type: 'next' | 'prev') => {
    const pageIncrement = page !== pageCount ? page + 1 : page;
    const pageDecrement = page !== 1 ? page - 1 : page;
    const updatedPage = type === 'next' ? pageIncrement : pageDecrement;
    navigate({
      to: '/',
      search: (prev) => ({ ...prev, page: updatedPage }),
      resetScroll: false,
    });
  };

  return (
    <div className="grid lg:grid-cols-[1fr_3fr] gap-4">
      <div className="flex-1/4">
        <Card>
          {/* <CardHeader>
            <CardTitle>Filter</CardTitle>
          </CardHeader> */}
          <CardContent>
            <TextField
              id="search"
              prefixIcon={<SearchIcon />}
              placeholder="Insert keyword"
              onValueChange={(value) => handleChangeKeyword(value)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        {!currentPageData.length ? (
          <p className="text-center">Data Tidak Ditemukan</p>
        ) : null}
        {currentPageData.length ? (
          <LazyMotion features={domAnimation}>
            <m.div
              className="grid md:grid-cols-2 gap-4"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {currentPageData.map((entry) => (
                <m.div
                  variants={{
                    hidden: {
                      y: 50,
                      opacity: 0,
                      filter: 'blur(15px)',
                    },
                    show: {
                      y: 0,
                      opacity: 1,
                      filter: 'blur(0)',
                      transition: { type: 'spring' },
                    },
                  }}
                  key={entry.id}
                >
                  <Card className="size-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{entry.name}</CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        {entry.reviews
                          // @ts-expect-error
                          .filter(
                            // @ts-expect-error
                            (item) =>
                              ![
                                'nathan belum coba',
                                'dita belum coba',
                                'recommended',
                              ].includes(item.name),
                          )
                          // @ts-expect-error
                          .map((reviewTag) => (
                            <Badge
                              key={reviewTag.name}
                              className="bg-orange-700 font-normal"
                            >
                              {reviewTag.name}
                            </Badge>
                          ))}
                        {
                          // @ts-expect-error
                          entry.tags.map((tag) => (
                            <Badge
                              key={tag.name}
                              className="bg-orange-700 font-normal"
                            >
                              {tag.name}
                            </Badge>
                          ))
                        }
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      {(entry.location as Array<object>).length ? (
                        <div className="flex gap-1 items-center flex-wrap">
                          <MapPinIcon size={16} />
                          {/* @ts-ignore */}
                          {entry.location.map((loc) => (
                            <Badge key={loc.name} variant="outline">
                              {loc.name}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </m.div>
              ))}
            </m.div>
          </LazyMotion>
        ) : null}

        {currentPageData.length && pageCount ? (
          <div className="ml-auto flex gap-2 items-center">
            <p>
              Page: {page} of {pageCount}
            </p>
            <Button
              onClick={() => handleChangePage('prev')}
              disabled={page === 1}
              hidden={page === 1}
            >
              Prev
            </Button>
            <Button
              disabled={page === pageCount}
              hidden={page === pageCount}
              onClick={() => handleChangePage('next')}
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
