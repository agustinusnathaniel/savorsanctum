import { Link } from '@tanstack/react-router';

import { version } from '^/package.json';

export const Footer = () => {
  return (
    <footer className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-sm border-t">
      <div className="wrapper py-3">
        <div className="flex justify-center items-center gap-2 text-xs">
          <p>
            {new Date().getFullYear()} -{' '}
            <a
              href="https://agustinusnathaniel.com"
              data-umami-event="footer-site-click"
              target="_blank"
              rel="noopener noreferrer"
            >
              agustinusnathaniel.com
            </a>
          </p>
          <span aria-hidden="true">·</span>
          <Link
            to="/changelog"
            className="hover:text-foreground transition-colors"
            data-umami-event="footer-changelog-click"
          >
            Changelog
          </Link>
          <span aria-hidden="true">·</span>
          <span className="text-muted-foreground">v{version}</span>
        </div>
      </div>
    </footer>
  );
};
