import { debounce } from '@tanstack/react-pacer';
import { useLoaderData, useNavigate, useSearch } from '@tanstack/react-router';
import Fuse from 'fuse.js';
import { MapPin } from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/lib/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/lib/components/ui/card';
import { Input } from '@/lib/components/ui/input';
import { Label } from '@/lib/components/ui/label';

const Home = () => {
  const { foodPlaces } = useLoaderData({ from: '/' });
  const { keyword } = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });

  const handleChangeKeyword = debounce(
    (keyword: string) => {
      navigate({
        to: '/',
        search: (prev) => ({ ...prev, keyword }),
      });
    },
    {
      wait: 500,
    },
  );

  const fused = useMemo(
    () =>
      new Fuse(foodPlaces, {
        includeMatches: true,
        ignoreDiacritics: true,
        threshold: 0.3,
        keys: ['name', ['tags', 'name'], ['location', 'name']],
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

  return (
    <div className="grid lg:grid-cols-[1fr_3fr] gap-4">
      <div className="flex-1/4">
        <Card>
          <CardHeader>
            <CardTitle>Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label>Search</Label>
              <Input
                id="search"
                placeholder="Insert keyword"
                defaultValue={keyword}
                onChange={(e) => handleChangeKeyword(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <CardTitle>{entry.name}</CardTitle>
              <div className="flex gap-2 flex-wrap">
                {
                  // @ts-ignore
                  entry.tags.map((tag) => (
                    <Badge key={tag.name} className="bg-orange-700 font-normal">
                      {tag.name}
                    </Badge>
                  ))
                }
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex gap-1 items-center flex-wrap">
                <MapPin size={16} />
                {/* @ts-ignore */}
                {entry.location.map((loc) => (
                  <Badge key={loc.name} variant="outline">
                    {loc.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
