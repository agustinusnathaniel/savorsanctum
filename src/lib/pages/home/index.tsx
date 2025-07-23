import { useLoaderData } from '@tanstack/react-router';
import { MapPin } from 'lucide-react';

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

  return (
    <div className="flex flex-col md:flex-row gap-4">
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
                // defaultValue={searchQuery || ''}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foodPlaces.map((entry) => (
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
