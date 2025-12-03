'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const isScrolled = window.scrollY > 800;
      setIsVisible(isScrolled);
      if (isScrolled) {
        setShouldRender(true);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleAnimationEnd = () => {
    if (!isVisible) {
      setShouldRender(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      onAnimationEnd={handleAnimationEnd}
      className={`fixed bottom-8 right-6 rounded-full bg-primary text-primary-foreground p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 active:scale-95 ${
        isVisible ? 'animate-bounce-in' : 'animate-bounce-out'
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
