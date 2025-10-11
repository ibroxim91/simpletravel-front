'use client';

import Booking from '@/widgets/booking/ui';
import { Suspense } from 'react';

const BookingClient = () => {
  return (
    <Suspense>
      <div className="flex flex-col gap-10 mb-10">
        <Booking />
      </div>
    </Suspense>
  );
};

export default BookingClient;
