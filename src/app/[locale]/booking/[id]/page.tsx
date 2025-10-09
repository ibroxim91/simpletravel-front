'use client';

import dynamic from 'next/dynamic';

const Booking = dynamic(() => import('@/widgets/booking/ui'), { ssr: false });

export default function page() {
  return (
    <div>
      <Booking />
    </div>
  );
}
