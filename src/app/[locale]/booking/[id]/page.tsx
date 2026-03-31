import { Suspense } from 'react';
import BookingClient from './BookingClient';

export default async function BookingPage() {
  return (
    <>
      <Suspense>
        <BookingClient />
      </Suspense>
    </>
  );
}
