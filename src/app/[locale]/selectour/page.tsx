'use client';

import dynamic from 'next/dynamic';
const Selectour = dynamic(() => import('@/widgets/selectour/ui'), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="overflow-hidden">
      <Selectour />
    </div>
  );
}
