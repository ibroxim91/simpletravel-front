import MyFavourite from '@/features/saved/ui/MyFavourite';
import { Suspense } from 'react';

const Saved = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-10 mb-10 overflow-hidden">
        <MyFavourite />
      </div>
    </Suspense>
  );
};

export default Saved;
