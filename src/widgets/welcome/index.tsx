'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Welcome = () => {
  const t = useTranslations();
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
      {t('salom')}
    </div>
  );
};

export default Welcome;
