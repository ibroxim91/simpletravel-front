import { Suspense } from 'react';
import SingleTourClient from './singleTourClient';

export default async function SingleTourPage() {
  return (
    <>
      <Suspense>
        <SingleTourClient />
      </Suspense>
    </>
  );
}
