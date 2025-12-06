export const Footer = () => {
  return (
    <footer className="wrapper">
      <div className="flex justify-center">
        <p className="text-xs">
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
      </div>
    </footer>
  );
};
