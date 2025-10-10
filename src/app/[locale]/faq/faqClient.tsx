'use client';

import FaqTabs from '@/features/faq/ui/FaqTabs';
import HeadresFaq from '@/features/faq/ui/HeadresFaq';

const FaqClient = () => {
  return (
    <div className="flex flex-col gap-10 mb-10 overflow-hidden">
      <HeadresFaq />
      <FaqTabs />
    </div>
  );
};

export default FaqClient;
