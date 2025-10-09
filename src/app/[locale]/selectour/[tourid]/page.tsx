'use client';
import dynamic from 'next/dynamic';

const SingleTour = dynamic(() => import('@/widgets/singletour/ui'), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="overflow-hidden">
      <SingleTour />
    </div>
  );
}
