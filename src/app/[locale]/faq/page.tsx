'use client';
import dynamic from 'next/dynamic';

const HeadresFaq = dynamic(() => import('@/features/faq/ui/HeadresFaq'), {
  ssr: false,
});
const FaqTabs = dynamic(() => import('@/features/faq/ui/FaqTabs'), {
  ssr: false,
});

const Faq = () => {
  return (
    <div className="flex flex-col gap-10 mb-10 overflow-hidden">
      <HeadresFaq />
      <FaqTabs />
    </div>
  );
};

export default Faq;
