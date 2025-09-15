'use client';

import Link from 'next/link';

const Welcome = () => {
  return (
    <div className="custom-container h-full bg-accent min-h-[400px] rounded-2xl flex items-center justify-center">
      <Link
        className="github-button"
        href="https://github.com/fiasuz/create-fias"
        data-color-scheme="no-preference: light; light: light; dark: dark;"
        data-icon="octicon-star"
        data-size="large"
        aria-label="Star fiasuz/create-fias on GitHub"
      >
        Star on github
      </Link>
    </div>
  );
};

export default Welcome;
