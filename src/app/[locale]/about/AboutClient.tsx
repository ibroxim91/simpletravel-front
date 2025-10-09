'use client';

import dynamic from 'next/dynamic';

const Sertificat = dynamic(() => import('@/features/about/ui/Sertificat'), {
  ssr: true,
});
const Partner = dynamic(() => import('@/features/about/ui/Partner'), {
  ssr: true,
});
const Header = dynamic(() => import('@/features/about/ui/Header'), {
  ssr: true,
});

const AboutClient = () => {
  return (
    <div className="flex flex-col gap-10 mb-10 overflow-hidden">
      <Header />
      <div className="bg-white p-4">
        <Partner />
      </div>
      <Sertificat />
    </div>
  );
};

export default AboutClient;
