'use client';
import MyFavourite from '@/features/saved/ui/MyFavourite';
import { Suspense } from 'react';
const SavedClient = () => {
  return (
    <Suspense>
      <div className="flex flex-col gap-10 mb-10 overflow-hidden">
        <MyFavourite />
      </div>
    </Suspense>
  );
};

export default SavedClient;
