import { useLoaderData } from '@tanstack/react-router';

import { CTASection } from './components/cta-section';
import { SomeText } from './components/some-text';

const Home = () => {
  const { foodPlaces } = useLoaderData({ from: '/' });
  console.info({ foodPlaces });
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
      <SomeText />
      <CTASection />
    </div>
  );
};

export default Home;
